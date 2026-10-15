import { content } from '../content';
import { copyText, el } from '../lib/dom';

/** Contact: the address as selectable text with a copy button, plus links and availability. */
export function renderContact(): HTMLElement {
  const p = content.person;
  const status = el('p', { class: 'copy-status', role: 'status', 'aria-live': 'polite' });
  const copyBtn = el('button', { type: 'button', class: 'btn btn-primary', id: 'copy-email' }, 'Copy email');
  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(p.email);
    status.textContent = ok ? 'Email copied to your clipboard.' : 'Copy was blocked. Select the address above and copy it manually.';
  });
  const link = (label: string, href: string) =>
    el(
      'li',
      null,
      el('a', { class: 'contact-link', href, target: '_blank', rel: 'noopener noreferrer' }, el('span', null, label), el('span', { class: 'arrow', 'aria-hidden': 'true' }, '↗')),
    );
  return el(
    'section',
    { id: 'contact', class: 'section contact', 'aria-labelledby': 'contact-title' },
    el(
      'div',
      { class: 'wrap contact-grid' },
      el(
        'div',
        { class: 'contact-copy' },
        el('p', { class: 'eyebrow' }, 'Contact'),
        el('h2', { id: 'contact-title', class: 'section-title' }, 'Start a project'),
        el('p', { class: 'section-lede' }, 'Tell me what you are building and where it is stuck. Email is the quickest way to start.'),
        el('p', { class: 'contact-avail' }, `${p.availability}. ${p.remote}.`),
      ),
      el(
        'div',
        { class: 'contact-card reveal' },
        el('p', { class: 'contact-label' }, 'Email'),
        el('p', { class: 'contact-email' }, p.email),
        el('div', { class: 'copy-row' }, copyBtn, el('a', { class: 'btn btn-ghost', href: `mailto:${p.email}` }, 'Open in mail app')),
        status,
        el('ul', { class: 'contact-links' }, link('LinkedIn', p.links.linkedin), link('GitHub', p.links.github), link('CV (PDF)', p.links.cv)),
      ),
    ),
  );
}
