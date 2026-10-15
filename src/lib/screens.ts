// Riso prints and true-colour proofs, as Astro image metadata. Files come from tools/screens/riso.py.
// Names: "<slug>", "<slug>--<crop>" or "<slug>--phone-<n>". Resolved at build time; a missing name fails the build.
import type { ImageMetadata } from 'astro';

const risoMap = import.meta.glob<{ default: ImageMetadata }>('../assets/screens/riso/*.webp', { eager: true });
const riso2Map = import.meta.glob<{ default: ImageMetadata }>('../assets/screens/riso-dark/*.webp', { eager: true });
const proofMap = import.meta.glob<{ default: ImageMetadata }>('../assets/screens/proof/*.webp', { eager: true });

function pick(map: Record<string, { default: ImageMetadata }>, name: string, kind: string): ImageMetadata {
  const key = Object.keys(map).find((k) => k.endsWith(`/${name}.webp`));
  if (!key) throw new Error(`Missing ${kind} screen "${name}". Run tools/screens/riso.py.`);
  return map[key]!.default;
}

/** The two-ink riso print. */
export const print = (name: string): ImageMetadata => pick(risoMap, name, 'riso');
/** The night print: the same plates on dark paper, shown in the dark theme. */
export const printDark = (name: string): ImageMetadata => pick(riso2Map, name, 'riso-dark');
/** The true-colour proof, shown only when someone opens a screen. */
export const proof = (name: string): ImageMetadata => pick(proofMap, name, 'proof');

/** Widths for srcset: the wanted sizes, never larger than the source. */
export function widthsFor(meta: ImageMetadata, wanted: number[]): number[] {
  return [...new Set(wanted.map((w) => Math.min(w, meta.width)))];
}
