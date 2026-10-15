import { animate } from 'motion/react';
import { BBOX, FRAMES, LABEL_H, CAPTION_H, frameBox, type FrameSpec } from './layout';

/** Zoom limits for wheel, pinch, buttons and keys. */
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2;
/** Fit-all and frame focus may go past these limits so that a whole frame stays visible. */
const FIT_MIN = 0.1;
const FIT_MAX = 1.2;
/** Focus transitions stay under 600 ms, ease-out. */
export const FOCUS_S = 0.55;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Insets relative to the stage (the stage starts below the 68 px top bar). */
export const INSET = { top: 40, bottom: 150, side: 32 };
export const START_INSET = { top: 40, bottom: 84 };
/** Readability floor and ceiling for the start zoom. */
const START_MIN = 0.6;
const START_MAX = 1.0;
/** Screen px kept clear at each side of the start view, so the neighbouring frames can peek in. */
const PEEK_PX = 48;

export interface View {
  x: number;
  y: number;
  k: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Owns the canvas transform. Pointer and wheel handlers only mutate `view` and schedule one
 * paint per frame, so no React state changes on every move.
 */
export class CanvasController {
  view: View = { x: 0, y: 0, k: 1 };
  size = { w: 1280, h: 800 };
  reduceMotion = false;

  private stage: HTMLElement | null = null;
  private world: HTMLElement | null = null;
  private raf = 0;
  private anim: { stop: () => void } | null = null;
  private painters = new Set<(v: View) => void>();
  private settlers = new Set<(v: View) => void>();

  bind(stage: HTMLElement, world: HTMLElement) {
    this.stage = stage;
    this.world = world;
    this.measure();
    this.paint();
  }

