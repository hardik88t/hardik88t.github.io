// Availability line: a computed season, so it never goes stale.
// auto: "Taking on new projects for {early|mid|late} {YYYY}", where the date is today + leadWeeks.
// Jan-Apr = early, May-Aug = mid, Sep-Dec = late. fixed shows fixedText. booked shows a fixed line.
export interface Availability {
  mode: string;
  leadWeeks: number;
  fixedText?: string;
}

export function availabilityText(a: Availability, now: Date = new Date()): string {
  if (a.mode === 'booked') return 'Fully booked right now. Say hello anyway.';
  if (a.mode === 'fixed') return a.fixedText ?? '';
  const target = new Date(now.getTime() + a.leadWeeks * 7 * 24 * 3600 * 1000);
  const m = target.getMonth();
  const season = m <= 3 ? 'early' : m <= 7 ? 'mid' : 'late';
  return `Taking on new projects for ${season} ${target.getFullYear()}`;
}
