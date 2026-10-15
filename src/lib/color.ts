// Small colour utilities used by the design-token demos.
// Contrast is computed from real colour maths (OKLCH -> linear sRGB -> WCAG luminance),
// so the readouts in the playground are measured, not hard-coded.

export type Rgb = [number, number, number] // linear-light sRGB, 0..1 (may be out of range before clamp)

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/** OKLCH (L 0..1, C, H degrees) to linear-light sRGB, clamped to gamut. */
export function oklchToLinearRgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const L = l_ ** 3
  const M = m_ ** 3
  const S = s_ ** 3
  return [
    clamp01(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    clamp01(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    clamp01(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
  ]
}

/** WCAG relative luminance from linear-light sRGB. */
export function luminance([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Relative luminance of a #rrggbb colour. */
export function hexLuminance(hex: string): number {
  const n = hex.replace('#', '')
  const channel = (i: number) => {
    const v = parseInt(n.slice(i, i + 2), 16) / 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return luminance([channel(0), channel(2), channel(4)])
}

export function contrast(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

export const INK_HEX = '#13201a'
export const WHITE_HEX = '#ffffff'

export interface AccentToken {
  accent: string
  onAccent: string
  ratio: number
  pass: boolean
}

/**
 * Builds an accent token from a hue. The on-accent colour is whichever of
 * white or ink gives the higher WCAG contrast, so the pair stays readable at any hue.
 */
export function accentForHue(hue: number): AccentToken {
  const accentLum = luminance(oklchToLinearRgb(0.52, 0.19, hue))
  const white = contrast(accentLum, hexLuminance(WHITE_HEX))
  const ink = contrast(accentLum, hexLuminance(INK_HEX))
  const useWhite = white >= ink
  const ratio = useWhite ? white : ink
  return {
    accent: `oklch(52% 0.19 ${Math.round(hue)})`,
    onAccent: useWhite ? WHITE_HEX : INK_HEX,
    ratio,
    pass: ratio >= 4.5,
  }
}

export function formatRatio(r: number): string {
  return `${r.toFixed(1)}:1`
}
