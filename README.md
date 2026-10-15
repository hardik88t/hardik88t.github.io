# astro-editorial (Concept C, "Monograph")

Typographic, light-first portfolio prototype for Hardik Thanth. Editorial layout on a 12-column grid,
with the agent-driven delivery pipeline as the centrepiece. The concept and art direction are in
`/home/user/protos/_shared/concepts/astro-editorial.md`; the content is `src/content.json`, copied
unchanged from `/home/user/protos/_shared/content.json`.

## Stack

- Astro 5 (static output, no client framework), TypeScript in strict mode (`astro check`)
- Hand-written CSS with custom-property tokens (`src/styles/tokens.css`, `src/styles/site.css`)
- Fonts self-hosted with fontsource: Archivo Variable (wdth and wght axes), Source Serif 4 Variable,
  IBM Plex Mono
- Content is typed in `src/lib/content.ts`. Components never hard-code facts.
- One small progressive-enhancement script (`src/scripts/site.ts`): theme toggle, copy email, mobile menu

## Scripts

| command | what it does |
| --- | --- |
| `pnpm install` | install dependencies |
| `pnpm dev` | dev server on 127.0.0.1 |
| `pnpm check` | `astro check` (type diagnostics for `.astro` and `.ts`) |
| `pnpm build` | `astro check`, `astro build` to `dist/`, then `scripts/relativize.mjs` |
| `pnpm preview` | serve `dist/` on 127.0.0.1 |

## Build output and relative URLs

`dist/` is one `index.html` (CSS and script inlined) plus fonts under `dist/_astro/`. Astro emits
root-absolute `/_astro/` URLs, so `scripts/relativize.mjs` rewrites each one relative to the file it
sits in (`./_astro/...`). The site therefore works from any nested sub-path. The script exits with an
error if a root-absolute asset reference remains.

## QA

```sh
pnpm build
node /home/user/protos/_tools/qa.mjs dist astro-editorial
```

The QA script serves `dist/` from a nested sub-path on 127.0.0.1 and checks broken requests, console
errors and horizontal overflow at 390, 820 and 1440 px. Screenshots go to
`/home/user/protos/_shots/astro-editorial/`.

## Notes

- The pipeline diagram draws itself with `stroke-dashoffset` tied to scroll (`animation-timeline: view()`).
  A faint track is always visible, and the accent line rests fully drawn without that support or under
  reduced motion.
- Project previews are CSS-only. Hover or focus a row to see one. Case studies are native `<details>`.
- Dark theme follows the system setting unless the toggle has been used. The choice is stored in
  `localStorage` inside a try block.
