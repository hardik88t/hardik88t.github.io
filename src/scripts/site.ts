// Progressive enhancement that needs no animation library: theme toggle, copy email, and the
// case-study stage state (Challenge, Approach, Outcome) driven by the reader's scroll position.
// The page is complete without this file. Storage may be blocked, so every access is wrapped.

type Theme = 'light' | 'dark';
const THEME_KEY = 'theme';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' || attr === 'dark' ? attr : systemTheme();
}

function initTheme(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;

  const sync = (): void => {
    button.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  };
  sync();

  button.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    sync();
  });
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context or permission denied): try the legacy path.
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      // Typed locally so the deprecated DOM signature is not referenced directly.
      const ok = (document as unknown as { execCommand(commandId: string): boolean }).execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function initCopy(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-copy]');
  const status = document.querySelector<HTMLElement>('[data-copy-status]');
  if (!button || !status) return;

  button.addEventListener('click', async () => {
    const ok = await copyText(button.dataset.copy ?? '');
    // Never say a message was sent: this only reports the clipboard.
    status.textContent = ok
      ? 'Email address copied to your clipboard.'
      : 'Copy failed. Select the address above and copy it by hand.';
  });
}

/**
 * Desktop case studies: in each card, the stage follows the step whose centre is nearest the middle of
 * the viewport. (A band observer is not enough here: steps are short, so two can sit in one band.)
 * Throttled to one update per frame. Phones ignore the attribute (CSS only applies it on desktop).
 */
function initStages(): void {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-case]')];
  if (!cards.length) return;

  let queued = false;
  const update = (): void => {
    queued = false;
    const middle = window.innerHeight / 2;
    for (const card of cards) {
      let best: HTMLElement | null = null;
      let bestDistance = Infinity;
      card.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
        const rect = step.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const distance = Math.abs((rect.top + rect.bottom) / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = step;
        }
      });
      const state = (best as HTMLElement | null)?.dataset.step;
      if (state) card.dataset.state = state;
    }
  };
  const schedule = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

initTheme();
initCopy();
initStages();
