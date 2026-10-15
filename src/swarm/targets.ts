// Procedural shape targets. Every shape is sampled in "shape units" (roughly
// -1..1 on the largest axis); the shader scales/offsets them to the viewport.
// Each shape gets exactly `count` points. The first FAINT_RATIO share of the
// indices are "line" particles (outlines, orbits, links) and render fainter;
// the rest are "solid" particles (dense volumes, filled tiles, icons).

export const SHAPE_NAMES = ['cloud', 'core', 'clusters', 'grid', 'phone'] as const;
export const SHAPE_COUNT = SHAPE_NAMES.length;
export const FAINT_RATIO = 0.3;

type V3 = [number, number, number];
type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Splits an integer total into parts proportional to weights (largest remainder). */
function split(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (w / sum) * total);
  const out = raw.map((r) => Math.floor(r));
  let rest = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; rest > 0; k++, rest--) out[order[k % order.length][1]]++;
  return out;
}

const TAU = Math.PI * 2;

function ballVolume(r: number, rng: Rng, power = 0.333): V3 {
  const z = rng() * 2 - 1;
  const phi = rng() * TAU;
  const s = Math.sqrt(1 - z * z);
  const rad = r * Math.pow(rng(), power);
  return [rad * s * Math.cos(phi), rad * s * Math.sin(phi), rad * z];
}

function ballShell(r: number, rng: Rng, jitter = 0): V3 {
  const z = rng() * 2 - 1;
  const phi = rng() * TAU;
  const s = Math.sqrt(1 - z * z);
  const rad = r * (1 + jitter * (rng() * 2 - 1));
  return [rad * s * Math.cos(phi), rad * s * Math.sin(phi), rad * z];
}

function rectFill(cx: number, cy: number, w: number, h: number, z: number, rng: Rng): V3 {
  return [cx + (rng() - 0.5) * w, cy + (rng() - 0.5) * h, z + (rng() - 0.5) * 0.01];
}

/** Stratified samples spread evenly (by arc length) along an open or closed polyline. */
function pathSamples(poly: V3[], n: number, rng: Rng, closed: boolean, jitter = 0.004): V3[] {
  const out: V3[] = [];
  const segs = closed ? poly.length : poly.length - 1;
  if (n <= 0 || segs <= 0) return out;
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < segs; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    lens.push(L);
    total += L;
  }
  if (total === 0) return out;
  let seg = 0;
  let acc = 0;
  for (let k = 0; k < n; k++) {
    const target = ((k + rng()) / n) * total;
    while (seg < segs - 1 && acc + lens[seg] < target) {
      acc += lens[seg];
      seg++;
    }
    const a = poly[seg];
    const b = poly[(seg + 1) % poly.length];
    const t = lens[seg] > 0 ? Math.min(1, (target - acc) / lens[seg]) : 0;
    const j = () => (rng() * 2 - 1) * jitter;
    out.push([a[0] + (b[0] - a[0]) * t + j(), a[1] + (b[1] - a[1]) * t + j(), a[2] + (b[2] - a[2]) * t + j()]);
  }
  return out;
}

function roundRect(cx: number, cy: number, w: number, h: number, r: number, z = 0, steps = 10): V3[] {
  const pts: V3[] = [];
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  const corners: [number, number, number][] = [
    [hw, hh, 0],
    [-hw, hh, Math.PI / 2],
    [-hw, -hh, Math.PI],
    [hw, -hh, Math.PI * 1.5],
  ];
  for (const [ox, oy, a0] of corners) {
    for (let s = 0; s <= steps; s++) {
      const a = a0 + (Math.PI / 2) * (s / steps);
      pts.push([cx + ox + Math.cos(a) * r, cy + oy + Math.sin(a) * r, z]);
    }
  }
  return pts;
}

function polyLength(poly: V3[], closed: boolean): number {
  let total = 0;
  const segs = closed ? poly.length : poly.length - 1;
  for (let i = 0; i < segs; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    total += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  }
  return total;
}

/** Line particles per polyline, proportional to length so every outline has the same dot spacing. */
function allocByLength(total: number, polys: { poly: V3[]; closed: boolean }[]): number[] {
  return split(total, polys.map((p) => Math.max(1e-4, polyLength(p.poly, p.closed))));
}

