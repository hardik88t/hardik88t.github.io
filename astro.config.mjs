// @ts-check
import { defineConfig } from 'astro/config';

// Static, single-page build. No base path is set on purpose: scripts/relativize.mjs
// rewrites every /_astro/ reference in dist/ to a relative one afterwards, so the
// build works from any nested sub-path.
export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'always',
    format: 'file',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
