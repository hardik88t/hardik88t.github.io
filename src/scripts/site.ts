// The only client script. Each part is an enhancement: the page reads fine without it.
// Theme toggle, copy email, dialogs, and switching between the portfolio and #system.

const root = document.documentElement;
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const THEME_KEY = 'pi-theme';

// localStorage can throw (private windows, blocked storage). Never let that break the page.
function readTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}
function saveTheme(value: string): void {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    /* per-viewer convenience only */
  }
}

function effectiveTheme(): 'light' | 'dark' {
  const forced = root.dataset.theme;
  if (forced === 'light' || forced === 'dark') return forced;
  return systemDark.matches ? 'dark' : 'light';
}

// Theme toggle: label and aria-label always name the theme the button will switch to.
function syncThemeButtons(): void {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', `Switch to ${next} theme`);
    const label = btn.querySelector('[data-theme-label]');
    if (label) label.textContent = next === 'dark' ? 'Dark' : 'Light';
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    saveTheme(next);
    syncThemeButtons();
  });
});
const stored = readTheme();
if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;
systemDark.addEventListener('change', syncThemeButtons);
syncThemeButtons();

// Copy email: clipboard first, then select the address so the visitor can press Ctrl or Cmd + C.
const copyBtn = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
const emailEl = document.querySelector<HTMLElement>('[data-email]');
copyBtn?.addEventListener('click', async () => {
  const email = copyBtn.dataset.copyEmail ?? '';
  let copied = false;
  try {
    await navigator.clipboard.writeText(email);
    copied = true;
  } catch {
    copied = false;
  }
  if (!copied && emailEl) {
    const range = document.createRange();
    range.selectNodeContents(emailEl);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
  if (copyStatus) {
    copyStatus.textContent = copied
      ? 'Email address copied to the clipboard.'
      : 'The address is selected. Press Ctrl or Cmd + C to copy it.';
  }
  copyBtn.textContent = copied ? 'Copied' : 'Copy email';
});

// Dialogs: native <dialog>, opened by a button, closed by its Close button or a click on the backdrop.
// Focus goes back to the button that opened it.
const openerFor = new WeakMap<HTMLDialogElement, HTMLElement>();
document.querySelectorAll<HTMLButtonElement>('[data-open-dialog]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.openDialog ?? '');
    if (dlg instanceof HTMLDialogElement && typeof dlg.showModal === 'function') {
      openerFor.set(dlg, btn);
      dlg.showModal();
    }
  });
});
document.querySelectorAll<HTMLDialogElement>('dialog.dialog').forEach((dlg) => {
  dlg.querySelectorAll<HTMLButtonElement>('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener('close', () => {
    openerFor.get(dlg)?.focus({ preventScroll: true });
  });
});

// Portfolio <-> system view. #system shows the system page; anything else shows the portfolio.
function applyView(): void {
  const hash = location.hash;
  const onSystem = hash === '#system';
  root.dataset.view = onSystem ? 'system' : 'portfolio';
  if (onSystem) {
    window.scrollTo({ top: 0 });
    document.getElementById('system-title')?.focus({ preventScroll: true });
    return;
  }
  const id = decodeURIComponent(hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView({ block: 'start' });
  else window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', applyView);
if (location.hash === '#system') applyView();
