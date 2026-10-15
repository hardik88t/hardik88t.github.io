# v2-monograph-maximal: "The typographic stage"

Portfolio prototype for Hardik Thanth, v2 "Monograph Maximal". The concept is in
`/home/user/protos/_shared/v2/concepts/monograph-maximal.md`. The copy is `src/content.json`, a copy of
`/home/user/protos/_shared/v2/content-v2.json`, and that file is the only content source. `PLAN.md` holds
the section plan and the phone height estimate.

Typography from v1 (Archivo variable with both wdth and wght axes, Source Serif 4, IBM Plex Mono), in ink
and paper with an ultramarine accent and a highlighter. Motion is expressive but never blocks reading.

## Sections

1. Masthead: name, Contact, theme toggle, scroll hairline.
2. Hero: promise (mono), statement (the h1, unfolds on load), plain line, two actions.
3. Manifesto on an inverted stage: words light up as you scroll (not pinned).
4. Selected work: wholesale-os, paper-studio, footnote. Desktop uses a sticky stage that cross-fades between
   Challenge, Approach and Outcome. Phones stack the cards.
5. Services: a marquee of the four titles (decorative), then the four as a row.
6. Also built: medjot, dhi, net-watch, kiln-ui.
7. Contact: selectable email with copy, links, availability. Footer.

## Stack

- Astro 5 (static output), TypeScript strict (`astro check`)
- GSAP 3.15.0 (ScrollTrigger, SplitText) and Lenis 1.3.26 (desktop with a fine pointer only), pinned exactly
- Hand-written CSS with tokens in `src/styles/tokens.css`. The mockups are HTML/CSS in
  `src/components/mocks/` and are scaled by container query units.
- Fonts self-hosted with fontsource

## Scripts

| command | what it does |
| --- | --- |
| `pnpm install` | install dependencies |
| `pnpm dev` | dev server on 127.0.0.1 |
| `pnpm check` | `astro check` |
| `pnpm build` | `astro check`, `astro build` to `dist/`, then `scripts/relativize.mjs` |
| `pnpm preview` | serve `dist/` on 127.0.0.1 |

## Build output and relative URLs

`dist/` is one `index.html` with CSS inlined, plus fonts and the script chunks under `dist/_astro/`.
`scripts/relativize.mjs` rewrites every `/_astro/` reference relative to its file, so the site works from any
sub-path. The script fails the build if a root-absolute asset reference remains.

## Motion and reduced motion

- `html.motion` is set by an inline head script only when `prefers-reduced-motion` is not requested. CSS
  start states (the hero at wdth 62, the dimmed manifesto words, the highlight bars) apply under that class
  only. Without it, and without JS, every state is final and readable.
- Hero unfold: letters go from wdth 62 to 100 over one second. Words are width-locked first, so lines do not
  re-wrap mid-animation.
- Section titles stretch with scroll on desktop only, so phones never reflow while scrolling.
- Case-study stage: `src/scripts/site.ts` picks the step nearest the viewport middle and sets `data-state` on
  the card. The overlays sit outside the mock window, so they never cover UI.
- No pinning on any device. No scroll-jacking on phones (Lenis is off below 900 px and on touch).

## QA

```sh
pnpm build
node /home/user/protos/_tools/qa.mjs dist v2-monograph-maximal 7000
node /home/user/protos/_tools/scrollshots.mjs dist v2-monograph-maximal desktop 10
```

The QA script serves `dist/` from a nested sub-path and checks broken requests, console errors and horizontal
overflow at 360, 390, 820 and 1440 px. It exits non-zero if the page is taller than the phone budget (7000 px
at 360 or 390), so a long phone page is treated as a defect.
Screenshots go to `/home/user/protos/_shots/v2-monograph-maximal/`.

Checks run by hand for this prototype: no horizontal overflow at 360, 390, 768, 1024 and 1440; reduced motion
in Playwright (`emulateMedia({ reducedMotion: 'reduce' })`) with every state final; no-JS render complete;
dark theme.

## Notes

- Dark theme follows the system setting unless the toggle has been used. The choice is stored in
  `localStorage` inside a try block, and the page does not depend on it.
- The copy button reports only the clipboard result. Nothing on the page claims a message was sent.
