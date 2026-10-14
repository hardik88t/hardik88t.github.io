// Deterministic "imperfection" seeds. Everything here runs at BUILD time (Astro frontmatter):
// the same slug or index always yields the same tilt, sign, variant and axis values.
// Nothing uses Math.random(), so every visit sees the same page.

/** FNV-1a, 32-bit. */
export function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type Step = 'xs' | 'sm' | 'md';

/** Signed rotation from the tilt tokens, e.g. "calc(var(--tilt-sm) * -1)". */
export function tilt(seed: string, steps: readonly Step[] = ['xs', 'sm']): string {
  const h = hash(seed);
  const step = steps[h % steps.length] ?? 'xs';
  const sign = (h >>> 8) & 1 ? 1 : -1;
  return `calc(var(--tilt-${step}) * ${sign})`;
}

/** Signed nudge in px from the nudge tokens, for one axis. */
export function nudge(seed: string, steps: readonly Step[] = ['xs', 'sm']): string {
  const h = hash(seed + ':nudge');
  const step = steps[h % steps.length] ?? 'xs';
  const sign = (h >>> 8) & 1 ? 1 : -1;
  return `calc(var(--nudge-${step}) * ${sign})`;
}

/** Index into a list of n variants, e.g. one of the hand-drawn mark shapes. */
export function variant(seed: string, n: number): number {
  return hash(seed + ':variant') % n;
}

/**
 * Fraunces axes for one heading. WONK is on for about one heading in three,
 * SOFT varies in steps, so each heading is a little different without looking random.
 */
export function headingAxes(seed: string): string {
  const h = hash(seed + ':axes');
  const wonk = h % 3 === 0 ? 1 : 0;
  const soft = [20, 40, 60, 80][(h >>> 4) % 4] ?? 40;
  return `"SOFT" ${soft}, "WONK" ${wonk}`;
}
