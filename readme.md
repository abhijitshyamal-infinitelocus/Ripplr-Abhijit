# Ripplr — marketing site

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · Motion · Lenis · pnpm

## Run

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

## Structure

- `content/*.json` — all copy, stats, media paths and nav. Pages read from here; edit JSON, not components.
- `public/` — brand SVGs, logos, Figma exports (webp posters + webm/mp4 loops).
- `src/app/` — one route per content file: `/`, `/about-us`, `/services/distribution`, `/services/logistics`, `/culture`, `/careers`, `/esg`, `/contact-us`.
- `src/components/fx/` — animation primitives: `Reveal`, `SplitText`, `Counter`, `Marquee`, `Magnetic`, `Tilt`, `Parallax`, `Cursor`, `Preloader`.
- `src/components/sections/` — page sections (hero, stats band, India map, services showcase, contact card, …).
- `src/lib/cities.ts` — lat/lng for every city named in the network content (feeds the SVG map).

## Media pipeline

The Figma exports ship on a white studio backdrop. Two scripts key that out so artwork floats on the dark site:

- `scripts/remove_media_bg.py` — flood-fills the light backdrop from the frame edge (bounded by object rims), turns its luminance into alpha (shadows stay soft), writes RGBA `.webp`. Can also emit VP9/HEVC-alpha video, though the site currently uses stills only.
- `scripts/posters_from_videos.py` — rebuilds each video-backed poster from the video's **final** frame (the completed composition), keyed as above.

Untouched sources are copied to `media-originals/` (gitignored). Requires `ffmpeg` and `opencv-python`/`numpy`.

## Not wired yet

Forms (`EnquiryForm`) validate client-side and show a success state, but don't POST anywhere. Add an API route or a form service and call it from `EnquiryForm.onSubmit`.
