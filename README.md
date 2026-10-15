# Perfect Imperfect: Maximal (v4)

A portfolio for Hardik Thanth, built on the v3 "Perfect Imperfect" design system and extended with real
product visuals, deeper case studies and a short home page for phones. Branch `proto-v4/imperfect-maximal`.

## Concept

- **Home** (short): hero, a contact sheet of six real screens, four service stamps, a recent strip and the
  contact letter. About 2,450px tall at 390 wide (budget 3,600px).
- **#work**: on desktop, a pannable pinboard of eight project clusters with an index table beside it. On
  phones and without JS, a list of cards with swipeable screen strips.
- **#work-<slug>**: one case study per project (challenge, approach, outcome, what I did, 2 or 3 screens,
  one design note, stack, previous and next).
- **#about**: story, how I work, services in detail, how a project goes, experience, availability.
- **#system**: the design system, with the components added in this version documented.

Views are chosen by the hash (`#home`, `#work`, `#work-<slug>`, `#about`, `#system`). `:target` does this
with or without JS, and JS adds titles, focus and scroll-to-top. Back and Forward work.

Screens are shown as **riso prints**: two inks on paper (ink plus the project's accent mapped to the nearest
riso ink), halftone midtones, misregistration and ink texture. Each print opens its **true-colour proof** in a
lightbox on a paper mat with crop marks.

## Project status

Three projects are **concept** placeholders in `src/data/content-v2.json` and are shown here because they were
requested: **Fieldbook**, **Footnote** and **Kiln UI**. They must be built or replaced before launch.

## Content

`src/data/content-v2.json` is the source of truth for facts. `src/lib/cases.ts` holds the per-project view
data: the "what I did" lines (restating the approach and stack), one design note each, and the pinboard
layout. No new facts, numbers, clients or testimonials were added.

Open items to confirm: the case-study "role" line reads "Design and build" for every project.

## Stack and build

Astro 5 (static) with TypeScript and hand-written CSS. Sharp (0.35.3) is the image service.

```
pnpm install
pnpm build        # astro check, astro build, scripts/relativize.mjs
```

Output: `dist/`. Relative asset URLs, so it works from any sub-path.

## Visuals pipeline (`tools/screens`)

A dev-only harness renders each product mock at its design size. `capture.mjs` screenshots it at 2x (and
crops named regions). `riso.py` writes the two-ink prints and true-colour proofs into `src/assets/screens/`.
Run the harness with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5179` inside
`tools/screens`, then `node capture.mjs` and `python3 riso.py`. Raw captures are not committed.

## QA (`tools/qa`)

- `qa.mjs`: every view at 360, 390, 820 and 1440. Horizontal overflow, console errors, failed requests,
  CLS, and home height against the 3,600px budget. Add `--shots` for screenshots.
- `interact.mjs`: pinboard keys, drag, wheel and Control-wheel zoom, minimap, the lightbox, view switching
  with Back and Forward, and phone strips.
- `shots.mjs`: review screenshots. `weight.mjs`: page weight by type.

Run `pnpm build` before the QA scripts. They test `dist/`.

## Anti-UX checklist

No scroll-jacking, smooth-scroll library or custom cursor. No preloader, intro or autoplay. No carousel that
advances on its own. Nothing hover-only: every action is reachable by tap and keyboard. No modal or toast on
load. Back always does what it should. Zoom is never disabled. No text baked into images. Tap targets are at
least 44px. Reduced motion stops the settle, the draw-in and the hover nudges. The wheel scrolls the page
wherever the pinboard cannot move.
