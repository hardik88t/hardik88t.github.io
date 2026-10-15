// The same mock component the canvas uses, rendered once at build time (no client directive).
// Shown in the empty band of a work row on desktop hover. Its size comes from --pv-s (site.css),
// so the preview scales with the band without any script. Decorative.
import { MOCKS } from '../mocks';
import { frameSize } from '../canvas/layout';

export function ProjectPreview({ slug }: { slug: string }) {
  const Mock = MOCKS[slug];
  if (!Mock) return null;
  const { w, h } = frameSize(slug);
  return (
    <div
      className="pv"
      style={{ width: `calc(${w}px * var(--pv-s) + 2px)`, height: `calc(${h}px * var(--pv-s) + 2px)` }}
      aria-hidden="true"
    >
      <div className="pv-inner" style={{ width: w, height: h, transform: 'scale(var(--pv-s))' }}>
        <Mock />
      </div>
    </div>
  );
}