  measure() {
    if (!this.stage) return;
    const r = this.stage.getBoundingClientRect();
    this.size = { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }

  /** Called on every paint. Use it to update DOM read-outs without React state. */
  subscribe(fn: (v: View) => void): () => void {
    this.painters.add(fn);
    fn(this.view);
    return () => {
      this.painters.delete(fn);
    };
  }

  /** Called once movement has settled (pointer up, wheel idle, animation end). */
  onSettle(fn: (v: View) => void): () => void {
    this.settlers.add(fn);
    return () => {
      this.settlers.delete(fn);
    };
  }

  settle() {
    const v = { ...this.view };
    this.settlers.forEach((fn) => fn(v));
  }

  stop() {
    if (this.anim) {
      this.anim.stop();
      this.anim = null;
    }
  }

  private schedule() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.paint();
    });
  }

  private paint() {
    const { x, y, k } = this.view;
    if (this.world) this.world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${k})`;
    if (this.stage) {
      const grid = 24 * k;
      this.stage.style.backgroundSize = `${grid}px ${grid}px`;
      this.stage.style.backgroundPosition = `${x}px ${y}px`;
    }
    this.painters.forEach((fn) => fn(this.view));
  }

  private set(next: Partial<View>) {
    Object.assign(this.view, next);
    this.schedule();
  }

  /** Visible centre of the stage, between the top bar and the bottom edge. */
  center() {
    return { x: this.size.w / 2, y: (START_INSET.top + this.size.h - START_INSET.bottom) / 2 };
  }

  /** Centre used for fit-all and frame focus, which keep clear of the minimap and zoom bar. */
  private fitCenter() {
    return { x: this.size.w / 2, y: (INSET.top + this.size.h - INSET.bottom) / 2 };
  }

  /**
   * Start view for a frame: the frame and its margin note at a readable zoom, centred, with a
   * strip of the neighbours showing at each side when the viewport is wide enough.
   */
  startView(index: number): View {
    const f = FRAMES[index] ?? FRAMES[0];
    if (!f) return { x: 0, y: 0, k: 1 };
    const box = frameBox(f);
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const vertMax = (this.size.h - START_INSET.top - START_INSET.bottom) / box.h;
    const sideMax = (this.size.w - PEEK_PX * 2) / box.w;
    const k = clamp(Math.min(vertMax * 0.97, sideMax, START_MAX), START_MIN, START_MAX);
    const c = this.center();
    return { x: c.x - cx * k, y: c.y - cy * k, k };
  }

  panBy(dx: number, dy: number) {
    this.set({ x: this.view.x + dx, y: this.view.y + dy });
  }

  /** Zoom by a factor, keeping the world point under (sx, sy) fixed. */
  zoomAt(sx: number, sy: number, factor: number) {
    const { x, y, k } = this.view;
    if (factor < 1 && k <= MIN_ZOOM) return;
    const k2 = clamp(k * factor, MIN_ZOOM, MAX_ZOOM);
    if (k2 === k) return;
    const r = k2 / k;
    this.set({ x: sx - (sx - x) * r, y: sy - (sy - y) * r, k: k2 });
  }

  zoomCenter(factor: number) {
    const c = this.center();
    this.zoomAt(c.x, c.y, factor);
    this.settle();
  }

  /** Target view that fits a world rectangle inside the visible area. */
  private fitView(rect: { x: number; y: number; w: number; h: number }, minK: number, maxK: number): View {
    const availW = this.size.w - INSET.side * 2;
    const availH = this.size.h - INSET.top - INSET.bottom;
    const k = clamp(Math.min(availW / rect.w, availH / rect.h), minK, maxK);
    const c = this.fitCenter();
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    return { x: c.x - cx * k, y: c.y - cy * k, k };
  }

  fitAllView(): View {
    return this.fitView(BBOX, FIT_MIN, FIT_MAX);
  }

  frameView(f: FrameSpec): View {
    return this.fitView(frameBox(f), MIN_ZOOM, FIT_MAX);
  }

  /** Animate to a view. Duration 0 applies it straight away. */
  animateTo(target: View, duration = FOCUS_S) {
    this.stop();
    if (this.reduceMotion || duration <= 0) {
      this.set(target);
      this.settle();
      return;
    }
    const from = { ...this.view };
    const ratio = target.k / from.k;
    this.anim = animate(0, 1, {
      duration,
      ease: EASE,
      onUpdate: (p: number) => {
        this.set({
          x: lerp(from.x, target.x, p),
          y: lerp(from.y, target.y, p),
          k: from.k * Math.pow(ratio, p),
        });
      },
      onComplete: () => {
        this.anim = null;
        this.settle();
      },
    });
  }

  /** Focus one frame: fit its label, frame and caption to the visible area. */
  focusIndex(index: number, animated = true) {
    const f = FRAMES[index];
    if (!f) return;
    this.animateTo(this.frameView(f), animated ? FOCUS_S : 0);
  }

  fitAll(animated = true) {
    this.animateTo(this.fitAllView(), animated ? FOCUS_S : 0);
  }

  /** Centre the view on a world point, keeping the current zoom. */
  centerOn(wx: number, wy: number, animated = true) {
    const c = this.center();
    const k = this.view.k;
    this.animateTo({ x: c.x - wx * k, y: c.y - wy * k, k }, animated ? FOCUS_S : 0);
  }

  /** Index of the frame that the visible centre is on, or nearest to it. */
  nearestIndex(v: View = this.view): number {
    const c = this.center();
    const wx = (c.x - v.x) / v.k;
    const wy = (c.y - v.y) / v.k;
    let best = 0;
    let bestScore = Infinity;
    FRAMES.forEach((f, i) => {
      const inside = wx >= f.x && wx <= f.x + f.w && wy >= f.y - LABEL_H && wy <= f.y + f.h + CAPTION_H;
      if (inside) {
        best = i;
        bestScore = -1;
        return;
      }
      if (bestScore < 0) return;
      const d = Math.hypot(wx - (f.x + f.w / 2), wy - (f.y + f.h / 2));
      if (d < bestScore) {
        bestScore = d;
        best = i;
      }
    });
    return best;
  }
}
