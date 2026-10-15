// Terminal session state. It lives in memory and survives closing and reopening the app.
import { WELCOME, type Line } from './engine';

export const term = $state({
	lines: [...WELCOME] as Line[],
	history: [] as string[],
	busy: false
});
