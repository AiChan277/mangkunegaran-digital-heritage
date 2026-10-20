import { useLocation } from "react-router";
import { LOCALE_INFO, type Locale } from "./config";
import { localeFromPath } from "~/lib/paths";

/** Active locale, taken from the first URL segment (falls back to "id"). */
export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname);
}

export function useLocaleInfo() {
  return LOCALE_INFO[useLocale()];
}
