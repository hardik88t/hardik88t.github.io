// Shared canvas chrome: the page wordmark, the Close control and the focus helpers.
import { headingAxes, variant } from '../lib/seed';
import { UI } from './copy';

/**
 * The site wordmark, as in the page header: the same markup as src/components/Wordmark.astro (React cannot
 * import Astro components), the same classes and the same build-time seeds, so the two match.
 */
export function Wordmark() {
  const flick = ['a', 'b', 'c'][variant('header-flick', 3)] ?? 'a';
  return (
    <p className="header__name cv-wordmark" style={{ fontVariationSettings: headingAxes('header-name') }}>
      <span className="name-mark">
        Hardik Th<span className="nudge">a</span>nth
        <svg
          className="name-mark__flick mark"
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          style={{ mixBlendMode: 'multiply' }}
        >
          <use href={`#m-underline-${flick}`} />
        </svg>
      </span>
    </p>
  );
}

interface CloseButtonProps {
  onClose: () => void;
  autoFocus?: boolean;
}

/** "Close" with a cross. The page script returns focus to the element that opened the overlay. */
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
