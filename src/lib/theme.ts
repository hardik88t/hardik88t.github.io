export type Theme = "light" | "dark";

const KEY = "hk-theme";

/** The theme currently shown: explicit choice first, then the OS preference, then dark. */
export function currentTheme(): Theme {
  try {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  } catch {
    // ignore: fall through to dark
  }
  return "dark";
}

/** Apply a theme and remember it for this browser. Storage can be blocked, so it is best-effort. */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // private mode or blocked storage: the choice simply lasts for this page view
  }
}
