# hardik88t.github.io

Portfolio of **Hardik Thanth**, a product engineer who designs and builds apps and web.

Live: <https://hardik88t.github.io>

## What's here

- **The page**: a short portfolio built on *Perfect Imperfect*, a small design system where every
  imperfection is deliberate, seeded at build time, and free. No layout shift, no JavaScript for the
  effects, full contrast. Perfection is reserved for what matters: actions, focus, forms and the work itself.
- **The work canvas**: a pan-and-zoom board of real product screens, opened full-screen from any project
  (`#work`, or `#work-<project>`). On phones it's a swipe gallery.
- **The system page** (`#system`) documents the principles, tokens and components.

## Stack

Astro (static) · TypeScript · hand-written CSS · React only inside the work canvas, loaded on first open ·
self-hosted, subset variable fonts (Fraunces, Recursive).

## Develop

```sh
pnpm install
pnpm dev          # http://127.0.0.1:4321
pnpm build        # type check, static build to dist/, relative asset paths
pnpm verify:seo   # head tags, structured data, sitemap, robots, llms.txt
```

Content lives in one file, `src/data/content-v2.json`. The page, the canvas, the structured data, `llms.txt`,
`llms-full.txt` and `index.md` are all generated from it.

Icons and the social preview image are generated from sources in `tools/` (`pnpm icons`, `pnpm og`) and
committed to `public/`.

## Deploy

Pushes to `main` build and deploy to GitHub Pages via `.github/workflows/deploy.yml`.
In the repository settings, set **Pages → Source** to **GitHub Actions**.

## Notes

- `docs/design-system.md` has the Perfect Imperfect rules.
- AI crawlers are allowed in `public`-generated `robots.txt`; the file explains how to block them.
