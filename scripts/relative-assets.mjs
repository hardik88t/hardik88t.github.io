// Post-build step: rewrite root-absolute asset URLs in out/ to relative ones so
// the export works from any nested sub-path. next/font rejects a relative
// assetPrefix, so the build runs with the default prefix and this fixes it up.
//   - HTML href/src attributes and inline strings: "/_next/..." -> "./_next/..."
//   - JS and RSC payload (.txt) string "/_next/" -> "./_next/" (resolved against the document)
//   - CSS url(/...) -> path relative to the stylesheet's own directory
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function withDotSlash(p) {
  return p.startsWith(".") ? p : `./${p}`;
}

let changed = 0;
for (const file of walk(root)) {
  const ext = path.extname(file);
  if (![".html", ".js", ".css", ".txt"].includes(ext)) continue;
  const src = fs.readFileSync(file, "utf8");
  const dirFromRoot = path.relative(root, path.dirname(file)).split(path.sep).join("/");
  let out = src;

  if (ext === ".css") {
    out = src.replace(/url\((["']?)\/(?!\/)([^"')]+)\1\)/g, (_m, q, target) => {
      const rel = path.posix.relative(dirFromRoot, target);
      return `url(${q}${withDotSlash(rel)}${q})`;
    });
  } else if (ext === ".html") {
    out = src
      .replace(/(\s(?:href|src)=)(["'])\/(?!\/)/g, "$1$2./")
      .replace(/(["'`])\/_next\//g, "$1./_next/");
  } else if (ext === ".js" || ext === ".txt") {
    out = src.replace(/(["'`])\/_next\//g, "$1./_next/");
  }

  if (out !== src) {
    fs.writeFileSync(file, out);
    changed++;
  }
}

console.log(`relative-assets: rewrote ${changed} file(s) in ${path.relative(process.cwd(), root) || root}`);
