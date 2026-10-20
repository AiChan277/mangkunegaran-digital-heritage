/**
 * Locale registry: native names, scripts, fallbacks and translation status.
 * The status registry is the single source of truth for the About page
 * translation table and docs/TRANSLATION_STATUS.md.
 */
export const LOCALES = ["id", "jv", "en", "ms", "th", "vi", "fil", "km", "lo", "my", "tet", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Languages that have editorial content. Everything else falls back. */
export const CONTENT_LANGS = ["id", "en", "jv"] as const;
export type ContentLang = (typeof CONTENT_LANGS)[number];

export const DEFAULT_LOCALE: Locale = "id";

export const NAMESPACES = ["common", "home", "history", "architecture", "culture", "stories", "gallery", "visit", "about"] as const;
export type Namespace = (typeof NAMESPACES)[number];

export type Status = "source" | "ai-draft" | "missing";

export type LocaleInfo = {
  code: Locale;
  /** BCP 47 tag used in <html lang> and hreflang. */
  bcp47: string;
  nativeName: string;
  englishName: string;
  script: "Latn" | "Thai" | "Khmr" | "Laoo" | "Mymr";
  dir: "ltr" | "rtl";
  tier: 1 | 2 | 3;
  /** Short code shown as a badge in the language selector. */
  badge: string;
  /** Content language used when this locale has no editorial record. */
  contentFallback: ContentLang;
};

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  id: { code: "id", bcp47: "id", nativeName: "Bahasa Indonesia", englishName: "Indonesian", script: "Latn", dir: "ltr", tier: 1, badge: "ID", contentFallback: "id" },
  jv: { code: "jv", bcp47: "jv", nativeName: "Basa Jawa", englishName: "Javanese", script: "Latn", dir: "ltr", tier: 2, badge: "JV", contentFallback: "id" },
  en: { code: "en", bcp47: "en", nativeName: "English", englishName: "English", script: "Latn", dir: "ltr", tier: 1, badge: "EN", contentFallback: "en" },
  ms: { code: "ms", bcp47: "ms", nativeName: "Bahasa Melayu", englishName: "Malay", script: "Latn", dir: "ltr", tier: 3, badge: "MS", contentFallback: "en" },
  th: { code: "th", bcp47: "th", nativeName: "ไทย", englishName: "Thai", script: "Thai", dir: "ltr", tier: 3, badge: "TH", contentFallback: "en" },
  vi: { code: "vi", bcp47: "vi", nativeName: "Tiếng Việt", englishName: "Vietnamese", script: "Latn", dir: "ltr", tier: 3, badge: "VI", contentFallback: "en" },
  fil: { code: "fil", bcp47: "fil", nativeName: "Filipino", englishName: "Filipino", script: "Latn", dir: "ltr", tier: 3, badge: "FIL", contentFallback: "en" },
  km: { code: "km", bcp47: "km", nativeName: "ខ្មែរ", englishName: "Khmer", script: "Khmr", dir: "ltr", tier: 3, badge: "KM", contentFallback: "en" },
  lo: { code: "lo", bcp47: "lo", nativeName: "ລາວ", englishName: "Lao", script: "Laoo", dir: "ltr", tier: 3, badge: "LO", contentFallback: "en" },
  my: { code: "my", bcp47: "my", nativeName: "မြန်မာ", englishName: "Burmese", script: "Mymr", dir: "ltr", tier: 3, badge: "MY", contentFallback: "en" },
  tet: { code: "tet", bcp47: "tet", nativeName: "Tetun", englishName: "Tetum", script: "Latn", dir: "ltr", tier: 3, badge: "TET", contentFallback: "en" },
  es: { code: "es", bcp47: "es", nativeName: "Español", englishName: "Spanish", script: "Latn", dir: "ltr", tier: 3, badge: "ES", contentFallback: "en" },
};

/** Pages whose editorial content exists in Javanese (Tier 2). */
export const JV_CONTENT_PAGES = new Set(["home", "history"]);

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Which content language a page renders in for a given locale. */
export function contentLangFor(locale: Locale, page: string): ContentLang {
  if (locale === "id" || locale === "en") return locale;
  if (locale === "jv") return JV_CONTENT_PAGES.has(page) ? "jv" : "id";
  return LOCALE_INFO[locale].contentFallback;
}

/** UI-string status per locale × namespace. */
export function uiStatus(locale: Locale): Status {
  return locale === "id" || locale === "en" ? "source" : "ai-draft";
}

/** Editorial-content status per locale × page. */
export function contentStatus(locale: Locale, page: string): Status {
  if (locale === "id" || locale === "en") return "source";
  if (locale === "jv" && JV_CONTENT_PAGES.has(page)) return "ai-draft";
  return "missing";
}

/**
 * Map browser language tags to a supported locale.
 * tl → fil, ms-* → ms, jv-* → jv, zh / unknown → en.
 */
export function matchLocale(tags: readonly string[]): Locale | null {
  for (const raw of tags) {
    const tag = raw.toLowerCase();
    const base = tag.split("-")[0] ?? "";
    if (base === "tl" || base === "fil") return "fil";
    if (base === "in") return "id"; // legacy code for Indonesian
    if (isLocale(base)) return base;
  }
  return tags.length ? "en" : null;
}
