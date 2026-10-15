// World layout for the desktop canvas (units are css px at zoom 1).
// Three columns by three rows, the Hello card centred in the middle cell.

export type FrameId =
  | 'hello'
  | 'wholesale-os'
  | 'fieldbook'
  | 'medjot'
  | 'paper-studio'
  | 'footnote'
  | 'kiln-ui'
  | 'dhi'
  | 'contact';

export interface FrameSpec {
  id: FrameId;
  kind: 'hello' | 'project' | 'contact';
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rotation of the sticky note in degrees (project frames only). */
  tilt?: number;
}

/** Height of the label row above each frame (label + gap). */
export const LABEL_H = 56;
/** Width of the sticky-note lane to the right of a project frame. */
export const STICKY_W = 220;
export const STICKY_GAP = 32;

const COL_X = [0, 1560, 3120];
const ROW_Y = [56, 1096, 2056];

/** Navigation order (switcher, arrow keys) follows the list order. */
export const FRAMES: FrameSpec[] = [
  { id: 'hello', kind: 'hello', x: COL_X[1] + 340, y: ROW_Y[1], w: 600, h: 800 },
  { id: 'wholesale-os', kind: 'project', x: COL_X[0], y: ROW_Y[0], w: 1280, h: 800, tilt: -1.6 },
  { id: 'fieldbook', kind: 'project', x: COL_X[1], y: ROW_Y[0], w: 1280, h: 880, tilt: 1.2 },
  { id: 'medjot', kind: 'project', x: COL_X[2], y: ROW_Y[0], w: 1280, h: 880, tilt: -1 },
  { id: 'paper-studio', kind: 'project', x: COL_X[0], y: ROW_Y[1], w: 1280, h: 800, tilt: 1.4 },
  { id: 'footnote', kind: 'project', x: COL_X[2], y: ROW_Y[1], w: 1280, h: 800, tilt: -1.2 },
  { id: 'kiln-ui', kind: 'project', x: COL_X[0], y: ROW_Y[2], w: 1280, h: 800, tilt: 1.1 },
  { id: 'dhi', kind: 'project', x: COL_X[1], y: ROW_Y[2], w: 1280, h: 800, tilt: -1.5 },
  { id: 'contact', kind: 'contact', x: COL_X[2] + 360, y: ROW_Y[2] + 100, w: 560, h: 600 },
];

function computeBBox() {
  let maxX = 0;
  let maxY = 0;
  for (const f of FRAMES) {
    maxX = Math.max(maxX, f.x + f.w);
    maxY = Math.max(maxY, f.y + f.h);
    if (f.kind === 'project') maxX = Math.max(maxX, f.x + f.w + STICKY_GAP + STICKY_W);
  }
  return { x: 0, y: 0, w: maxX, h: maxY };
}

/** Bounds of everything on the canvas, labels and sticky notes included. */
export const BBOX = computeBBox();

export function frameById(id: FrameId): FrameSpec {
  const f = FRAMES.find((item) => item.id === id);
  if (!f) throw new Error(`Unknown frame ${id}`);
  return f;
}
