# v3 "Monograph + Canvas" (hybrid)

Portfolio prototype for Hardik Thanth. Monograph Minimal is the site; the design canvas of the product
screens is the way to look at the work. One brand, two modes: **read** (the page) and **explore** (the
overlay). Concept and rules: `/home/user/protos/_shared/v3/hybrid.md` (includes THE DESIGN-SYSTEM CONTRACT)
and `/home/user/protos/_shared/v2/BRIEF-v2.md`. The only content source is `src/content.json`, copied
unchanged from `/home/user/protos/_shared/v2/content-v2.json`.

## What the reader gets

- **Page** (unchanged Monograph Minimal, with additions): masthead (Work, Services, Contact, Canvas),
  hero, Projects index of eight projects, services, approach, contact, footer.
- **Projects index**: each row expands to challenge, approach, outcome and stack, then a "View screens"
  link into the overlay. On desktop (1180 px and up, fine pointer), hovering a row shows the same mock
  the canvas uses, in the empty band between the one-liner and the type column (290 px, or 320 px from
  1280 px). It is hidden while any row is open, because an open row's text runs into that band.
- **Overlay** (`#work`, `#work-<slug>`): opened from the Canvas link, "View screens", or "Explore all
  work on the canvas".
  - 900 px and up: a pannable, zoomable design canvas of eight frames in the index order. Drag, wheel to
    zoom at the cursor, double-click a frame to focus, ← → between frames, 0 fits all, + and − zoom.
    The start view is the target frame and its margin note, with neighbours peeking in.
  - Below 900 px: a swipe gallery starting at the target project. Tap a frame for the full-screen viewer.
- **Routes**: `#work` opens at the first project; `#work-<slug>` opens on that project; loading a page
  with either hash opens the overlay directly. Opening pushes a history entry, so Back closes it. Esc and
  Close do the same and return focus to the link that opened it.

## Architecture

- Astro 5, static output, `@astrojs/react` for the mock screens and the overlay. Relative asset URLs.
- `src/components/*.astro`: the page. `Work.astro` renders the index; `ProjectPreview.tsx` renders the
  hover preview at build time (no client directive, so no React runtime on the page).
- `src/scripts/canvas.ts`: routes, history, `inert` on the page behind an open overlay, focus return.
  It imports the overlay only on the first open (or on hover or focus of a link to it). The home page
  loads about 5 KB of script and no React.
- `src/canvas/`: the overlay. `mount.tsx` (lazy entry), `Overlay.tsx` (dialog, focus trap, mode switch),
  `DesktopCanvas.tsx` with `controller.ts` (pan, zoom, camera), `MobileGallery.tsx` (gallery and viewer),
  `layout.ts` (eight frames, one order), `copy.ts`, `chrome.css` (chrome, tokens only).
- `src/mocks/`: the product screens, copied unchanged from v2 except for a type-only guard in `Dhi.tsx`.
  `NetWatch.tsx` is new: two Android-style screens (connection timeline with drop markers, and export
  report), accent `#10B981`.
- `src/styles/tokens.css` and `site.css`: Monograph tokens and page styles.

## Stack

- Astro 5.18, React 19 (`@astrojs/react` 4.4), motion 12 (camera tween only)
- Fonts (self-hosted, fontsource): Archivo Variable (display), Source Serif 4 (text, notes), IBM Plex Mono
  (labels). IBM Plex Sans and Nunito Sans are loaded for the mock screens only. Instrument Sans is not used.

## Build and QA

```sh
pnpm install
pnpm dev        # 127.0.0.1 only
pnpm build      # astro check, astro build to dist/, scripts/relativize.mjs
node /home/user/protos/_tools/qa.mjs dist v3-hybrid 4900
```

`scripts/relativize.mjs` rewrites every `/_astro/` reference to a relative one, so `dist/` works from
any sub-path. This covers the `<link href>` stylesheet references and the `url()` references inside the
CSS (fonts). Stylesheets are external (`inlineStylesheets: 'never'`), so they cache.

`astro.config.mjs` also sets `modulePreload: false` and `cssCodeSplit: false`. Vite's preload helper
writes root-absolute `/_astro/...` links that break under a sub-path, and it preloads a dynamic chunk's
CSS the same way, which made the overlay fail to open. With these settings the overlay chunk has no
preload list and no CSS of its own. The home page loads the Base script and two stylesheets; React and
the overlay load on first open.

Phone height (QA budget 4900 px): 4835 px at 360 wide, 4692 px at 390 wide.

Interaction and screenshot checks (Playwright, scratch scripts, not in the repo): Esc, Back, focus return,
deep links, arrow keys, fit-all, dark theme, phone gallery and viewer, Tab trap (50 presses, no escapes),
scroll preservation, breakpoint switch while open, no console errors. Screenshots are in
`/home/user/protos/_shots/v3-hybrid/checks/`.

## Design-system contract (checked)

- Chrome CSS (`src/canvas/chrome.css` and the `.work-preview`, `.pv` and explore rules in `site.css`):
  no hex or rgb values, no shadows, radii 0 or 2 px, no Instrument Sans, no transitions except the
  overlay entrance (250 ms) and the camera tween (0.55 s, ease-out, instant under reduced motion).
  Checked in the source and in the built CSS (80 chrome rules).
- The mock screens keep their own styles and fonts. They are the only exception.
