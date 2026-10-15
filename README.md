# HardikOS: portfolio prototype (sveltekit-agent-os)

Concept B from the shared brief. The portfolio is a small operating system.

- **Desktop (1024px and up):** a menu bar (HardikOS, Work, Agents, Services, Contact menus, live IST clock, agent status), a generative wallpaper, a magnifying dock, and draggable windows with z-order, minimise, zoom and Esc-to-close. On first load: README, a live Agents activity monitor, and a Terminal.
- **Phone and tablet (below 1024px):** a home screen with status bar, a live widget, a pipeline strip, an app grid and a dock. Apps open as full-screen sheets with a native header, a back button, and swipe-down to dismiss.
- **Read as a page:** a linear, fully accessible document of every section. Reach it from the HardikOS menu, the menu bar, Settings, or the phone home screen. Reduced-motion users start here.
- **Terminal:** `help`, `whoami`, `work`, `open <slug>`, `agents`, `pipeline`, `services`, `stack`, `contact`, `cv`, `clear` and `swarm run "<task>"`. Swarm runs stream a simulated log of the real pipeline; nothing is executed.

All copy and data come from `src/content.json`, a verbatim copy of `_shared/content.json`.

## Stack

SvelteKit 2 with Svelte 5 runes, TypeScript, `@sveltejs/adapter-static` (fully prerendered, no fallback), `kit.paths.relative = true`. Plain scoped CSS with custom-property tokens (no Tailwind, no UI library). Fonts are self-hosted through `@fontsource-variable/figtree` and `@fontsource/martian-mono`.

## Scripts

```sh
pnpm install
pnpm dev       # http://127.0.0.1:3002
pnpm check     # svelte-kit sync + svelte-check (zero warnings enforced)
pnpm build     # static output in build/
pnpm preview   # http://127.0.0.1:3002, serves build/
```

QA (screenshots and problem report) runs against the build from a nested sub-path:

```sh
node /home/user/protos/_tools/qa.mjs build sveltekit-agent-os
```

## Layout of the code

- `src/lib/content.ts`: typed view of `content.json`, plus project artwork selection.
- `src/lib/state/`: `ui` (view, theme, layout breakpoint, phone sheet), `wm` (window manager), `sim` (simulated agent fleet, which ticks only while visible), `apps` (app registry).
- `src/lib/components/blocks/`: content blocks shared by windows, sheets and the reading page.
- `src/lib/components/desktop/`, `mobile/`, `apps/`, `linear/`: shells, phone home screen and sheets, window apps, and the reading page.
- `src/lib/terminal/`: pure command engine and session store.
