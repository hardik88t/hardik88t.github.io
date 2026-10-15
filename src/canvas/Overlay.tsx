import { useEffect, useRef, useSyncExternalStore } from 'react';
import '@fontsource-variable/instrument-sans';
import { DesktopCanvas } from './DesktopCanvas';
import { MobileGallery } from './MobileGallery';
import { trapTab } from './chrome';
import { UI } from './copy';
import './canvas.css';

const QUERY = '(min-width: 900px)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getDesktop = () => window.matchMedia(QUERY).matches;

export interface OverlayProps {
  /** Project slug to open on, or null for the first project. */
  target: string | null;
  /** Called for Escape and the Close control. The page script owns the history and focus handling. */
  onClose: () => void;
}

/**
 * The work overlay: the design canvas at 900 px and up, the swipe gallery below that.
 * Mounted only when the reader opens it (see mount.tsx), so the page never loads it.
 */
export function Overlay({ target, onClose }: OverlayProps) {
  const desktop = useSyncExternalStore(subscribe, getDesktop, () => true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') trapTab(e, rootRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div ref={rootRef} className="cv-overlay" role="dialog" aria-modal="true" aria-label={UI.dialogLabel} tabIndex={-1}>
      {desktop ? (
        <DesktopCanvas target={target} onClose={onClose} />
      ) : (
        <MobileGallery target={target} onClose={onClose} />
      )}
    </div>
  );
}
