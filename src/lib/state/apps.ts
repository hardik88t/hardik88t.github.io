import type { IconName } from '$lib/icons';

export type AppId =
	| 'readme'
	| 'agents'
	| 'terminal'
	| 'work'
	| 'about'
	| 'services'
	| 'resume'
	| 'contact'
	| 'settings';

export interface AppDef {
	id: AppId;
	/** Window title bar text. */
	title: string;
	/** Launcher label (dock, home screen, menus). */
	name: string;
	icon: IconName;
	/** Tile colour for the launcher icon (from the project accent palette). */
	tint: string;
	/** Glyph colour that reads well on the tint. */
	glyph: string;
	/** Default window size in px. */
	size: [number, number];
	dock: boolean;
	home: boolean;
}

export const APPS: Record<AppId, AppDef> = {
	readme: {
		id: 'readme',
		title: 'README.md',
		name: 'README',
		icon: 'doc',
		tint: '#161a22',
		glyph: '#ffffff',
		size: [560, 620],
		dock: false,
		home: false
	},
	terminal: {
		id: 'terminal',
		title: 'Terminal',
		name: 'Terminal',
		icon: 'terminal',
		tint: '#161a22',
		glyph: '#8db0ff',
		size: [600, 330],
		dock: true,
		home: true
	},
	work: {
		id: 'work',
		title: 'Work',
		name: 'Work',
		icon: 'folder',
		tint: '#f5a524',
		glyph: '#161a22',
		size: [880, 580],
		dock: true,
		home: true
	},
	agents: {
		id: 'agents',
		title: 'Agents: activity monitor',
		name: 'Agents',
		icon: 'activity',
		tint: '#2e5bff',
		glyph: '#ffffff',
		size: [680, 520],
		dock: true,
		home: true
	},
	about: {
		id: 'about',
		title: 'About Hardik',
		name: 'About',
		icon: 'user',
		tint: '#2ec4b6',
		glyph: '#0b1f1d',
		size: [540, 600],
		dock: true,
		home: true
	},
	services: {
		id: 'services',
		title: 'Services',
		name: 'Services',
		icon: 'layers',
		tint: '#3dd6a3',
		glyph: '#0b2119',
		size: [600, 540],
		dock: true,
		home: true
	},
	resume: {
		id: 'resume',
		title: 'Résumé',
		name: 'Résumé',
		icon: 'file',
		tint: '#9b7bff',
		glyph: '#ffffff',
		size: [560, 620],
		dock: true,
		home: true
	},
	contact: {
		id: 'contact',
		title: 'Contact: Mail',
		name: 'Contact',
		icon: 'mail',
		tint: '#ff6b6b',
		glyph: '#2a0b0b',
		size: [560, 580],
		dock: true,
		home: true
	},
	settings: {
		id: 'settings',
		title: 'Settings',
		name: 'Settings',
		icon: 'settings',
		tint: '#5c6b63',
		glyph: '#ffffff',
		size: [460, 480],
		dock: false,
		home: true
	}
};

export const DOCK_APPS: AppId[] = ['terminal', 'work', 'agents', 'about', 'services', 'resume', 'contact'];
export const PHONE_DOCK: AppId[] = ['agents', 'work', 'contact', 'terminal'];
export const HOME_APPS: AppId[] = ['terminal', 'work', 'agents', 'about', 'services', 'resume', 'contact', 'settings'];
