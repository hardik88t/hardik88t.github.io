# Swarm (v2): Hardik portfolio prototype

Concept "four shapes, four things I do" (`_shared/v2/concepts/swarm.md`). A WebGL particle swarm
morphs through four shapes while the page tells four short chapters: one developer, a team of AI
agents, web apps, and mobile and desktop apps. Each chapter has one or two proof projects that open
a detail sheet. Content comes only from `src/content-v2.json` (a copy of `_shared/v2/content-v2.json`).

## Stack

- Vite 6.4.4, TypeScript 5.9.3 (vanilla, no UI framework)
- three 0.186.1 with a custom ShaderMaterial (one `Points` draw call, morphing in the vertex shader)
- GSAP 3.15.0 with ScrollTrigger; Lenis 1.3.26 for smooth scroll (off under reduced motion)
- Fonts via fontsource: Bricolage Grotesque Variable (display), Hanken Grotesk Variable (body),
  Geist Mono (labels). Self-hosted, no external requests at runtime.

## Scripts

```sh
pnpm install
pnpm dev         # Vite dev server on 127.0.0.1:3004
pnpm typecheck   # tsc --noEmit
pnpm build       # typecheck + static build into dist/ (relative base './')
pnpm preview     # serve dist/ on 127.0.0.1:3004
```

The build output in `dist/` works from any nested sub-path: all asset URLs are relative.

Debug: `#state-0` to `#state-4` renders one morph target with no drift. `&count=N` forces the particle count.

## Page structure

1. Hero (cloud state): name, role, headline, "Start a project" and "See what I do".
2. Story: four chapters. Desktop pins a stage and fades chapters in turn. Phones stack them over
   the fixed swarm. Proof cards open a sheet with challenge, approach, outcome and stack.
3. Closing band: AI features and UI/UX and design systems.
4. Contact: the address (selectable, with a copy button), availability, LinkedIn, GitHub, CV.
5. Footer: one line.

## How it is built

- `src/swarm/` is the v1 engine, unchanged. `targets.ts` samples the five shapes (cloud, core,
  agent clusters, browser window, phone). `renderer.ts` runs the loop and layout. `fallback.ts`
  draws the same targets as static SVG dots when WebGL is unavailable.
- `src/sections/chapters.ts` maps chapters to morph states. On desktop, scroll progress picks the
  chapter. On phones, the chapter whose copy sits nearest the middle of the screen is active.
- `src/sections/mocks.ts` draws each proof mockup as code (SVG with UI labels), built from the
  project's `visual` text and accent.
- `src/sections/proof.ts` renders the proof cards and the sheet (native `<dialog>`, a bottom sheet
  on phones). Anonymised projects show the generic client and never a link.
- `src/lib/scroll.ts` owns Lenis and the scroll lock used while a sheet is open.

## Notes

- Shown proofs: wholesale-os, paper-studio (web); fieldbook, net-watch, dhi (mobile and desktop).
  medjot, footnote and kiln-ui are not on the page, following the concept.
- fieldbook has `status: concept` in the content file and must be built or replaced before launch.
- Project outcomes and the availability line are marked `needsConfirm` in the content file. They are
  shown as written, so the owner should confirm them.
- The swarm loads lazily (three.js is a separate chunk), so the page is readable before it renders.
