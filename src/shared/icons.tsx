// Small stroke icons, 24 unit grid, drawn with currentColor.
const PATHS: Record<string, string[]> = {
  plus: ['M12 5.5v13', 'M5.5 12h13'],
  minus: ['M5.5 12h13'],
  close: ['M6.5 6.5l11 11', 'M17.5 6.5l-11 11'],
  check: ['M5 12.6l4.3 4.2L19 7.6'],
  arrow: ['M5.5 12h13', 'M13 6.5l5.5 5.5-5.5 5.5'],
  'arrow-up-right': ['M7 17L17 7', 'M9 7h8v8'],
  'chevron-right': ['M9.5 6.5l5.5 5.5-5.5 5.5'],
  'chevron-left': ['M14.5 6.5L9 12l5.5 5.5'],
  'chevron-down': ['M6.5 9.5l5.5 5.5 5.5-5.5'],
  search: ['M10.8 17.2a6.4 6.4 0 1 0 0-12.8 6.4 6.4 0 0 0 0 12.8z', 'M15.6 15.6l4.4 4.4'],
  grid: ['M4.5 4.5h6v6h-6z', 'M13.5 4.5h6v6h-6z', 'M4.5 13.5h6v6h-6z', 'M13.5 13.5h6v6h-6z'],
  box: ['M12 3.5l7.5 4v9L12 20.5l-7.5-4v-9z', 'M4.5 7.5L12 11.5l7.5-4', 'M12 11.5v9'],
  users: ['M9.5 11a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z', 'M3.5 19.5c.7-2.9 3-4.5 6-4.5s5.3 1.6 6 4.5', 'M16 5.6a3 3 0 0 1 0 5.8', 'M17.2 14.2c2.2.5 3.4 2.2 3.8 5.3'],
  layers: ['M12 4l8 4-8 4-8-4 8-4z', 'M4 12.2l8 4 8-4', 'M4 16.2l8 4 8-4'],
  file: ['M7 3.5h7l4 4v13H7z', 'M14 3.5v4h4', 'M9.5 12.5h5', 'M9.5 16h5'],
  receipt: ['M6.5 3.5h11v17l-2.2-1.4-2.2 1.4-2.2-1.4-2.2 1.4-2.2-1.4z', 'M9.5 8.5h5', 'M9.5 12h5', 'M9.5 15.5h3'],
  pin: ['M12 20.5s-6.3-5.5-6.3-10.6a6.3 6.3 0 0 1 12.6 0c0 5.1-6.3 10.6-6.3 10.6z', 'M12 12a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2z'],
  clock: ['M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z', 'M12 7.5V12l3 2'],
  bag: ['M5.5 8.5h13l-1 11.5h-11z', 'M9 8.5V7a3 3 0 0 1 6 0v1.5'],
  bell: ['M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z', 'M10 20.5a2 2 0 0 0 4 0'],
  sliders: ['M4 7.5h9', 'M17 7.5h3', 'M4 16.5h3', 'M11 16.5h9', 'M15 5.5v4', 'M7 14.5v4'],
  download: ['M12 4.5v11', 'M7.5 11l4.5 4.5 4.5-4.5', 'M5 19.5h14'],
  send: ['M4 11.6l16-7.4-5.4 16-3-6.4z'],
  mail: ['M4 6.5h16v11H4z', 'M4 7l8 6 8-6'],
  sparkle: ['M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2-5.2-1.8 5.2-1.8z'],
  link: ['M10 14a3.8 3.8 0 0 0 5.4 0l3-3a3.8 3.8 0 0 0-5.4-5.4l-1 1', 'M14 10a3.8 3.8 0 0 0-5.4 0l-3 3a3.8 3.8 0 0 0 5.4 5.4l1-1'],
  edit: ['M4.5 19.5l4-1 10-10-3-3-10 10z', 'M13.5 7.5l3 3'],
  phone: ['M7.5 3.5h9v17h-9z', 'M11 17.5h2'],
  'check-circle': ['M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z', 'M8.3 12.4l2.5 2.5 5-5.2'],
  alert: ['M12 4.5l8.5 15h-17z', 'M12 10v4.2', 'M12 16.8v.2'],
  calendar: ['M4.5 6h15v13.5h-15z', 'M4.5 10.5h15', 'M8.5 3.5v4', 'M15.5 3.5v4'],
  route: ['M6 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M18 22.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M8 5.5h6a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h6'],
  home: ['M4.5 11L12 4.5l7.5 6.5', 'M6.5 10v9.5h11V10'],
  settings: ['M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z', 'M12 3.5v2.3', 'M12 18.2v2.3', 'M3.5 12h2.3', 'M18.2 12h2.3', 'M6 6l1.6 1.6', 'M16.4 16.4L18 18', 'M6 18l1.6-1.6', 'M16.4 7.6L18 6'],
  star: ['M12 4.5l2.3 4.8 5.2.7-3.8 3.6 1 5.2L12 16.2l-4.7 2.6 1-5.2-3.8-3.6 5.2-.7z'],
  more: [],
  trash: ['M5.5 7.5h13', 'M9.5 7.5V5h5v2.5', 'M7 7.5l.8 12h8.4l.8-12'],
  image: ['M4.5 5.5h15v13h-15z', 'M4.5 15.5l4.5-4.5 3.5 3.5 2.5-2.5 4.5 4', 'M15 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
  external: ['M9.5 6.5h-3v11h11v-3', 'M13 5.5h6v6', 'M19 5.5l-8 8'],
};

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ name, size = 16, strokeWidth = 1.8, className }: IconProps) {
  const d = PATHS[name] ?? [];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
      {name === 'more' ? (
        <>
          <circle cx="6" cy="12" r="1.3" fill="currentColor" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
          <circle cx="18" cy="12" r="1.3" fill="currentColor" />
        </>
      ) : null}
    </svg>
  );
}
