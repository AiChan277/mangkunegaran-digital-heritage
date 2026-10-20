/** localStorage access that never throws (private mode, blocked storage). */
const KEY = "mn-locale";

export function readSavedLocale(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveLocale(locale: string): void {
  try {
    window.localStorage.setItem(KEY, locale);
  } catch {
    /* storage unavailable: preference simply isn't remembered */
  }
}
