import type { ReactNode } from 'react';
import { Icon } from '../shared/icons';
import s from './NetWatch.module.css';

/** Android device shell: slim bezel, punch-hole camera, status bar and gesture bar. Screen is 352 x 760. */
function Device({ children }: { children: ReactNode }) {
  return (
    <div className={s.device}>
      <div className={s.screen}>
        <div className={s.status} aria-hidden="true">
          <span>13:20</span>
          <span className={s.sys}>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
              <path d="M7 11.2 0.6 4.6a9 9 0 0 1 12.8 0z" />
            </svg>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
              <rect x="0" y="7.5" width="2.6" height="4.5" rx="0.6" />
              <rect x="3.8" y="5" width="2.6" height="7" rx="0.6" />
              <rect x="7.6" y="2.5" width="2.6" height="9.5" rx="0.6" />
              <rect x="11.4" y="0" width="2.6" height="12" rx="0.6" />
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.45" />
              <rect x="2" y="2" width="13.5" height="7" rx="1.2" fill="currentColor" />
              <path d="M20 3.6v3.8" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className={s.punch} aria-hidden="true" />
        {children}
        <div className={s.gesture} aria-hidden="true" />
      </div>
    </div>
  );
}

function TimelineScreen() {
  return (
    <div className={s.page}>
      <div className={s.appbar}>
        <p className={s.appTitle}>Connection</p>
        <span className={s.iconBtn}>
          <Icon name="calendar" size={20} strokeWidth={1.7} />
        </span>
        <span className={s.iconBtn}>
          <Icon name="more" size={20} strokeWidth={1.7} />
        </span>
      </div>
      <p className={s.sub}>Last 24 hours · 2 drops · Monitoring on</p>

      <div className={s.stats}>
        <div className={s.stat}>
          <b>2</b>
          <span>Drops</span>
        </div>
        <div className={s.stat}>
          <b>50 s</b>
          <span>Drop time</span>
        </div>
        <div className={s.stat}>
          <b>1</b>
          <span>Slow period</span>
        </div>
      </div>

      <div className={s.chips}>
        <span className={s.chipOn}>Last 24 h</span>
        <span className={s.chip}>7 days</span>
        <span className={s.chip}>Drops only</span>
      </div>

      <ol className={s.timeline}>
        <li className={s.ok}>
          <time>08:02</time>
          <div>
            <p className={s.evTitle}>Connected</p>
            <p className={s.evMeta}>84 Mbps down · 18 ms</p>
          </div>
        </li>
        <li className={s.drop}>
          <time>08:14</time>
          <div>
            <p className={s.evTitle}>Drop · 38 s</p>
            <p className={s.evMeta}>No response from the router</p>
          </div>
        </li>
        <li className={s.slow}>
          <time>09:40</time>
          <div>
            <p className={s.evTitle}>Slow · 1.2 Mbps</p>
            <p className={s.evMeta}>Pages took over 20 s to load</p>
          </div>
        </li>
        <li className={s.drop}>
          <time>11:05</time>
          <div>
            <p className={s.evTitle}>Drop · 12 s</p>
            <p className={s.evMeta}>Reconnected on the same network</p>
          </div>
        </li>
        <li className={s.ok}>
          <time>13:20</time>
          <div>
            <p className={s.evTitle}>Stable again</p>
            <p className={s.evMeta}>No drops in the last 2 h 15 min</p>
          </div>
        </li>
      </ol>

      <div className={s.fab}>
        <Icon name="download" size={18} strokeWidth={2} />
        Export
      </div>

      <nav className={s.navbar} aria-hidden="true">
        <span className={s.navOn}>
          <Icon name="route" size={18} strokeWidth={1.8} />
          Timeline
        </span>
        <span>
          <Icon name="file" size={18} strokeWidth={1.8} />
          Reports
        </span>
        <span>
          <Icon name="settings" size={18} strokeWidth={1.8} />
          Settings
        </span>
      </nav>
    </div>
  );
}

function ReportScreen() {
  return (
    <div className={s.page}>
      <div className={s.appbar}>
        <span className={s.iconBtn}>
          <Icon name="chevron-left" size={20} strokeWidth={1.7} />
        </span>
        <p className={s.appTitle}>Export report</p>
      </div>

      <div className={s.card}>
        <p className={s.kicker}>Connection report</p>
        <p className={s.big}>14 Oct 2026</p>
        <p className={s.meta}>00:00 to 14:00 · 2 drops · 1 slow period</p>

        <div className={s.strip} role="presentation">
          <i className={s.mDrop} style={{ left: '59%' }} />
          <i className={s.mSlow} style={{ left: '69%' }} />
          <i className={s.mDrop} style={{ left: '79%' }} />
        </div>
        <div className={s.scale}>
          <span>00:00</span>
          <span>07:00</span>
          <span>14:00</span>
        </div>
      </div>

      <p className={s.label}>Include</p>
      <div className={s.rows}>
        <div className={s.row}>
          <span>Drops and duration</span>
          <span className={s.switchOn} />
        </div>
        <div className={s.row}>
          <span>Slow periods</span>
          <span className={s.switchOn} />
        </div>
        <div className={s.row}>
          <span>Speed samples</span>
          <span className={s.switchOff} />
        </div>
        <div className={s.row}>
          <span>Network name</span>
          <span className={s.switchOn} />
        </div>
      </div>

      <p className={s.label}>Format</p>
      <div className={s.seg}>
        <span className={s.segOn}>PDF</span>
        <span>CSV</span>
      </div>

      <div className={s.actions}>
        <span className={s.btnGhost}>Save</span>
        <span className={s.btnPrimary}>
          <Icon name="send" size={16} strokeWidth={2} />
          Share report
        </span>
      </div>
    </div>
  );
}

export function NetWatch() {
  return (
    <div className={s.root} aria-hidden="true">
      <Device>
        <TimelineScreen />
      </Device>
      <Device>
        <ReportScreen />
      </Device>
    </div>
  );
}