function circle2D(cx: number, cy: number, r: number, z = 0, steps = 48): V3[] {
  const pts: V3[] = [];
  for (let s = 0; s < steps; s++) {
    const a = (s / steps) * TAU;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z]);
  }
  return pts;
}

/** Orbit ring of radius R, tilted about X then Z. */
function orbit3D(R: number, tiltX: number, tiltZ: number, steps = 220): V3[] {
  const pts: V3[] = [];
  const cx = Math.cos(tiltX);
  const sx = Math.sin(tiltX);
  const cz = Math.cos(tiltZ);
  const sz = Math.sin(tiltZ);
  for (let s = 0; s < steps; s++) {
    const a = (s / steps) * TAU;
    let x = R * Math.cos(a);
    let y = R * Math.sin(a);
    let z = 0;
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    y = y1;
    z = z1;
    const x2 = x * cz - y * sz;
    const y2 = x * sz + y * cz;
    x = x2;
    y = y2;
    pts.push([x, y, z]);
  }
  return pts;
}

interface ShapeSamples {
  lines: V3[];
  solids: V3[];
}

function cloudShape(F: number, S: number, rng: Rng): ShapeSamples {
  const solids: V3[] = [];
  for (let i = 0; i < S; i++) solids.push(ballVolume(0.95, rng, 0.4));
  const lines: V3[] = [];
  // Faint particles sit inside the cloud, not in a halo, so they never scatter over the copy.
  for (let i = 0; i < F; i++) lines.push(ballVolume(0.9, rng, 0.45));
  return { lines, solids };
}

function coreShape(F: number, S: number, rng: Rng): ShapeSamples {
  // A bright dense core plus a sphere surface, so the orchestrator reads as a sphere.
  const [dense, shell] = split(S, [0.58, 0.42]);
  const solids: V3[] = [];
  for (let i = 0; i < dense; i++) solids.push(ballVolume(0.44, rng, 0.5));
  for (let i = 0; i < shell; i++) solids.push(ballShell(0.64, rng, 0.02));

  const lines: V3[] = [];
  const orbits: [number, number][] = [
    [0, 0],
    [1.15, 0.3],
    [0.5, 2.2],
  ];
  const rings = orbits.map(([tx, tz]) => ({ poly: orbit3D(0.94, tx, tz), closed: true }));
  const counts = allocByLength(F, rings);
  rings.forEach((r, k) => lines.push(...pathSamples(r.poly, counts[k], rng, true, 0.006)));
  return { lines, solids };
}

const AGENT_COUNT = 6;
const RING_R = 0.8;

function clustersShape(F: number, S: number, rng: Rng): ShapeSamples {
  const hubS = Math.round(S * 0.12);
  const agentS = split(S - hubS, Array(AGENT_COUNT).fill(1));
  const solids: V3[] = [];
  for (let i = 0; i < hubS; i++) solids.push(ballVolume(0.16, rng, 0.5));

  const centers: V3[] = [];
  for (let k = 0; k < AGENT_COUNT; k++) {
    const a = -Math.PI / 2 + (k * TAU) / AGENT_COUNT;
    centers.push([RING_R * Math.cos(a), RING_R * Math.sin(a), 0.14 * Math.sin(k * 2.1)]);
  }
  centers.forEach((c, k) => {
    for (let i = 0; i < agentS[k]; i++) {
      const p = ballVolume(0.19, rng, 0.45);
      solids.push([p[0] + c[0], p[1] + c[1], p[2] + c[2]]);
    }
  });

  // Links: six spokes from the orchestrator hub, six arcs around the ring.
  const hub: V3 = [0, 0, 0];
  const segments: V3[][] = [];
  centers.forEach((c) => segments.push([hub, c]));
  for (let k = 0; k < AGENT_COUNT; k++) {
    const a0 = -Math.PI / 2 + (k * TAU) / AGENT_COUNT;
    const arc: V3[] = [];
    for (let s = 0; s <= 24; s++) {
      const a = a0 + (TAU / AGENT_COUNT) * (s / 24);
      arc.push([RING_R * Math.cos(a), RING_R * Math.sin(a), 0.14 * Math.sin(k * 2.1)]);
    }
    segments.push(arc);
  }
  const perSeg = allocByLength(F, segments.map((poly) => ({ poly, closed: false })));
  const lines: V3[] = [];
  segments.forEach((poly, k) => lines.push(...pathSamples(poly, perSeg[k], rng, false, 0.003)));
  return { lines, solids };
}

