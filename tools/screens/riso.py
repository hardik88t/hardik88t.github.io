#!/usr/bin/env python3
"""Riso prints from the harness captures (raw/*.png). Deterministic: same input, same output.

For each capture it writes two things into the site's asset folder:
  - riso/<name>.webp  a two-ink print on paper (riso-dark/ holds the night version on dark paper): ink (#18181C) plus the project accent mapped to the nearest
                      riso ink (pink, blue, teal, orange or yellow). Solid darks, halftone midtones,
                      a 1-2px misregistration on the second ink, ink texture and paper grain.
  - proof/<name>.webp the true-colour screenshot, shown only when someone opens a screen.
Astro encodes the final AVIF/WebP at 1x and 2x (see src/components/Print.astro), so these
masters are never shipped as-is.

usage: python3 riso.py [name ...]     (names like wholesale-os, medjot--phone-1; default: all)
"""
import json
import math
import sys
import zlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent
SITE = HERE.parent.parent
RAW = HERE / "raw"
RISO_OUT = SITE / "src" / "assets" / "screens" / "riso"
RISO_DARK_OUT = SITE / "src" / "assets" / "screens" / "riso-dark"
PROOF_OUT = SITE / "src" / "assets" / "screens" / "proof"
CONTENT = SITE / "src" / "data" / "content-v2.json"

PAPER = "#F6F6F3"
INK = "#18181C"
DARK_PAPER = "#141519"
DARK_INK = "#EDEDE6"
DARK_INKS = {
    "pink": "#FF6FC2",
    "blue": "#5DB8F2",
    "teal": "#2FD3C4",
    "orange": "#FF8A57",
    "yellow": "#FFE800",
}
RISO_INKS = {
    "pink": "#FF48B0",
    "blue": "#0070B5",
    "teal": "#00A99D",
    "orange": "#FF6C2F",
    "yellow": "#FFE800",
}

# Target widths of the 2x master. Desktop mocks are 1280 css px wide, phones are about 372 css px.
W_DESKTOP = 1280
W_PHONE = 600

# Screen angles: ink at 45 degrees, spot at 15 degrees, so the two dot screens never moire.
ANGLE_INK = 45.0
ANGLE_SPOT = 15.0
PITCH_DIV = 145.0  # halftone cell = width / PITCH_DIV pixels (about 4 to 5 px at 1x)


def _box1d(a: np.ndarray, r: int, axis: int) -> np.ndarray:
    n = a.shape[axis]
    pad = np.pad(a, [(r + 1, r) if i == axis else (0, 0) for i in range(a.ndim)], mode="edge")
    c = np.cumsum(pad, axis=axis)
    hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis)
    lo = np.take(c, np.arange(0, n), axis=axis)
    return (hi - lo) / (2 * r + 1)


def blur(a: np.ndarray, r: float) -> np.ndarray:
    """Gaussian-like blur (three box passes), numpy only. r is the radius in pixels."""
    r = max(1, int(round(r)))
    out = a
    for _ in range(3):
        out = _box1d(out, r, 0)
        out = _box1d(out, r, 1)
    return out


def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def hex_rgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float64) / 255.0


def lum(c: np.ndarray) -> float:
    return float(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2])


def nearest_riso(accent: str) -> str:
    """Nearest riso ink by a redmean colour distance. Deterministic and printed for the record."""
    a = hex_rgb(accent) * 255
    best, best_d = "", 1e9
    for name, hx in RISO_INKS.items():
        b = hex_rgb(hx) * 255
        rm = (a[0] + b[0]) / 2
        dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
        d = math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db)
        if d < best_d:
            best, best_d = name, d
    return best


def halftone(c: np.ndarray, pitch: float, angle_deg: float, aa: float = 0.09) -> np.ndarray:
    """Amplitude-modulated dot screen. c is coverage 0..1; returns the dot mask 0..1 (anti-aliased)."""
    h, w = c.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    th = math.radians(angle_deg)
    u = (xx * math.cos(th) + yy * math.sin(th)) / pitch
    v = (-xx * math.sin(th) + yy * math.cos(th)) / pitch
    fu = u - np.floor(u) - 0.5
    fv = v - np.floor(v) - 0.5
    r = np.hypot(fu, fv)
    radius = 0.7071 * np.sqrt(np.clip(c, 0, 1))
    m = np.clip((radius - r) / aa + 0.5, 0, 1)
    m = np.where(c >= 0.8, 1.0, m)
    m = np.where(c <= 0.01, 0.0, m)
    return m


