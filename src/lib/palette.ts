// One source for every colour token. The CSS custom properties and the contrast table
// on the system page both read from here, so they cannot drift apart.

export interface Theme {
  paper: string;
  card: string;
  ink: string;
  ink2: string;
  rule: string;
  blue: string;
  pink: string;
  yellow: string;
  gold: string;
  onYellow: string;
  onPink: string;
  pinkInk: string;
  highlight: string;
  teal: string;
  orange: string;
}

/** Riso inks on cool paper. */
export const light: Theme = {
  paper: '#F6F6F3',
  card: '#FFFFFF',
  ink: '#18181C',
  ink2: '#55565E',
  rule: '#D9D9D2',
  blue: '#0070B5',
  pink: '#FF48B0',
  yellow: '#FFE800',
  gold: '#C9A227',
  onYellow: '#18181C',
  onPink: '#18181C',
  pinkInk: '#D1008A',
  highlight: '#FFE800',
  teal: '#00A99D',
  orange: '#FF6C2F',
};

/** "Night print": the same inks, lit from the other side. */
export const dark: Theme = {
  paper: '#141519',
  card: '#1B1C21',
  ink: '#EDEDE6',
  ink2: '#A6A7AE',
  rule: '#2C2D33',
  blue: '#5DB8F2',
  pink: '#FF6FC2',
  yellow: '#FFE800',
  gold: '#D8B44A',
  onYellow: '#141519',
  onPink: '#141519',
  pinkInk: '#FF6FC2',
  highlight: '#E6D84A',
  teal: '#2FD3C4',
  orange: '#FF8A57',
};

const kebab = (s: string) => s.replace(/[A-Z0-9]/g, (c) => `-${c.toLowerCase()}`);

function vars(t: Theme): string {
  return Object.entries(t)
    .map(([k, v]) => `--${kebab(k)}:${v};`)
    .join('');
}

/** Theme tokens plus the imperfection tokens. Light by default, dark via prefers or data-theme. */
export function themeCss(): string {
  return [
    `:root{${vars(light)}color-scheme:light;`,
    `--f-display:"Fraunces","Iowan Old Style","Palatino Linotype",Georgia,serif;`,
    `--f-text:"Recursive","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;`,
    `--tilt-xs:0.35deg;--tilt-sm:0.8deg;--tilt-md:1.6deg;`,
    `--nudge-xs:1px;--nudge-sm:3px;--nudge-md:7px;`,
    `--misreg:1.5px;--grain:0.06;--ink-bleed:0.6px;`,
    `--focus:var(--blue);}`,
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(dark)}color-scheme:dark;}}`,
    `:root[data-theme="dark"]{${vars(dark)}color-scheme:dark;}`,
    `:root[data-theme="light"]{color-scheme:light;}`,
  ].join('');
}
