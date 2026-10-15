// World layout for the design canvas (css px at zoom 1). Six project frames in a 3 x 2 grid, in the work
// order (lib/projects.ts). Each frame has its title and caption in the label row above it, and its sticky
// note in the lane to the right. Frames, labels and notes all come from content-v2.json.
import { WORK_ORDER } from '../lib/projects';

/** Label row above each frame: title on the left, caption on the right, plus the gap below them. */
export const LABEL_H = 56;
/** Gap between the frame edge and its sticky note. */
export const NOTE_GAP = 40;
/** Width of a sticky note. */
export const NOTE_W = 240;
/** Space a sticky note takes to the right of its frame. */
export const LANE = NOTE_GAP + NOTE_W;

const FRAME_W = 1280;
const COL_GUTTER = 96;
/** Gap between neighbouring frames (their lanes included). The start view keeps it on screen so neighbours peek. */
export const FRAME_GAP = COL_GUTTER;
const ROW_GUTTER = 140;
const PAD = 80;
const COLS = 3;

/** Design size of each mock. Matches the root size of its component in src/mocks. */
const SIZE: Record<string, { w: number; h: number }> = {
  medjot: { w: FRAME_W, h: 880 },
  fieldbook: { w: FRAME_W, h: 880 },
};
const DEFAULT_SIZE = { w: FRAME_W, h: 800 };
/** The tallest frame sets the row pitch, so no frame touches the row below. */
const TALLEST = 880;

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
const ROW_PITCH = TALLEST + LABEL_H + ROW_GUTTER;

/** Navigation order (switcher, arrow keys, minimap) follows the work order. */
export const FRAMES: FrameSpec[] = WORK_ORDER.map((slug, index) => {
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

/** Label, frame and sticky note as one box. Used for fit, focus and the start view. */
export function frameBox(f: FrameSpec): Box {
  return { x: f.x, y: f.y - LABEL_H, w: f.w + LANE, h: f.h + LABEL_H };
}

function computeBBox(): Box {
  let maxX = 0;
  let maxY = 0;
  for (const f of FRAMES) {
    maxX = Math.max(maxX, f.x + f.w + LANE);
    maxY = Math.max(maxY, f.y + f.h);
  }
  return { x: 0, y: 0, w: maxX + PAD, h: maxY + PAD };
}

/** Bounds of everything on the canvas, labels and sticky notes included. */
export const BBOX = computeBBox();

/** Index of a project slug, or the first frame when the slug is missing or unknown. */
export function indexOfSlug(slug: string | null | undefined): number {
  if (!slug) return 0;
  const i = FRAMES.findIndex((f) => f.slug === slug);
  return i < 0 ? 0 : i;
}
