# KaRe-Arte — public website (apps/web)

Next.js (App Router, static export). BG at `/`, EN at `/en/`. Day/night theme (auto by Sofia time + toggle).

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm run images       # rebuild public/img from brand-assets (content/media.json)
npm run video        # rebuild public/video from brand-assets/video (needs ffmpeg + cwebp)
```

## Where things are
- `content/` — all texts and data (menu, events, reviews, vlog, FAQ, floor plan). Same shapes the CMS (М7) will serve later.
- `content/floorplan.ts` — the venue plan (zones, tables, seats, photo per table). Drawn from Kalina's photos in `brand-assets/venue/`.
- `lib/reservations.ts` — reservation API surface (availability, slots, create, cancel, .ics). **Frontend only:** with no `NEXT_PUBLIC_API_URL` it uses deterministic mock availability; set the env var to point at apps/api later.
- `components/client/FloorPlan.tsx` — shared plan component: `explore` (site) and `pick` (booking). Admin `edit` mode comes with М4.

## Media
- `brand-assets/venue/` — Kalina's own photos (Nov 2026), safe to publish.
- `brand-assets/video/` — reels from @kare.arte (their own account).
- `brand-assets/raw/` — third-party/press photos used as placeholders. **Replace before launch** (rights, see brand-assets/SOURCES.md).

## Demo data to replace before launch
Menu prices (`MENU_IS_DEMO`), event dates/prices (`EVENTS_ARE_DEMO`), domain in `content/site.ts`, privacy page company details.
