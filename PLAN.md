# Plan: v2 "Monograph Maximal" (slug v2-monograph-maximal)

Phone height budget: 7000 px at 360 and 390. Breakpoints: stacked below 900 px, two-column with a sticky stage at 900 px and up.

## Sections (each one earns its place by helping a client decide)

| # | Section | Content used | Phone estimate |
|---|---------|--------------|----------------|
| 0 | Masthead: name, Contact button, theme toggle, scroll hairline | `person.name`, `person.monogram`, `person.email` | 64 px (sticky) |
| 1 | Hero: promise (mono), statement (h1, unfolds), plain line, two CTAs | `headlines.promise`, `headlines.statement`, `headlines.plain` | ~600 px |
| 2 | Manifesto on inverted ink: three giant lines, words light up with scroll (not pinned) | `manifesto[]` | ~560 px |
| 3 | Selected work: three case studies (wholesale-os, paper-studio, footnote). Mock, Challenge, Approach, Outcome, stack | `projects[]` for those slugs; `client` only when anonymized; `accent`; `visual` drives the mock | 3 x ~640 px |
| 4 | Services: marquee of four titles (decorative), then the four as a row | `services[]` (`title`, `line`) | ~520 px |
| 5 | Also built: four rows, title and one-liner (GitHub link where given) | medjot, dhi, net-watch, kiln-ui | ~420 px |
| 6 | Contact: headline (`headlines.studio`), selectable email with copy, links, availability | `person.email`, `person.links`, `person.availability`, `person.location`, `person.timezone` | ~560 px |
| 7 | Footer | `footer` | ~90 px |

Estimated phone total: ~5.5k px including section padding (64 px per section on phones).

## Removed on purpose
- Services and studio offers, FAQ, process steps, experience, education, skills, principles: not in the concept, and they do not help a client decide in the first screen.
- fieldbook: not in the concept's "Also built" list.
- Any workflow or process detail (agents, pipelines, counts): excluded by the brief.

## Motion (never blocks)
- Hero statement unfolds from wdth 62 to 100 with a 1 s stagger. Word boxes are width-locked, so the wrap does not jump. Content is readable underneath.
- Section titles (desktop only) scrub from wdth 62 to 100 as they cross the viewport. Phones get no scrub, so nothing reflows while scrolling.
- Manifesto words scrub from dim to full opacity. Not pinned, on any device.
- Highlighter marks draw in once when they enter the viewport.
- Case studies: desktop uses a sticky stage with cross-fading Challenge, Approach and Outcome layers. Phones use stacked cards with fade-up reveals.
- Marquee of service titles, static under reduced motion, paused on hover.
- Magnetic primary buttons and a cursor ring on fine pointers only. Lenis smooth scroll on desktop only.
- `prefers-reduced-motion`: no unfold, no scrub, no marquee, no Lenis, no magnetic, no ring. Every state is final and readable.

## Engineering
- Astro 5 static build, relativize step kept, GSAP 3.15.0 (ScrollTrigger, SplitText) and Lenis 1.3.26 pinned exactly.
- Fonts self-hosted via fontsource (Archivo variable with wdth and wght, Source Serif 4, IBM Plex Mono).
- Copy email: selectable address, copy button, clipboard fallback, never claims a message was sent.
- Theme choice in localStorage inside try/catch. Core behaviour does not depend on it.
