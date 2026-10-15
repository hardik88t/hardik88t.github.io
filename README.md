# Mission Control · portfolio prototype (Concept A)

Single-page portfolio for Hardik Thanth. The centrepiece is a live **Orchestrator panel**
(a simulated run of three agent lanes) and an agent-pipeline stepper. Every fact on the page
comes from `src/content.json`, copied from `_shared/content.json`.

## Stack
- Next.js 15.5 (App Router, TypeScript, `output: "export"`), React 19.1
- Tailwind CSS v4 with CSS-variable tokens (dark default, light via `prefers-color-scheme` or the toggle)
- shadcn/ui primitives written by hand over Radix (button, badge, tabs, tooltip, sheet, dialog, command) and cmdk
- motion (`motion/react`), lucide-react, Geist Sans and Geist Mono via the `geist` package (self-hosted)

## Scripts
- `pnpm dev` runs the dev server on 127.0.0.1:3001
- `pnpm build` runs `next build` and then `scripts/relative-assets.mjs`, which makes asset URLs relative in `out/`
- `pnpm lint` and `pnpm typecheck`
- `pnpm qa` builds, then runs the shared QA script against `out/`

## Build notes
`next/font` rejects a relative `assetPrefix`, so the build uses the default prefix and
`scripts/relative-assets.mjs` rewrites `/_next/` and root-absolute references in `out/` to relative
paths (CSS URLs are computed per stylesheet). The output works from any nested sub-path.

## Behaviour
- Orchestrator panel: deterministic loop, runs only while on screen, static frame under reduced motion.
- Pipeline: autoplays until a step is chosen; each step shows its detail, tools and guardrails.
- Command palette: Ctrl/Cmd+K, or the button in the nav.
- Contact: copy-to-clipboard with fallback; the form opens a `mailto:` draft and never claims a message was sent.
