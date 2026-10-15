// App-level UI state: which view (desktop/phone OS or linear page), theme, layout
// breakpoint, the phone sheet and the selected project. Stored choices live in
// localStorage only as per-browser conveniences, and every access is guarded.
import { projects } from '$lib/content';
import { type AppId } from './apps';
import { arrange, openWin, setViewport, wm } from './wm.svelte';

export type View = 'os' | 'page';
export type Theme = 'system' | 'light' | 'dark';
export type Layout = 'desktop' | 'phone';

export const DESKTOP_MIN = 1024;

export const ui = $state({
	view: 'page' as View,
	theme: 'system' as Theme,
	layout: 'phone' as Layout,
	reduced: false,
	sheet: null as AppId | null,
	project: (projects[0]?.slug ?? null) as string | null,
	ready: false
});

function read(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function write(key: string, value: string) {
	try {
		localStorage.setItem(key, value);
	} catch {
		// storage blocked: the choice simply lasts for this page view
	}
}

export function openApp(app: AppId, opts: { project?: string } = {}) {
	if (opts.project) ui.project = opts.project;
	if (ui.layout === 'desktop') {
		openWin(app);
	} else {
		ui.sheet = app;
	}
}

export function closeSheet() {
	ui.sheet = null;
}

export function setView(view: View) {
	ui.view = view;
	write('hos-view', view);
	if (view === 'os') ui.sheet = null;
}

export function applyTheme(theme: Theme) {
	ui.theme = theme;
	const root = document.documentElement;
	if (theme === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', theme);
	if (theme === 'system') {
		try {
			localStorage.removeItem('hos-theme');
		} catch {
			// ignore
		}
	} else {
		write('hos-theme', theme);
	}
}

export function resetLayout() {
	if (ui.layout === 'desktop') arrange();
}

/** Called once on mount. Sets up breakpoint, motion and viewport tracking. */
export function initUi(): () => void {
	const root = document.documentElement;
	const storedTheme = read('hos-theme');
	ui.theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system';
	ui.view = root.dataset.view === 'page' ? 'page' : 'os';

	const desktopMq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
	const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

	const onLayout = () => {
		const next: Layout = desktopMq.matches ? 'desktop' : 'phone';
		const changed = next !== ui.layout;
		ui.layout = next;
		if (changed) ui.sheet = null;
		setViewport(window.innerWidth, window.innerHeight);
		if (next === 'desktop' && wm.windows.length === 0) arrange();
	};
	const onMotion = () => {
		ui.reduced = motionMq.matches;
	};
	const onResize = () => {
		setViewport(window.innerWidth, window.innerHeight);
	};

	onLayout();
	onMotion();
	desktopMq.addEventListener('change', onLayout);
	motionMq.addEventListener('change', onMotion);
	window.addEventListener('resize', onResize);
	ui.ready = true;

	return () => {
		desktopMq.removeEventListener('change', onLayout);
		motionMq.removeEventListener('change', onMotion);
		window.removeEventListener('resize', onResize);
	};
}
