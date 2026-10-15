import { project, type Project } from '../content';
import { chips, el } from '../lib/dom';
import { setScrollLock } from '../lib/scroll';
import { mockSvg } from './mocks';

/** A proof card: code-drawn thumbnail, type, title and one line. Tapping opens the sheet. */
export function proofCard(slug: string): HTMLButtonElement {
  const p = project(slug);
  const accent = /^#[0-9a-f]{6}$/i.test(p.accent) ? p.accent : '#3FE0D0';
  const card = el(
    'button',
    { type: 'button', class: 'proof', style: `--accent:${accent}`, 'aria-haspopup': 'dialog' },
    el('span', { class: 'proof-thumb', 'aria-hidden': 'true' }),
    el('span', { class: 'proof-body' }, el('span', { class: 'proof-type' }, p.type), el('span', { class: 'proof-title' }, p.title), el('span', { class: 'proof-line' }, p.oneLiner)),
  );
  const thumb = card.querySelector<HTMLElement>('.proof-thumb');
  if (thumb) thumb.innerHTML = mockSvg(slug, p.accent);
  card.addEventListener('click', () => openSheet(p, card));
  return card;
}

let sheetEl: HTMLDialogElement | null = null;
let returnFocus: HTMLElement | null = null;

/** One shared dialog, filled per project. Native <dialog> gives the focus trap and Escape. */
function ensureSheet(): HTMLDialogElement {
  if (sheetEl) return sheetEl;
  const dialog = el('dialog', { class: 'sheet', 'aria-labelledby': 'sheet-title' });
  dialog.addEventListener('click', (e) => {
    // A click on the backdrop lands on the dialog element itself, outside the inner panel.
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    setScrollLock(false);
    returnFocus?.focus({ preventScroll: true });
    returnFocus = null;
  });
  document.body.appendChild(dialog);
  sheetEl = dialog;
  return dialog;
}

function openSheet(p: Project, trigger: HTMLElement): void {
  const dialog = ensureSheet();
  returnFocus = trigger;
  const accent = /^#[0-9a-f]{6}$/i.test(p.accent) ? p.accent : '#3FE0D0';
  // Anonymised client work never gets a link.
  const github = p.anonymized ? undefined : p.links?.github;
  dialog.replaceChildren(
    el(
      'div',
      { class: 'sheet-inner', style: `--accent:${accent}` },
      el(
        'div',
        { class: 'sheet-head' },
        el('p', { class: 'eyebrow' }, p.type),
        el('button', { type: 'button', class: 'icon-btn', 'data-sheet-close': '', 'aria-label': 'Close' }, '×'),
      ),
      el('div', { class: 'sheet-visual', role: 'img', 'aria-label': p.visual }),
      el('h2', { id: 'sheet-title', class: 'sheet-title' }, p.title),
      el('p', { class: 'sheet-line' }, p.oneLiner),
      p.anonymized && p.client ? el('p', { class: 'sheet-client' }, el('span', null, 'Client'), p.client) : null,
      el(
        'dl',
        { class: 'sheet-story' },
        el('div', null, el('dt', null, 'Challenge'), el('dd', null, p.challenge)),
        el('div', null, el('dt', null, 'Approach'), el('dd', null, p.approach)),
        el('div', null, el('dt', null, 'Outcome'), el('dd', null, p.outcome)),
      ),
      el('h3', { class: 'sheet-sub' }, 'Stack'),
      chips(p.stack, 'chip chip-mono'),
      github
        ? el('a', { class: 'text-link', href: github, target: '_blank', rel: 'noopener noreferrer' }, 'View the code', el('span', { class: 'sr-only' }, ' on GitHub, opens in a new tab'))
        : null,
    ),
  );
  const visual = dialog.querySelector<HTMLElement>('.sheet-visual');
  if (visual) visual.innerHTML = mockSvg(p.slug, p.accent);
  dialog.querySelector<HTMLButtonElement>('[data-sheet-close]')?.addEventListener('click', () => dialog.close());
  if (!dialog.open) {
    dialog.showModal();
    setScrollLock(true);
  }
  dialog.scrollTop = 0;
  dialog.querySelector<HTMLButtonElement>('[data-sheet-close]')?.focus();
}
