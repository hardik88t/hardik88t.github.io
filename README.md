# v5 "Perfect Imperfect + Canvas"

The v3 Perfect Imperfect page, unchanged, with the v2 design canvas of real product screens opened as a
full-screen overlay. The page is a portfolio plus a design-system page (`#system`), built as one static page.
The idea: every imperfection is deliberate, seeded at build time, and free. The work is shown perfect: the
canvas is never imperfect. See `PLAN.md` for the page and `_shared/v5/imperfect-canvas.md` for this version.

## Stack

- Astro 5 (static output, `inlineStylesheets: never`, one external stylesheet), TypeScript, hand-written CSS
- React only inside the work canvas (`@astrojs/react`). The page ships no React: the canvas chunk loads on the
  first open, and the page's own script loads it with a plain dynamic import
- Fonts: Fraunces and Recursive for the page (self-hosted, subset). The canvas adds Instrument Sans for its
  chrome, and the mock screens keep IBM Plex Sans and Nunito Sans (fontsource, loaded only when the canvas opens)
- Content: `src/data/content-v2.json`, the only content source. Each project entry carries the title, caption
  facts, one-liner and the canvas sticky note (`sticky`), so the page and the canvas read the same strings

## Build

```sh
pnpm install
pnpm build        # astro check, astro build, then scripts/relativize.mjs
```

Output is `dist/`. `scripts/relativize.mjs` rewrites every `/_astro/` reference to a relative path, so the
site works from any sub-path. Preview with `pnpm preview` (binds to 127.0.0.1).

## Work canvas

- Opened by `#work` (first project) or `#work-<slug>` (a project), from "Open the work canvas" under the work
  heading, and from "View screens" in each project dialog. Phones get the swipe gallery and a full-screen viewer.
- `src/scripts/canvas.ts` routes the hash, pushes one history entry, makes the page inert and keeps its scroll
  position. Escape and Close return focus to the opener. Back closes the canvas.
- `src/canvas/`: the overlay (`mount.tsx`, `Overlay.tsx`), desktop canvas and controller, phone gallery,
  layout and copy. `src/mocks/` holds the six project screens. `src/lib/projects.ts` is the one list of
  the six projects in their order, used by the page and the canvas.
