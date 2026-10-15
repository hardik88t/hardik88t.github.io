// Entry point for the lazily loaded overlay. src/scripts/canvas.ts imports this module on the
// first open, so React and the canvas code are not part of the home page's initial load.
import { createRoot } from 'react-dom/client';
import { Overlay, type OverlayProps } from './Overlay';

export interface OverlayHandle {
  update(props: OverlayProps): void;
  unmount(): void;
}

export function mountOverlay(el: HTMLElement, props: OverlayProps): OverlayHandle {
  const root = createRoot(el);
  const render = (next: OverlayProps) => root.render(<Overlay {...next} />);
  render(props);
  return {
    update: render,
    unmount: () => root.unmount(),
  };
}
