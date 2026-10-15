import { useEffect, useRef } from 'react';
import { FRAME_VIEW, UI } from '../frames/copy';
import type { FrameSpec } from '../frames/layout';
import { MOCKS } from '../mocks';
import { Icon } from '../shared/icons';

interface ViewerProps {
  frame: FrameSpec;
  onClose: () => void;
}

/**
 * Full-screen mock at its design size. Pinch zoom is disabled (touch-action), the screen scrolls
 * in both directions, and Escape or the close button return to the page.
 */
export function Viewer({ frame, onClose }: ViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { name, view } = FRAME_VIEW[frame.id];
  const Mock = MOCKS[frame.id];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  // Start centred so the middle of a wide composition is visible first.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollLeft = Math.max(0, (body.scrollWidth - body.clientWidth) / 2);
  }, []);

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`${name}, ${view}`}>
      <div className="viewer-bar">
        <p>
          <strong>{name}</strong> <span>/ {view}</span>
        </p>
        <button ref={closeRef} type="button" className="btn viewer-close" onClick={onClose}>
          <Icon name="close" size={16} />
          {UI.viewerClose}
        </button>
      </div>
      <p className="viewer-hint">{UI.viewerHint}</p>
      <div className="viewer-body" ref={bodyRef}>
        <div className="viewer-stage" style={{ width: frame.w, height: frame.h }}>
          {Mock ? <Mock /> : null}
        </div>
      </div>
    </div>
  );
}
