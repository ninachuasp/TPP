/* Plonk service worker: network-first for the app shell (so updates land
 * immediately), cache fallback for offline. Cross-origin requests (map
 * tiles, Supabase, OSRM, Wikipedia) pass straight through untouched. */
const CACHE = "plonk-v1";
const SHELL = ["./", "./index.html", "./vendor/leaflet.css", "./vendor/leaflet.js", "./vendor/supabase.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: url.pathname.endsWith("index.html") || url.pathname.endsWith("/") }))
  );
});
