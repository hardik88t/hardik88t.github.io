// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static, single-page build. No base path is set on purpose: scripts/relativize.mjs
// rewrites every /_astro/ reference in dist/ to a relative one afterwards, so the
// build works from any nested sub-path.
// The React integration renders the mock screens to static HTML (hover previews, no client
// directive) and provides the lazily imported canvas overlay (src/canvas).
export default defineConfig({
  output: 'static',
  integrations: [react()],
  build: {
    // Stylesheets stay external and cacheable. Inlining put about 143 KB of CSS into index.html.
    // scripts/relativize.mjs rewrites their <link href> and url() references to relative paths.
    inlineStylesheets: 'never',
    format: 'file',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: {
      // The overlay chunk is loaded by a plain dynamic import on first open. Vite's preload helper would
      // add root-absolute modulepreload links (/_astro/...) that break under a nested sub-path, and it
      // also preloads a dynamic chunk's CSS the same way. So the overlay chunk gets no preload list and
      // no CSS of its own: all CSS is one stylesheet, linked from the page (external and cacheable).
      modulePreload: false,
      cssCodeSplit: false,
    },
  },
});
