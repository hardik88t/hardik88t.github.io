import type { CSSProperties, ReactNode } from 'react';
import s from './Phone.module.css';

interface PhoneProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  screenClassName?: string;
}

/** Device shell: bezel, status bar, Dynamic Island and home indicator. Screen is 364 x 780. */
export function Phone({ children, className, style, screenClassName }: PhoneProps) {
  return (
    <div className={`${s.phone} ${className ?? ''}`} style={style}>
      <div className={`${s.screen} ${screenClassName ?? ''}`}>
        <div className={s.status} aria-hidden="true">
          <span>9:41</span>
          <span className={s.sys}>
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="7" width="3" height="4" rx="1" />
              <rect x="4.6" y="5" width="3" height="6" rx="1" />
              <rect x="9.2" y="2.5" width="3" height="8.5" rx="1" />
              <rect x="13.8" y="0" width="3" height="11" rx="1" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M1 3.8a9.4 9.4 0 0 1 13 0" />
              <path d="M3.4 6.4a5.8 5.8 0 0 1 8.2 0" />
              <circle cx="7.5" cy="9.2" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="currentColor" strokeOpacity="0.4" />
              <rect x="2.2" y="2.2" width="16.5" height="7.6" rx="1.8" fill="currentColor" />
              <path d="M23 4v4" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className={s.island} aria-hidden="true" />
        {children}
        <div className={s.home} aria-hidden="true" />
      </div>
    </div>
  );
}
