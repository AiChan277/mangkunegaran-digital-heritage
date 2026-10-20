/**
 * Per-page <head> metadata: title, description, canonical, hreflang,
 * Open Graph / Twitter and JSON-LD. Built inside loaders so it is
 * prerendered into every HTML file.
 */
import type { MetaDescriptor } from "react-router";
import { LOCALES, LOCALE_INFO, type Locale } from "~/i18n/config";
import { absoluteUrl, site } from "~/site";
import { localePath } from "./paths";

const OG_LOCALE: Partial<Record<Locale, string>> = {
  id: "id_ID",
  en: "en_GB",
  jv: "jv_ID",
  ms: "ms_MY",
  th: "th_TH",
  vi: "vi_VN",
  fil: "fil_PH",
  km: "km_KH",
  lo: "lo_LA",
  my: "my_MM",
  es: "es_ES",
};

export type PageMetaInput = {
  locale: Locale;
  /** Path after the locale, e.g. "history" or "stories/panembrama". */
  path: string;
  title: string;
  siteTitle: string;
  description: string;
  ogImage?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
};

export function buildMeta(input: PageMetaInput): MetaDescriptor[] {
  const { locale, path, title, siteTitle, description, ogImage = "default", type = "website", jsonLd } = input;
  const fullTitle = path ? `${title} — ${siteTitle}` : siteTitle;
  const pathname = localePath(locale, path);
  const canonical = absoluteUrl(pathname);
  const tags: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:site_name", content: siteTitle },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  const ogLocale = OG_LOCALE[locale];
  if (ogLocale) tags.push({ property: "og:locale", content: ogLocale });

  if (canonical) {
    tags.push({ tagName: "link", rel: "canonical", href: canonical });
    tags.push({ property: "og:url", content: canonical });
    const image = absoluteUrl(`/og/${ogImage}.jpg`);
    if (image) {
      tags.push({ property: "og:image", content: image });
      tags.push({ property: "og:image:width", content: "1200" });
      tags.push({ property: "og:image:height", content: "630" });
      tags.push({ name: "twitter:image", content: image });
    }
    for (const l of LOCALES) {
      const href = absoluteUrl(localePath(l, path));
      if (href) tags.push({ tagName: "link", rel: "alternate", hrefLang: LOCALE_INFO[l].bcp47, href });
    }
    const xDefault = absoluteUrl(path ? localePath("id", path) : "/");
    if (xDefault) tags.push({ tagName: "link", rel: "alternate", hrefLang: "x-default", href: xDefault });
  }
  // Without SITE_URL there are no absolute URLs, and hreflang requires them,
  // so canonical/hreflang/og:url/og:image are omitted until it is set.

  if (jsonLd) tags.push({ "script:ld+json": jsonLd });
  return tags;
}

/** JSON-LD publisher/author: the studio, never the institution. */
export function studioJsonLd() {
  return {
    "@type": "Organization",
    name: site.studioName,
    ...(site.studioUrl ? { url: site.studioUrl } : {}),
  };
}
