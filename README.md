# v2 Monograph Minimal ("the index card")

Portfolio prototype for Hardik Thanth, v2 concept A. The quietest version of the portfolio: a
typeset one-page CV with a work index, services, three principles and contact. The concept is in
`/home/user/protos/_shared/v2/concepts/monograph-minimal.md`; the only content source is
`src/content.json`, copied unchanged from `/home/user/protos/_shared/v2/content-v2.json`.
`PLAN.md` holds the section plan and the phone-height estimate.

## Sections

1. Masthead: monogram and name, nav (Work, Services, Contact), theme toggle. Phones get a second nav row, not a menu.
2. Hero: headline with one highlighted phrase, short bio, "Start a project" and "Download CV", one meta line.
3. Work index: six projects in the concept's order. Each row expands inline to challenge, approach and outcome, with the stack in mono. On desktop, hovering a row shows a code-drawn mock of the project UI next to the cursor. Phones have no preview.
4. Services: four services as a 2x2 list on tablet and up, one column on phones.
5. How I work: three numbered principles.
6. Contact: email (selectable, with a Copy button), LinkedIn, GitHub and CV, then experience and education as short lines.
7. Footer: one line.

## Stack

- Astro 5 (static output, no client framework), TypeScript in strict mode (`astro check`)
- Hand-written CSS with custom-property tokens (`src/styles/tokens.css`, `src/styles/site.css`)
- Fonts self-hosted with fontsource: Archivo Variable (wdth axis for the condensed display), Source Serif 4 Variable, IBM Plex Mono
- Content is typed in `src/lib/content.ts`. Components render only the fields the concept uses.
- One progressive-enhancement script (`src/scripts/site.ts`): theme toggle and copy email. The work-preview cursor tracking sits in `src/components/Work.astro`.

## Scripts

| command | what it does |
| --- | --- |
| `pnpm install` | install dependencies |
| `pnpm dev` | dev server on 127.0.0.1 |
| `pnpm check` | `astro check` |
| `pnpm build` | `astro check`, `astro build` to `dist/`, then `scripts/relativize.mjs` |
| `pnpm preview` | serve `dist/` on 127.0.0.1 |

## Build output and relative URLs

`dist/` is one `index.html` (CSS and script inlined) plus fonts under `dist/_astro/`.
`scripts/relativize.mjs` rewrites every `/_astro/` reference relative to its file, so the site works
from any nested sub-path. The script fails the build if a root-absolute asset reference remains.

## QA

```sh
pnpm build
node /home/user/protos/_tools/qa.mjs dist v2-monograph-minimal 4600
```

QA loads the build from a nested sub-path at 360, 390, 820 and 1440 px. It checks broken requests,
console errors, horizontal overflow, and the phone page height (budget 4600 px). Screenshots go to
`/home/user/protos/_shots/v2-monograph-minimal/`.

## Notes

- Project visuals are code-drawn mocks (`src/components/ProjectMock.astro`), built from each project's
  `visual` hint and `accent`. They are decorative (`aria-hidden`) and shown only on desktop hover.
- The mock preview and the expanded rows use native `<details>`, so the work index works without JavaScript.
- Motion is limited to a short fade on the hero and hover states. `prefers-reduced-motion` turns both off.
- Dark theme follows the system setting unless the toggle has been used. The choice is stored in `localStorage` inside a try block.
