// Shared canvas chrome: the wordmark, the Close link and the focus helpers. Everything here is
// styled with Monograph tokens (chrome.css), like the masthead of the page it opens from.
import { person } from '../lib/content';
import { UI } from './copy';

export function Brand() {
  return (
    <p className="cv-brand">
      <span className="cv-monogram" aria-hidden="true">
        {person.monogram}
      </span>
      <span className="cv-brand-name">{person.name}</span>
    </p>
  );
}

interface CloseButtonProps {
  onClose: () => void;
  autoFocus?: boolean;
}

/** "Close" as a text link with a cross on the right. The page script returns focus to the link that opened the overlay. */
export function CloseButton({ onClose, autoFocus = false }: CloseButtonProps) {
  return (
    <button type="button" className="cv-close" onClick={onClose} autoFocus={autoFocus}>
      {UI.close}
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
      </svg>
    </button>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab and Shift+Tab inside the dialog. Inert subtrees (the hidden gallery) are skipped. */
export function trapTab(event: KeyboardEvent, root: HTMLElement | null) {
  if (!root) return;
  const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.closest('[inert]') && el.getClientRects().length > 0,
  );
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  const active = document.activeElement;
  const inside = active instanceof Node && root.contains(active);
  // The dialog itself counts as the start: Shift+Tab from it wraps to the last control.
  if (event.shiftKey && (active === first || active === root || !inside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !inside)) {
    event.preventDefault();
    first.focus();
  }
}
