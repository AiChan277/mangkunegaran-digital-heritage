import { LOCALES, LOCALE_INFO } from "../src/i18n/config";
import { ARTICLE_SLUGS } from "../src/content/articles/slugs";

export const PAGES = ["", "history", "architecture", "culture", "stories", "gallery", "visit", "about", ...ARTICLE_SLUGS.map((s) => `stories/${s}`)];

export const ALL = LOCALES.flatMap((locale) =>
  PAGES.map((page) => ({ locale, page, url: page ? `/${locale}/${page}` : `/${locale}`, lang: LOCALE_INFO[locale].bcp47 })),
);

export { LOCALES, LOCALE_INFO };