const W_BROWSER = 2.0;
const H_BROWSER = 1.25;

function gridShape(F: number, S: number, rng: Rng): ShapeSamples {
  const titleH = 0.16;
  const sideW = 0.42;
  const top = H_BROWSER / 2 - titleH;
  const left = -W_BROWSER / 2;

  // Line geometry: frame, title separator, sidebar divider, six tiles, three lights.
  const polys: { poly: V3[]; closed: boolean }[] = [];
  polys.push({ poly: roundRect(0, 0, W_BROWSER, H_BROWSER, 0.09), closed: true });
  polys.push({ poly: [[left, top, 0], [-left, top, 0]], closed: false });
  polys.push({ poly: [[left + sideW, top, 0], [left + sideW, -H_BROWSER / 2, 0]], closed: false });

  const cx0 = left + sideW + 0.06;
  const cx1 = -left - 0.06;
  const cy0 = -H_BROWSER / 2 + 0.06;
  const cy1 = top - 0.06;
  const cols = 3;
  const rows = 2;
  const gap = 0.05;
  const tileW = (cx1 - cx0 - gap * (cols - 1)) / cols;
  const tileH = (cy1 - cy0 - gap * (rows - 1)) / rows;
  const tiles: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = cx0 + tileW / 2 + c * (tileW + gap);
      const y = cy1 - tileH / 2 - r * (tileH + gap);
      tiles.push({ x, y });
      polys.push({ poly: roundRect(x, y, tileW, tileH, 0.035), closed: true });
    }
  }
  for (let i = 0; i < 3; i++) {
    polys.push({ poly: circle2D(left + 0.1 + i * 0.07, top + titleH / 2, 0.018), closed: true });
  }

  const lineCounts = allocByLength(F, polys);
  const lines: V3[] = [];
  polys.forEach((p, k) => lines.push(...pathSamples(p.poly, lineCounts[k], rng, p.closed, 0.003)));

  // Solid geometry: bar chart in the first tile, short text lines in the others, sparse fill, sidebar and address bar.
  const solids: V3[] = [];
  const [bars, textLines, sideLines, addr, dots] = split(S, [0.38, 0.22, 0.14, 0.1, 0.16]);
  const heights = [0.42, 0.7, 0.5, 0.92, 0.62, 0.8, 0.55];
  const barW = (tileW * 0.8) / heights.length;
  const barBase = tiles[0].y - tileH / 2 + tileH * 0.1;
  const barMaxH = tileH * 0.56;
  const tileBarCounts = split(bars, heights.map((h) => h));
  heights.forEach((h, b) => {
    const bx = tiles[0].x - (tileW * 0.8) / 2 + barW * (b + 0.5);
    for (let i = 0; i < tileBarCounts[b]; i++) {
      solids.push(rectFill(bx, barBase + (barMaxH * h) / 2, barW * 0.72, barMaxH * h, 0, rng));
    }
  });
  const rest = tiles.slice(1);
  // Two text-like lines per tile: a title line and a shorter body line.
  const lineSlots = rest.flatMap((t) => [
    { x: t.x - tileW * 0.12, y: t.y + tileH * 0.22, w: tileW * 0.6, h: 0.028 },
    { x: t.x - tileW * 0.2, y: t.y - tileH * 0.02, w: tileW * 0.42, h: 0.022 },
  ]);
  const slotCounts = split(textLines, lineSlots.map(() => 1));
  lineSlots.forEach((slot, k) => {
    for (let i = 0; i < slotCounts[k]; i++) solids.push(rectFill(slot.x, slot.y, slot.w, slot.h, 0, rng));
  });
  const dotCounts = split(dots, rest.map(() => 1));
  rest.forEach((t, k) => {
    for (let i = 0; i < dotCounts[k]; i++) solids.push(rectFill(t.x, t.y - tileH * 0.1, tileW * 0.84, tileH * 0.6, 0, rng));
  });
  const slCounts = split(sideLines, [1, 1, 1, 1]);
  for (let k = 0; k < 4; k++) {
    const y = top - 0.22 - k * 0.14;
    for (let i = 0; i < slCounts[k]; i++) {
      solids.push(rectFill(left + sideW / 2, y, sideW - 0.16, 0.022, 0, rng));
    }
  }
  for (let i = 0; i < addr; i++) solids.push(rectFill(0.05, top + titleH / 2, 0.7, 0.045, 0, rng));
  return { lines, solids };
}

