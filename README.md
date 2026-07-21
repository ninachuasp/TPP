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

## Architecture

Still a single HTML file (plus vendored Leaflet/supabase-js in `vendor/`, so the app
also works offline), with two modes:

- **Local mode** (open `index.html` with no query string): the trip lives in
  `localStorage`. Share via the URL-snapshot link or Export/Import JSON.
- **Live mode** (`index.html?trip=<uuid>`): the trip lives in Supabase
  (`trip_trips` / `trip_days` / `trip_stops` tables). Every edit is written to the
  database, and a realtime subscription on `postgres_changes` pushes everyone
  else's edits onto your screen within a second. The **⚡ Go live** button promotes
  a local trip into a live one and switches the URL.

Access model: the trip's unguessable UUID *is* the invite — anyone holding the link
can read and edit that trip (no accounts). The anon key in the page is a publishable
key and the Supabase project's schema contains only these trip tables.

## Roadmap ideas

- Crew timeline: travelers with date ranges, so each day shows who's actually there
- Pin voting (🔥/😐) to settle wishlist debates
- Driving-time meter per day via OSRM's free routing API
- oEmbed previews for Instagram/TikTok links (thumbnail cards instead of chips)
- Trip-day companion mode: today's stops, one-tap navigate, ✅ visited pins
