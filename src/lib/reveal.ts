/**
 * One-shot section fade-in. Content is visible by default; the hidden state is only
 * applied when JS runs, motion is allowed, and the node is below the fold.
 */
export function revealOnScroll(node: HTMLElement) {
	if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const rect = node.getBoundingClientRect();
	if (rect.top < window.innerHeight * 0.92) return; // already in view: never hide it

	node.classList.add('reveal');
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-in');
					io.disconnect();
					break;
				}
			}
		},
		{ rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
}