def shift(mask: np.ndarray, dx: float, dy: float) -> np.ndarray:
    """Sub-pixel translate with bilinear resampling (the misregistration)."""
    img = Image.fromarray((mask * 255).astype(np.uint8))
    out = img.transform(img.size, Image.Transform.AFFINE, (1, 0, -dx, 0, 1, -dy), resample=Image.Resampling.BILINEAR)
    return np.asarray(out, dtype=np.float64) / 255.0


def soft(mask: np.ndarray, radius: float) -> np.ndarray:
    img = Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8))
    img = img.filter(ImageFilter.GaussianBlur(radius))
    return np.asarray(img, dtype=np.float64) / 255.0


def value_noise(h: int, w: int, cell: int, rng: np.random.Generator) -> np.ndarray:
    """Low-frequency noise for uneven ink coverage, 0..1."""
    gh, gw = max(2, h // cell + 2), max(2, w // cell + 2)
    small = rng.random((gh, gw))
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.Resampling.BICUBIC)
    return np.asarray(img, dtype=np.float64) / 255.0


def dilate(a: np.ndarray, r: int = 1) -> np.ndarray:
    """Max filter over a (2r+1)^2 square: thin strokes grow a little, so text stays legible at thumbnail size."""
    out = a.copy()
    h, w = a.shape
    pad = np.pad(a, r, mode="edge")
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out = np.maximum(out, pad[r + dy : r + dy + h, r + dx : r + dx + w])
    return out


def separate(rgb: np.ndarray, accent_hex: str, seed: str):
    """Two plates from a screenshot.

    Ink plate: dark pixels (text, lines, dark panels), solid, dilated by one pixel, no halftone.
    Accent plate: coloured UI and mid-tones, as a coarse halftone (dot size follows the tone). Near-white
    pixels get nothing, so paper stays paper and light panels never print as grey.
    Returns (ink_mask, accent_mask, accent_ink_rgb, grain) at the output size.
    """
    h, w, _ = rgb.shape
    accent = hex_rgb(accent_hex)
    # Stronger contrast and colour before separation, so the screen reads boldly.
    L0 = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    x = L0[..., None] + (rgb - L0[..., None]) * 1.28
    x = np.clip((x - 0.5) * 1.12 + 0.5, 0, 1)
    L = 0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2]
    # Unsharp mask on luminance: glyph edges get crisper before the threshold, so small text does not break up.
    L = np.clip(L + 0.7 * (L - blur(L, 1.5 * w / 1280.0 + 0.5)), 0, 1)
    C = x.max(-1) - x.min(-1)

    # Accent coverage: pixels near the project accent, other saturated colour, and mid greys (not dark).
    d = np.sqrt(np.sum((x - accent) ** 2, axis=-1))
    m_col = np.exp(-((d / 0.2) ** 2)) * smoothstep(0.10, 0.22, C)
    m_sat = smoothstep(0.14, 0.32, C) * 0.85
    mid = smoothstep(0.30, 0.55, L) * (1 - smoothstep(0.78, 0.9, L)) * (1 - smoothstep(0.08, 0.18, C)) * 0.22
    A = np.clip(np.maximum(np.maximum(m_col, m_sat), mid), 0, 1)
    A = A * (1 - smoothstep(0.22, 0.34, L) * (1 - smoothstep(0.25, 0.4, C)))

    # Ink plate: dark pixels, solid, grown by one pixel, with a soft edge.
    # Ink is for low-chroma darks only: a saturated button stays accent even when its colour is dark.
    I = smoothstep(0.58, 0.44, L) * (1 - smoothstep(0.22, 0.4, C))
    I = dilate(I, 1)
    I = soft(I, 0.35)

    cell = w / PITCH_DIV
    c_acc = np.clip((A - 0.05) / 0.75, 0, 1) ** 0.8
    acc = halftone(c_acc, cell, ANGLE_SPOT)

    # Misregistration: the accent plate sits 1 to 2 px off the ink plate.
    acc = shift(acc, 1.5 * w / 1280.0, -1.0 * w / 1280.0)
    acc = soft(acc, 0.3)

    rng = np.random.default_rng(zlib.crc32(seed.encode()))
    mottle = value_noise(h, w, max(18, int(w / 52)), rng)
    speck = rng.random((h, w)) > 0.9994
    I = I * (0.95 + 0.05 * mottle) * np.where(speck, 0.35, 1.0)
    acc = acc * (0.95 + 0.05 * mottle)
    grain = soft(rng.random((h, w)), 0.6) - 0.5
    return I, acc, grain


