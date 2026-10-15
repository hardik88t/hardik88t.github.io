import { observe } from '$lib/state/sim.svelte';

/**
 * Svelte action: keeps the simulated fleet ticking only while this element is on screen
 * (and not hidden with display:none, which reports as not intersecting).
 */
export function live(node: HTMLElement) {
	let release: (() => void) | null = null;
	const io = new IntersectionObserver(
		(entries) => {
			const visible = entries.some((e) => e.isIntersecting);
			if (visible && !release) release = observe();
			else if (!visible && release) {
				release();
				release = null;
			}
		},
		{ threshold: 0 }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
			release?.();
			release = null;
		}
	};
}
