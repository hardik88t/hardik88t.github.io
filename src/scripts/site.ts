// Progressive enhancement only. The page is complete without this script: the nav, the work
// rows and the contact details all work with plain HTML and CSS.

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
      // Legacy path for older browsers. Typed locally so the deprecated DOM signature is not referenced.
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
    // Copying an address never implies that a message was sent; the status says only what happened.
    status.textContent = ok
      ? 'Email address copied.'
      : 'Copy failed. Select the address above and copy it by hand.';
  });
}

initTheme();
initCopy();
