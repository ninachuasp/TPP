# Trip Pin Planner 🗾

A collaborative road-trip planner — built and test-driven with a **Sapporo road trip**.

Open `index.html` in any browser (no build step, no server needed). It ships pre-seeded
with a classic Hokkaido road-trip itinerary that you can edit, reorder, or wipe.

## What it does

- **Interactive map** (Leaflet + OpenStreetMap) with numbered, color-coded pins per day
  and dashed route lines showing each day's driving order.
- **Add places** three ways:
  1. Paste a **full Google Maps URL** — coordinates and place name are parsed out of it.
  2. Paste raw coordinates (`43.06, 141.35`).
  3. Type a place name — free geocoding via OpenStreetMap Nominatim.
- **Attach links to any stop**: Google Maps, Instagram posts/stories, TikTok, Tabelog,
  booking pages — auto-labeled by domain and shown as tap-able chips on the stop and
  in its map popup.
- **Notes** per stop (what to order, parking tips, opening hours).
- **Days**: add/rename/remove days, move stops between days, reorder within a day.
- **"Added by" attribution** so you can see who suggested each pin.
- **Share trip link**: one click copies a URL with the entire trip encoded in it —
  send it to your travel crew, they add their pins, and share a link back. No accounts,
  no server.
- **Export / Import JSON** for backups and merging.
- **Print itinerary** — a clean, map-free day-by-day list for the glovebox.

### A note on `maps.app.goo.gl` short links

Google's shortened share links don't contain coordinates and can't be resolved from
a static page (no API, CORS-blocked). The workflow: open the short link in a browser,
then copy the **full URL from the address bar** (it contains `!3d…!4d…` or `@lat,lng`)
and paste that into the app. For whole saved lists, Google Takeout can export
"Saved Places" as JSON/CSV, which can be imported here with a small converter.

## Architecture (v1: serverless)

Deliberately a single HTML file:

- **State**: one JSON document (`{title, days: [{title, stops: [{name, lat, lng, links, notes, addedBy}]}]}`)
  persisted to `localStorage`.
- **Collaboration**: the share button base64-encodes the trip into the URL fragment.
  Opening a shared link imports that snapshot. Async, link-passing collaboration —
  like sharing a Google Doc by emailing copies.
- **Zero dependencies to operate**: host it anywhere static (GitHub Pages, Netlify,
  Vercel) and it just works.

## Roadmap (v2: real-time multi-user)

When link-passing gets annoying, swap `localStorage` for **Supabase**:

1. `trips` + `stops` tables, row-level security keyed on a trip's share token.
2. Replace `save()` with an upsert; subscribe to `postgres_changes` on the trip's
   channel so everyone's map updates live.
3. Magic-link or anonymous auth — the trip URL *is* the invite.

Everything else (parsing, map rendering, UI) carries over unchanged — the state layer
is the only thing that swaps. Other v2 candidates:

- oEmbed previews for Instagram/TikTok links (thumbnail cards instead of chips)
- Driving-time estimates between stops via OSRM's free routing API
- Voting/reactions on wishlist pins to settle itinerary debates
