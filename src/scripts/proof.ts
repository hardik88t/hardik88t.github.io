// The proof lightbox. Loaded the first time someone opens a screen (site.ts imports it on click).
// A group is every screen link with the same data-proof-set, in data-proof-index order. Arrow keys move
// within the group, Escape closes (native dialog), and focus returns to the screen that opened it.

let dlg: HTMLDialogElement | null = null;
let group: HTMLAnchorElement[] = [];
let index = 0;
let opener: HTMLElement | null = null;
let bound = false;

const $ = <T extends HTMLElement>(sel: string) => dlg?.querySelector<T>(sel) ?? null;

function show(): void {
  const link = group[index];
  const img = $<HTMLImageElement>('#proof-img');
  if (!link || !img || !dlg) return;
  const label = link.dataset.proofAlt ?? '';
  img.src = link.href;
  img.alt = label;
  const title = $('#proof-title');
  if (title) title.textContent = label;
  const count = $('#proof-count');
  if (count) count.textContent = `${index + 1} of ${group.length}`;
  const prev = $<HTMLButtonElement>('[data-proof-prev]');
  const next = $<HTMLButtonElement>('[data-proof-next]');
  if (prev) prev.disabled = index === 0;
  if (next) next.disabled = index === group.length - 1;
}

function step(delta: number): void {
  const target = index + delta;
  if (target < 0 || target >= group.length) return;
  index = target;
  show();
}

function bind(): void {
  const d = dlg;
  if (bound || !d) return;
  bound = true;
  $('[data-proof-close]')?.addEventListener('click', () => d.close());
  $('[data-proof-prev]')?.addEventListener('click', () => step(-1));
  $('[data-proof-next]')?.addEventListener('click', () => step(1));
  d.addEventListener('click', (e) => {
    if (e.target === d) d.close();
  });
  d.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  });
  d.addEventListener('close', () => {
    opener?.focus({ preventScroll: true });
    opener = null;
  });
}

export function openProof(link: HTMLAnchorElement): void {
  dlg = document.getElementById('proof-dialog') as HTMLDialogElement | null;
  if (!dlg || typeof dlg.showModal !== 'function') {
    window.location.href = link.href;
    return;
  }
  const set = link.dataset.proofSet ?? '';
  group = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-proof]'))
    .filter((a) => (a.dataset.proofSet ?? '') === set)
    .sort((a, b) => Number(a.dataset.proofIndex ?? 0) - Number(b.dataset.proofIndex ?? 0));
  index = Math.max(0, group.indexOf(link));
  opener = link;
  bind();
  show();
  dlg.showModal();
  $<HTMLButtonElement>('[data-proof-close]')?.focus({ preventScroll: true });
}
