import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface FitFrameProps {
  /** Design size of the child, in css px. */
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
}

/** Scales a fixed-size mock to the width of its box, centred. The box keeps the design aspect ratio. */
export function FitFrame({ w, h, className, children }: FitFrameProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const s = el.clientWidth / w;
      if (s > 0) setScale(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={box} className={`cv-fit ${className ?? ''}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <div
        className="cv-fit-inner"
        style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