def compose_light(I, acc, grain, accent_hex, h, w):
    """Light sheet: translucent riso inks multiply onto the paper."""
    paper, ink, spot = hex_rgb(PAPER), hex_rgb(INK), hex_rgb(RISO_INKS[nearest_riso(accent_hex)])
    canvas = np.ones((h, w, 3)) * paper
    canvas *= 1.0 - I[..., None] * (1.0 - ink)
    canvas *= 1.0 - acc[..., None] * (1.0 - spot)
    canvas *= (1.0 + 0.02 * grain)[..., None]
    return np.clip(canvas, 0, 1)


def compose_dark(I, acc, grain, accent_hex, h, w):
    """Night print: the same two plates screened onto the dark paper, with lit inks."""
    base = hex_rgb(DARK_PAPER)
    light_ink = hex_rgb(DARK_INK)
    lit_spot = hex_rgb(DARK_INKS[nearest_riso(accent_hex)])
    canvas = np.ones((h, w, 3)) * base
    for layer in (I[..., None] * light_ink, acc[..., None] * lit_spot):
        canvas = 1.0 - (1.0 - canvas) * (1.0 - layer)  # screen
    canvas *= (1.0 + 0.02 * grain)[..., None]
    return np.clip(canvas, 0, 1)


def load_rgb(path: Path, width: int) -> np.ndarray:
    img = Image.open(path).convert("RGB")
    h = round(img.height * width / img.width)
    img = img.resize((width, h), Image.Resampling.LANCZOS)
    return np.asarray(img, dtype=np.float64) / 255.0


def save_master(arr: np.ndarray, path: Path, quality: int) -> None:
    """High-quality WebP master. Astro re-encodes the shipped AVIF and WebP from it at 1x and 2x."""
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray((np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8))
    img.save(path.with_suffix(".webp"), format="WEBP", quality=quality, method=6)


def main(names: list[str]) -> None:
    content = json.loads(CONTENT.read_text())
    accents = {p["slug"]: p["accent"] for p in content["projects"]}
    extra = {"net-watch": "#10B981", "fieldbook": "#8B5CF6"}  # both are in content too; kept for clarity
    accents.update({k: v for k, v in extra.items() if k not in accents})
    raws = sorted(RAW.glob("*.png"))
    if names:
        raws = [p for p in raws if p.stem in names]
    for raw in raws:
        slug = raw.stem.split("--")[0]
        accent = accents.get(slug)
        if not accent:
            print(f"skip {raw.name}: no accent for {slug}")
            continue
        is_phone = "--phone-" in raw.stem
        native = Image.open(raw).width
        if is_phone:
            width = W_PHONE
        elif "--" in raw.stem:
            width = min(W_DESKTOP, native)  # crops keep their native 2x width, never upscaled
        else:
            width = W_DESKTOP
        rgb = load_rgb(raw, width)
        h, w = rgb.shape[:2]
        I, acc, grain = separate(rgb, accent, seed=raw.stem)
        save_master(compose_light(I, acc, grain, accent, h, w), RISO_OUT / f"{raw.stem}.webp", 92)
        save_master(compose_dark(I, acc, grain, accent, h, w), RISO_DARK_OUT / f"{raw.stem}.webp", 92)
        save_master(rgb, PROOF_OUT / f"{raw.stem}.webp", 90)
        print(f"{raw.stem}: {width}px, spot={nearest_riso(accent)} ({accent})")


if __name__ == "__main__":
    main(sys.argv[1:])
