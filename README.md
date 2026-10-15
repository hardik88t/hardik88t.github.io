# v2-studio

Portfolio prototype v2-D "Studio" for Hardik Thanth. A conversion-focused offer page, like a small studio's offer list: what can I buy, how long it takes, how working together goes, and what it costs (the model, not numbers). Projects appear only as examples inside offers.

Concept and content rules: `/home/user/protos/_shared/v2/concepts/studio.md` and `/home/user/protos/_shared/v2/BRIEF-v2.md`. Content source: `src/lib/data/content-v2.json` (copy of `/home/user/protos/_shared/v2/content-v2.json`).

## Stack

- SvelteKit 2 with Svelte 5 runes, TypeScript, `@sveltejs/adapter-static` 3 (static build, `paths.relative = true`)
- Hand-written CSS with design tokens on `:root` (`src/app.css`). No Tailwind, no UI library.
- Fonts self-hosted through fontsource: Schibsted Grotesk Variable (display and UI), DM Mono (small labels)
- No runtime network requests. No external images. No `localStorage`.

## Build and check

```sh
pnpm install
pnpm build        # static site in build/
pnpm check        # svelte-check
node /home/user/protos/_tools/qa.mjs build v2-studio 7000   # QA: layout, overflow, console, phone height budget
```

## Structure

- `src/routes/+page.svelte` composes the page and holds the shared "picked need" state
- `src/lib/components/Hero.svelte` headline, CTAs, and the "What do you need?" radio picker
- `src/lib/components/Offers.svelte` four offer tickets (perforated edge, example stub), phone carousel with dots, retainer row
- `src/lib/components/Mock.svelte` code-drawn UI thumbnails for the example projects (decorative)
- `src/lib/components/Principles.svelte`, `Process.svelte`, `Faq.svelte`, `Contact.svelte`, `Footer.svelte`, `Header.svelte`
- `src/lib/reveal.ts` one-shot section fade-in (JS only, skipped for reduced motion)

## Behaviour notes

- Contact opens a `mailto:` draft in the visitor's email app. The page never says a message was sent.
- The email address is shown as selectable text with a copy button (Clipboard API with an `execCommand` fallback).
- Anonymized example projects show the generic client name and no link.
- Motion is limited to section fades, the FAQ accordion, picker transitions and smooth scrolling. All are disabled under `prefers-reduced-motion`.
- Dark theme is not built. The page sets `color-scheme: light`.
