// Desktop window manager: one window per app, pointer drag, z-order, minimise, zoom.
import { APPS, type AppId } from './apps';

export const MENU_H = 28;
/** Space kept clear at the bottom for the dock. */
export const DOCK_ZONE = 92;

export interface Win {
	app: AppId;
	x: number;
	y: number;
	w: number;
	h: number;
	z: number;
	min: boolean;
	max: boolean;
	rest: { x: number; y: number; w: number; h: number } | null;
}

export const wm = $state({
	windows: [] as Win[],
	top: 20,
	vw: 1440,
	vh: 900,
	active: null as AppId | null,
	/** Bumped to ask a window to take DOM focus (used after opening or restoring). */
	focusReq: null as { app: AppId; n: number } | null
});

export function findWin(app: AppId): Win | undefined {
	return wm.windows.find((w) => w.app === app);
}

function clamp(v: number, lo: number, hi: number): number {
	return Math.min(Math.max(v, lo), Math.max(lo, hi));
}

function bounds(w: number, h: number) {
	return {
		minX: -(w - 120),
		maxX: wm.vw - 120,
		minY: MENU_H,
		maxY: wm.vh - 64,
		maxH: wm.vh - MENU_H - DOCK_ZONE
	};
}

function constrain(win: Win) {
	if (win.max) {
		win.x = 0;
		win.y = MENU_H;
		win.w = wm.vw;
		win.h = Math.max(240, wm.vh - MENU_H - DOCK_ZONE);
		return;
	}
	win.w = Math.min(win.w, wm.vw - 16);
	win.h = Math.min(win.h, Math.max(240, wm.vh - MENU_H - 12));
	const b = bounds(win.w, win.h);
	win.x = clamp(win.x, b.minX, b.maxX);
	win.y = clamp(win.y, b.minY, b.maxY);
}

function raise(win: Win) {
	win.z = ++wm.top;
	wm.active = win.app;
}

export function requestFocus(app: AppId) {
	wm.focusReq = { app, n: (wm.focusReq?.n ?? 0) + 1 };
}

export function openWin(app: AppId) {
	const existing = findWin(app);
	if (existing) {
		existing.min = false;
		raise(existing);
		requestFocus(app);
		return;
	}
	const def = APPS[app];
	const n = wm.windows.length;
	const w = Math.min(def.size[0], wm.vw - 32);
	const h = Math.min(def.size[1], Math.max(300, wm.vh - MENU_H - DOCK_ZONE - 16));
	const x = Math.max(16, Math.round((wm.vw - w) / 2 + ((n % 5) - 2) * 30));
	const y = Math.max(MENU_H + 12, Math.round((wm.vh - DOCK_ZONE - h) / 2 + ((n % 5) - 2) * 22));
	const win: Win = { app, x, y, w, h, z: 0, min: false, max: false, rest: null };
	constrain(win);
	wm.windows.push(win);
	raise(win);
	requestFocus(app);
}

export function closeWin(app: AppId) {
	wm.windows = wm.windows.filter((w) => w.app !== app);
	if (wm.active === app) {
		const top = [...wm.windows].filter((w) => !w.min).sort((a, b) => b.z - a.z)[0];
		wm.active = top?.app ?? null;
	}
}

export function minimiseWin(app: AppId) {
	const w = findWin(app);
	if (!w) return;
	w.min = true;
	const top = [...wm.windows].filter((x) => !x.min).sort((a, b) => b.z - a.z)[0];
	wm.active = top?.app ?? null;
}

export function focusWin(app: AppId) {
	const w = findWin(app);
	if (!w) return;
	raise(w);
}

export function toggleZoom(app: AppId) {
	const w = findWin(app);
	if (!w) return;
	if (w.max && w.rest) {
		Object.assign(w, w.rest);
		w.max = false;
		w.rest = null;
	} else {
		w.rest = { x: w.x, y: w.y, w: w.w, h: w.h };
		w.max = true;
	}
	constrain(w);
	raise(w);
}

export function moveWin(app: AppId, x: number, y: number) {
	const w = findWin(app);
	if (!w || w.max) return;
	w.x = x;
	w.y = y;
	constrain(w);
}

/** Default desktop arrangement: README left, Agents top right, Terminal bottom right. */
export function arrange() {
	const margin = 24;
	const gap = 20;
	const top = MENU_H + 16;
	const bottom = wm.vh - DOCK_ZONE;
	const avail = Math.max(420, bottom - top);
	const leftW = Math.round(Math.min(520, Math.max(400, wm.vw * 0.36)));
	const rightAvail = wm.vw - margin * 2 - leftW - gap;
	const rightW = Math.round(Math.min(820, Math.max(460, rightAvail)));
	const groupW = leftW + gap + rightW;
	const startX = Math.round(margin + Math.max(0, (wm.vw - margin * 2 - groupW) / 2));
	const agentsH = Math.round((avail - gap) * 0.56);

	wm.windows = [];
	wm.active = null;
	const place = (app: AppId, x: number, y: number, w: number, h: number) => {
		const win: Win = { app, x, y, w, h, z: 0, min: false, max: false, rest: null };
		constrain(win);
		wm.windows.push(win);
		raise(win);
	};
	place('readme', startX, top, leftW, avail);
	place('agents', startX + leftW + gap, top, rightW, agentsH);
	place('terminal', startX + leftW + gap, top + agentsH + gap, rightW, avail - agentsH - gap);
	wm.active = 'terminal';
	const t = findWin('terminal');
	if (t) raise(t);
}

export function setViewport(vw: number, vh: number) {
	wm.vw = vw;
	wm.vh = vh;
	for (const w of wm.windows) constrain(w);
}
