# Vue bento lab (concept E, "Workbench")

Portfolio prototype for Hardik Thanth. A bright, light-first bento grid where every tile is a working mini-demo: an agent kanban, a commit stream, a design-token playground, a native-app phone demo, a donut chart built from the real commit numbers, and an accessibility simulator. Below the grid: the agent pipeline, selected work with a detail dialog, experience, and contact.

## Stack

- Vue 3.5 (Composition API, `<script setup>`, TypeScript)
- Vite 6 with `base: './'` (static build, works from any sub-path)
- Tailwind CSS v4 (`@tailwindcss/vite`), design tokens as CSS custom properties
- `@vueuse/core` (visibility, intervals, reduced-motion preference) and `@vueuse/motion` (spring press states)
- Fonts self-hosted via fontsource: Onest (UI), Instrument Serif (italic accents), JetBrains Mono (code)

## Scripts

```sh
pnpm install
pnpm dev        # local dev server on 127.0.0.1
pnpm build      # vue-tsc typecheck + vite build -> dist/
pnpm preview    # serve dist/ on 127.0.0.1
```

Content comes only from `src/content.json`, copied from `_shared/content.json`.

## Notes

- Simulations (kanban, commit stream, phone app) pause when off-screen, while hovered or focused, and when the user prefers reduced motion. Reduced motion shows static frames.
- "Apply to site" in the token playground writes accent, radius and padding to `:root`; "Reset" removes them.
- The contact form never claims a message was sent. It opens a `mailto:` draft as a convenience.
