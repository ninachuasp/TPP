# Jaunt 🧭

**Little adventures, planned together.** A link-first, real-time group road-trip planner — built and
test-driven with a **Sapporo road trip**. Investor memo: `pitch.html`.

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

## Product features (beyond the basics)

- **🔥 Voting** on stops and **✓ visited** tracking (pins turn gold). The client
  feature-detects `votes` / `visited` columns on `trip_stops`: if present they sync
  through the database like everything else; if absent they fall back to per-device
  localStorage. To enable sync, run once in the Supabase SQL editor:
  ```sql
  alter table trip_stops add column votes jsonb not null default '{}';
  alter table trip_stops add column visited boolean not null default false;
  ```
- **🧭 Go** — one-tap Google Maps navigation to any stop, for use on the road.
- **Real road routing** — day routes and drive times come from the public OSRM
  server (cached per route; badge shows exact time + km, and the map draws the
  actual road geometry). Offline or if OSRM is unreachable, it falls back to a
  straight-line estimate (marked with ≈) and dashed lines. Badges turn amber
  past 3 h, red past 4.5 h.
- **Google Takeout import** — the ⬆ Import button accepts, besides trip JSON:
  Takeout's `Saved Places.json` (exact pin coordinates) and saved-list CSVs
  (`Title,Note,URL` — coordinates parsed from the URL when present, otherwise
  geocoded by name via Nominatim at ~1/s). Imports land in a "📥 Imported ideas"
  day, and in live mode they insert into the shared database.
- **Crew-aware days** — presence dots derived from day titles (crew A / crew B / all 4).
- **Collapsible days** with a **TODAY** highlight (parsed from day titles) during the trip.
- **Offline-first live mode** — the last synced copy paints instantly on load and
  whenever there's no signal; a status chip shows synced / syncing / offline.

## Roadmap ideas

- Sync votes/visited/travelers (the migration above)
- Real routing times via OSRM's free API
- Google Takeout import for whole saved-places lists
- oEmbed previews for Instagram/TikTok links (thumbnail cards instead of chips)
- Booking-affiliate integration from inside the itinerary
