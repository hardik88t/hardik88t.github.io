// World layout for the design canvas (units are css px at zoom 1).
// Eight project frames in a 4 x 2 grid, in the same order as the work index.
// Each frame has its label above it and its caption below; the margin note sits in the lane to the right.
import { workOrder } from '../lib/content';

/** Label row above each frame (label text plus gap). */
export const LABEL_H = 56;
/** Caption row below each frame. */
export const CAPTION_H = 64;
/** Gap between the frame edge and its margin note. */
export const NOTE_GAP = 40;
/** Width of a margin note. */
export const NOTE_W = 240;
/** Space a margin note takes to the right of its frame. */
export const LANE = NOTE_GAP + NOTE_W;

const FRAME_W = 1280;
const COL_GUTTER = 96;
const ROW_GUTTER = 120;
const PAD = 80;
const COLS = 4;

/** Design size of each mock. Matches the root size of its component in src/mocks. */
const SIZE: Record<string, { w: number; h: number }> = {
  medjot: { w: FRAME_W, h: 880 },
  fieldbook: { w: FRAME_W, h: 880 },
};
const DEFAULT_SIZE = { w: FRAME_W, h: 800 };

export function frameSize(slug: string): { w: number; h: number } {
  return SIZE[slug] ?? DEFAULT_SIZE;
}

export interface FrameSpec {
  slug: string;
  index: number;
  row: number;
  col: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const COL_PITCH = FRAME_W + LANE + COL_GUTTER;
const ROW_PITCH = 880 + LABEL_H + CAPTION_H + ROW_GUTTER;

/** Navigation order (switcher, arrow keys) follows the work order. */
export const FRAMES: FrameSpec[] = workOrder.map((slug, index) => {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  const { w, h } = frameSize(slug);
  return {
    slug,
    index,
    row,
    col,
    x: PAD + col * COL_PITCH,
    y: PAD + LABEL_H + row * ROW_PITCH,
    w,
    h,
  };
});

/** Label, frame, caption and margin note as one box. Used for fit, focus and the start view. */
export function frameBox(f: FrameSpec): Box {
  return { x: f.x, y: f.y - LABEL_H, w: f.w + LANE, h: f.h + LABEL_H + CAPTION_H };
}

function computeBBox(): Box {
  let maxX = 0;
  let maxY = 0;
  for (const f of FRAMES) {
    maxX = Math.max(maxX, f.x + f.w + LANE);
    maxY = Math.max(maxY, f.y + f.h + CAPTION_H);
  }
  return { x: 0, y: 0, w: maxX + PAD, h: maxY + PAD };
}

/** Bounds of everything on the canvas, labels, captions and margin notes included. */
export const BBOX = computeBBox();

/** Index of a project slug, or the first frame when the slug is missing or unknown. */
export function indexOfSlug(slug: string | null | undefined): number {
  if (!slug) return 0;
  const i = FRAMES.findIndex((f) => f.slug === slug);
  return i < 0 ? 0 : i;
}
