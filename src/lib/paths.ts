import { DEFAULT_LOCALE, isLocale, type Locale } from "~/i18n/config";

/** Build a locale-prefixed path: localePath("en", "history") → "/en/history". */
export function localePath(locale: Locale, rest = ""): string {
  const clean = rest.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** Swap the locale segment of a pathname, keeping the rest of the path. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts.shift();
  return localePath(next, parts.join("/"));
}

/** Path without its locale prefix ("" for a locale home). */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts.shift();
  return parts.join("/");
}

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}
