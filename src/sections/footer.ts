import { content } from '../content';
import { el } from '../lib/dom';

export function renderFooter(): HTMLElement {
  const p = content.profile;
  return el(
    'footer',
    { class: 'site-footer' },
    el(
      'div',
      { class: 'wrap footer-inner' },
      el('p', { class: 'footer-line' }, content.footer),
      el(
        'nav',
        { class: 'footer-nav', 'aria-label': 'Footer' },
        el('a', { href: p.links.github, target: '_blank', rel: 'noopener noreferrer' }, 'GitHub'),
        el('a', { href: p.links.linkedin, target: '_blank', rel: 'noopener noreferrer' }, 'LinkedIn'),
        el('a', { href: p.links.business, target: '_blank', rel: 'noopener noreferrer' }, 'Avinya IT'),
        el('a', { href: '#top' }, 'Back to top'),
      ),
      el('p', { class: 'footer-small' }, `© 2026 ${p.name}`),
    ),
  );
}
