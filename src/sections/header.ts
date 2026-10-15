import { content } from '../content';
import { el } from '../lib/dom';
import { scrollToTarget } from '../lib/scroll';

/** Fixed header: brand and one contact button. No navigation list on purpose. */
export function renderHeader(): HTMLElement {
  const p = content.person;
  const header = el(
    'header',
    { class: 'site-header', id: 'site-header' },
    el(
      'div',
      { class: 'wrap header-inner' },
      el(
        'a',
        { class: 'brand', href: '#top', 'aria-label': `${p.name}, back to top` },
        el('span', { class: 'brand-mark', 'aria-hidden': 'true' }, p.monogram),
        el('span', { class: 'brand-name' }, p.name),
      ),
      el('a', { class: 'btn btn-small btn-primary', href: '#contact' }, 'Contact'),
    ),
  );

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  return header;
}

/** Delegated handler so in-page links use the smooth scroller and keep the hash in sync. */
export function bindAnchorLinks(): void {
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const a = e.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.querySelector<HTMLElement>(a.getAttribute('href') ?? '');
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target, -64);
    history.replaceState(null, '', a.getAttribute('href'));
  });
}
