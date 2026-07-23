// Plonk — short-link resolver.
// Expands a maps.app.goo.gl / goo.gl short link into coordinates by following
// the redirect server-side (browsers can't: Google sends no CORS headers).
// Deploy:  supabase functions deploy resolve-maps --no-verify-jwt
// Called from the app as POST { url } -> { lat, lng, url } | { error }.

const cors: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function parseCoords(s: string): { lat: number; lng: number } | null {
  const m =
    s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
    s.match(/[?&#]q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    s.match(/\/(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    s.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  return m ? { lat: +m[1], lng: +m[2] } : null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const { url } = await req.json();
    if (!url || !/goo\.gl/.test(url)) return json({ error: "not a short link" }, 400);

    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PlonkBot/1.0)" },
    });
    // Coordinates usually appear in the final URL; if not, scan the HTML body.
    let coords = parseCoords(res.url);
    let name: string | null = null;
    if (!coords) {
      const body = await res.text();
      coords = parseCoords(body);
      const t = body.match(/<title>([^<]+)<\/title>/);
      if (t) name = t[1].replace(/ - Google Maps.*$/i, "").trim();
    }
    if (!coords) return json({ error: "no coordinates found" }, 422);
    return json({ ...coords, url: res.url, name });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
