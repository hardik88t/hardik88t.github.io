import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface FitFrameProps {
  /** Design size of the child, in css px. */
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
}

/** Scales a fixed-size mock to fit its box (contain), centred. Used on phones only. */
export function FitFrame({ w, h, className, children }: FitFrameProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const s = Math.min(el.clientWidth / w, el.clientHeight / h);
      if (s > 0) setScale(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);

  return (
    <div ref={box} className={`fit ${className ?? ''}`}>
      <div className="fit-inner" style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
