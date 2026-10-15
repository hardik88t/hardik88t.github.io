// Post-build step: make every asset reference in dist/ relative so the site works
// from any nested sub-path (e.g. https://example.com/nested/sub/path/).
//
// Astro emits root-absolute URLs such as `/_astro/index.abc.js`. This script rewrites
// each `/_astro/` reference relative to the directory of the file it appears in:
//   dist/index.html            -> ./_astro/...
//   dist/_astro/some.css       -> ../_astro/...   (resolves to the same folder)
// It then fails the build if any root-absolute asset reference survives.
//
// usage: node scripts/relativize.mjs [distDir]
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist'),
);

const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.webmanifest', '.svg', '.xml', '.txt']);
// A `/_astro/` that is not already preceded by "." (i.e. "./_astro/" or "../_astro/") or a word char.
const ROOT_ASTRO = /(?<![.\w])\/_astro\//g;
// Root-absolute references in attributes or CSS url() (protocol-relative `//` is ignored).
const ROOT_ABS_ATTR = /\b(?:href|src|srcset|poster|action|data)=["']\/(?!\/)/g;
const ROOT_ABS_CSS = /url\(\s*["']?\/(?!\/)/g;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function main() {
  const info = await stat(root).catch(() => null);
  if (!info?.isDirectory()) {
    console.error(`relativize: ${root} is not a directory. Run "astro build" first.`);
    process.exit(1);
  }

  const files = (await walk(root)).filter((f) => TEXT_EXT.has(path.extname(f)));
  let rewritten = 0;
  let replacements = 0;
  const leftovers = [];

  for (const file of files) {
    const src = await readFile(file, 'utf8');
    // Path from the file's own folder back to dist/: "" for dist/index.html, ".." for dist/_astro/x.css.
    const folder = path.relative(root, path.dirname(file)).split(path.sep).join('/');
    const prefix = `${path.posix.relative(folder, '.') || '.'}/_astro/`;

    let count = 0;
    const next = src.replace(ROOT_ASTRO, () => {
      count += 1;
      return prefix;
    });

    if (next !== src) {
      await writeFile(file, next);
      rewritten += 1;
      replacements += count;
    }

    const attrHits = [...next.matchAll(ROOT_ABS_ATTR)].length;
    const cssHits = path.extname(file) === '.css' || path.extname(file) === '.html' ? [...next.matchAll(ROOT_ABS_CSS)].length : 0;
    const astroLeft = [...next.matchAll(ROOT_ASTRO)].length;
    if (attrHits || cssHits || astroLeft) {
      leftovers.push(`${path.relative(root, file)}: attr=${attrHits} css=${cssHits} astro=${astroLeft}`);
    }
  }

  if (leftovers.length) {
    console.error('relativize: root-absolute references remain:\n  ' + leftovers.join('\n  '));
    process.exit(1);
  }

  console.log(
    `relativize: scanned ${files.length} text files in ${path.relative(process.cwd(), root) || '.'}, ` +
      `rewrote ${replacements} /_astro/ references in ${rewritten} files, no root-absolute references left.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
