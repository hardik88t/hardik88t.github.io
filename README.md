# v3 "Perfect Imperfect"

A portfolio for Hardik Thanth plus a design-system page (`#system`), built as one static page.
The idea: every imperfection is deliberate, seeded at build time, and free (CSS transforms, paint and
inline SVG only; no layout shift, no JS for imperfections, no blur on text). See `PLAN.md`.

## Stack

- Astro 5 (static output, `inlineStylesheets: always`), TypeScript, hand-written CSS
- Fonts: Fraunces and Recursive, self-hosted, instanced to the axes used and subset to Latin (`scripts/subset-fonts.py`, output 154KB in `src/fonts/`), `font-display: optional`
- One small bundled script (`src/scripts/site.ts`): theme toggle, copy email, dialogs, view switch
- Content: `src/data/content-v2.json` (copied from `_shared/v2`, the only content source)

## Build

```sh
pnpm install
pnpm build        # astro check, astro build, then scripts/relativize.mjs
```

Output is `dist/`. `scripts/relativize.mjs` rewrites every `/_astro/` reference to a relative path, so
the page works from any sub-path. Preview with `pnpm preview` (binds to 127.0.0.1).

## Layout

- `src/lib/seed.ts`: deterministic seeds (FNV-1a) for tilts, nudges, marks and heading axes
- `src/lib/palette.ts`: the one source for colour tokens (CSS and the contrast table use it)
- `src/lib/contrast.ts`: WCAG contrast at build time
- `src/components/PrintArt.astro`: the six riso prints, drawn as two-ink SVG
- `src/styles/`: `base.css` (perfect elements), `imperfect.css` (the imperfections), `sections.css`, `system.css`

## Availability

`person.availability` in `src/data/content-v2.json` drives the hero line.
`mode: "auto"` shows "Taking on new projects for {early|mid|late} {YYYY}" for today + `leadWeeks`
(Jan-Apr early, May-Aug mid, Sep-Dec late). The build renders it, and a tiny inline script corrects it
during parse. `mode: "fixed"` shows `fixedText`; `mode: "booked"` shows "Fully booked right now. Say hello anyway."