const W_PHONE = 1.0;
const H_PHONE = 2.0;

function phoneShape(F: number, S: number, rng: Rng): ShapeSamples {
  const polys: { poly: V3[]; closed: boolean }[] = [];
  polys.push({ poly: roundRect(0, 0, W_PHONE, H_PHONE, 0.15), closed: true });
  polys.push({ poly: roundRect(0, 0, W_PHONE - 0.12, H_PHONE - 0.2, 0.11), closed: true });
  polys.push({ poly: roundRect(0, H_PHONE / 2 - 0.075, 0.34, 0.07, 0.035), closed: true });
  polys.push({ poly: [[-0.12, -H_PHONE / 2 + 0.07, 0], [0.12, -H_PHONE / 2 + 0.07, 0]], closed: false });
  const lineCounts = allocByLength(F, polys);
  const lines: V3[] = [];
  polys.forEach((p, k) => lines.push(...pathSamples(p.poly, lineCounts[k], rng, p.closed, 0.003)));

  // Solid geometry: a widget, a 4x5 icon grid and a 4-icon dock.
  const icons: { x: number; y: number; s: number }[] = [];
  const xs = [-0.27, -0.09, 0.09, 0.27];
  const ys = [0.58, 0.4, 0.22, 0.04, -0.14];
  for (const y of ys) for (const x of xs) icons.push({ x, y, s: 0.13 });
  for (const x of xs) icons.push({ x, y: -0.5, s: 0.13 });
  const widget = { x: 0, y: 0.8, w: 0.62, h: 0.14 };

  const solids: V3[] = [];
  const [wS, iconS, dockS] = split(S, [0.1, 0.7, 0.2]);
  for (let i = 0; i < wS; i++) solids.push(rectFill(widget.x, widget.y, widget.w, widget.h, 0, rng));
  const iconCount = split(iconS, icons.slice(0, 20).map(() => 1));
  icons.slice(0, 20).forEach((ic, k) => {
    for (let i = 0; i < iconCount[k]; i++) solids.push(rectFill(ic.x, ic.y, ic.s, ic.s, 0, rng));
  });
  const dockCount = split(dockS, icons.slice(20).map(() => 1));
  icons.slice(20).forEach((ic, k) => {
    for (let i = 0; i < dockCount[k]; i++) solids.push(rectFill(ic.x, ic.y, ic.s, ic.s, 0, rng));
  });
  return { lines, solids };
}

const GENERATORS = [cloudShape, coreShape, clustersShape, gridShape, phoneShape];

export interface Targets {
  count: number;
  /** One Float32Array (count * 3) per shape, in SHAPE_NAMES order. */
  shapes: Float32Array[];
  /** count * 4: x = random phase, y = size factor, z = hue seed, w = faint flag. */
  seeds: Float32Array;
}

export function buildTargets(count: number, seed = 20261014): Targets {
  const rng = mulberry32(seed);
  const F = Math.round(count * FAINT_RATIO);
  const S = count - F;
  const shapes = GENERATORS.map((gen) => {
    const { lines, solids } = gen(F, S, rng);
    const arr = new Float32Array(count * 3);
    const write = (pts: V3[], start: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const p: V3 = pts.length ? pts[i % pts.length] : [0, 0, 0];
        const o = (start + i) * 3;
        arr[o] = p[0];
        arr[o + 1] = p[1];
        arr[o + 2] = p[2];
      }
    };
    write(lines, 0, F);
    write(solids, F, S);
    return arr;
  });

  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const o = i * 4;
    seeds[o] = rng();
    seeds[o + 1] = 0.8 + rng() * 0.45;
    seeds[o + 2] = rng();
    seeds[o + 3] = i < F ? 1 : 0;
  }
  return { count, shapes, seeds };
}
