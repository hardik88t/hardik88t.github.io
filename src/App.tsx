import { useSyncExternalStore } from 'react';
import { DesktopCanvas } from './canvas/DesktopCanvas';
import { MobileView } from './mobile/MobileView';

const QUERY = '(min-width: 900px)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

/** Desktop and tablet (>= 900px) get the pannable canvas. Phones get the short page. */
export function App() {
  const desktop = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return desktop ? <DesktopCanvas /> : <MobileView />;
}
