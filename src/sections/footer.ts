import { content } from '../content';
import { el } from '../lib/dom';

/** Footer: one line. */
export function renderFooter(): HTMLElement {
  return el('footer', { class: 'site-footer' }, el('div', { class: 'wrap' }, el('p', { class: 'footer-line' }, content.footer)));
}
