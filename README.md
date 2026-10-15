# Swarm: Hardik portfolio prototype (threejs-swarm)

Concept D from the shared brief. A full-bleed WebGL particle swarm morphs through four chapters
(one developer, a fleet of agents, shipping products, everywhere) while DOM sections carry the
content from `src/content.json`.

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

## How it is built

- `src/swarm/targets.ts` samples five shapes procedurally in JS: a cloud (hero), an orchestrator
  core with orbit rings, six agent clusters linked by faint arcs and spokes, a browser window with
  a dashboard, and a phone with an app grid. Every shape gets the same number of points; about 24%
  are "line" particles that render fainter.
- `src/swarm/shaders.ts` holds the GLSL: morph between states by a uniform, per-particle stagger,
  curl-noise flow peaking mid-transition, pointer repulsion, and depth-based teal-to-gold tint.
- `src/swarm/renderer.ts` is the `Swarm` controller: layout for desktop and mobile, morph tween,
  scroll-linked turn, pointer tracking, pause when the tab is hidden, a slow render rate over the
  DOM sections, and a quick FPS probe that steps the particle count down on slow devices.
- `src/swarm/fallback.ts` draws the same targets as static SVG dots when WebGL is unavailable.
- `src/sections/chapters.ts` maps the scroll progress of the pinned chapter stage to morph states.
  On phones the chapters stack and the state follows the block nearest the middle of the screen.

## Notes

- Content is read only from `src/content.json` (a copy of `_shared/content.json`).
- Anonymised projects keep no live link, so they stay generic.
- The swarm loads lazily (three.js is a separate chunk), so the page is readable before it renders.
