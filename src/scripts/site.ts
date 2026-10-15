// The only client script. Each part is an enhancement: the page reads fine without it.
// Views (title, focus, scroll-to-top, hidden), theme toggle, copy email, native dialogs, the contact sheet arrows.


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

// Views. One view is on screen at a time. The hash names it; anything that is not a view is an anchor
// inside home (for example #contact), so home stays up and scrolls to it.
const views = Array.from(document.querySelectorAll<HTMLElement>('.view'));
let lastTarget = '';

function resolveTarget(): { target: string; anchor: HTMLElement | null } {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return { target: 'home', anchor: null };
  const el = document.getElementById(id);
  if (el && el.classList.contains('view')) return { target: id, anchor: null };
  if (el) return { target: 'home', anchor: el };
  return { target: 'home', anchor: null };
}

function applyView(initial: boolean): void {
  const { target, anchor } = resolveTarget();
  views.forEach((v) => {
    v.hidden = v.id !== target;
  });
  const view = views.find((v) => v.id === target);
  if (view?.dataset.title) document.title = view.dataset.title;
  if (!initial && target !== lastTarget) {
    window.scrollTo({ top: 0 });
    if (target !== 'home') {
      view?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    }
  }
  if (anchor && !initial) anchor.scrollIntoView({ block: 'start' });
  lastTarget = target;
  // The pinboard script loads only when #work is shown on a desktop-width screen.
  if (target === 'work' && window.matchMedia('(min-width: 900px)').matches) {
    void import('./pinboard').then((m) => m.mountPinboard());
  }
}
applyView(true);
window.addEventListener('hashchange', () => applyView(false));

// Contact sheet arrows: a convenience. Native sideways scrolling and swiping work without them.
document.querySelectorAll<HTMLButtonElement>('[data-sheet-step]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const sheet = document.querySelector<HTMLElement>('[data-sheet]');
    if (!sheet) return;
    const step = Number(btn.dataset.sheetStep) || 1;
    const frame = sheet.querySelector<HTMLElement>('.frame');
    const dist = (frame?.offsetWidth ?? 280) + 28;
    sheet.scrollBy({ left: step * dist, behavior: 'auto' });
  });
});

// Screen links open the true-colour proof in the lightbox. The lightbox code loads on the first click.
// Without JS (or with a modifier key), the link is a normal link to the proof file.
document.addEventListener('click', (e) => {
  const a = (e.target as Element | null)?.closest?.('a[data-proof]') as HTMLAnchorElement | null;
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  void import('./proof').then((m) => m.openProof(a));
});

// Availability lines (hero and about) follow a rule: the season of today plus the lead time, so they never go stale.
document.querySelectorAll<HTMLElement>('[data-avail]').forEach((el) => {
  if (el.dataset.mode !== 'auto') return;
  const lead = parseFloat(el.dataset.lead ?? '') || 6;
  const t = new Date(Date.now() + lead * 7 * 864e5);
  const m = t.getMonth();
  const season = m < 4 ? 'early' : m < 8 ? 'mid' : 'late';
  const text = `Taking on new projects for ${season} ${t.getFullYear()}`;
  if (el.textContent !== text) el.textContent = text;
});

// Pencil marks draw once, the first time they reach the viewport. Reduced motion and no-JS show them drawn.
const drawn = document.querySelectorAll<SVGElement>('.draw');
if (drawn.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-drawn');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.35 });
  drawn.forEach((el) => io.observe(el));
} else {
  drawn.forEach((el) => el.classList.add('is-drawn'));
}
