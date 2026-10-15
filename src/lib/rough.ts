// A rough-edged rectangle for rubber stamps. Build time only, seeded, so the same stamp is always the same shape.
import { hash } from './seed';

/** SVG path for a hand-cut rectangle inside a 0..100 box. Stroke is non-scaling, so the edge stays crisp. */
export function roughRect(seed: string, inset = 4, segs = 7, jitter = 1.8): string {
  let s = hash(seed) || 1;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const j = () => (rnd() - 0.5) * 2 * jitter;
  const pts: string[] = [];
  const a = inset, b = 100 - inset;
  // top edge, left to right
  for (let i = 0; i <= segs; i++) pts.push(`${(a + ((b - a) * i) / segs).toFixed(2)} ${(a + j()).toFixed(2)}`);
  // right edge, top to bottom
  for (let i = 1; i <= segs; i++) pts.push(`${(b + j()).toFixed(2)} ${(a + ((b - a) * i) / segs).toFixed(2)}`);
  // bottom edge, right to left
  for (let i = 1; i <= segs; i++) pts.push(`${(b - ((b - a) * i) / segs).toFixed(2)} ${(b + j()).toFixed(2)}`);
  // left edge, bottom to top
  for (let i = 1; i < segs; i++) pts.push(`${(a + j()).toFixed(2)} ${(b - ((b - a) * i) / segs).toFixed(2)}`);
  return `M${pts.join(' L')} Z`;
}
