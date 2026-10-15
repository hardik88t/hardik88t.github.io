import type Lenis from 'lenis';
import { prefersReducedMotion } from './dom';

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

/** Scrolls to a selector or element, through Lenis when smooth scrolling is active. */
export function scrollToTarget(target: string | HTMLElement, offset = -72): void {
  const node = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!node) return;
  if (lenis) {
    lenis.scrollTo(node, { offset, duration: 1.2 });
  } else {
    node.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }
}

export function scrollToY(y: number): void {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
