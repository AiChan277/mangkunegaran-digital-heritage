/**
 * Story registry. Each story has one record per available content language.
 * To add a story: create articles/<slug>.ts exporting `en` and `id`
 * (and optionally `jv`), add the slug to slugs.ts, then register it below.
 */
import { articleSchema, parseAll, type Article, type ArticleInput } from "../schema";
import type { ContentLang } from "~/i18n/config";
import { ARTICLE_SLUGS } from "./slugs";
import * as srv from "./solosche-radio-vereeniging";
import * as panembrama from "./panembrama";
import * as legiun from "./legiun-mangkunegaran";

type Records = Partial<Record<ContentLang, Article>>;

const RAW: Record<string, Partial<Record<ContentLang, ArticleInput>>> = {
  "solosche-radio-vereeniging": { en: srv.en, id: srv.id },
  panembrama: { en: panembrama.en, id: panembrama.id },
  "legiun-mangkunegaran": { en: legiun.en, id: legiun.id },
};

export const ARTICLES: Record<string, Records> = Object.fromEntries(
  Object.entries(RAW).map(([slug, records]) => {
    const parsed: Records = {};
    for (const [lang, rec] of Object.entries(records) as [ContentLang, ArticleInput][]) {
      const [article] = parseAll(articleSchema, [rec], `article ${slug}/${lang}`);
      if (article!.id !== slug) throw new Error(`Article id "${article!.id}" does not match slug "${slug}"`);
      if (article!.lang !== lang) throw new Error(`Article ${slug} registered as ${lang} but declares lang ${article!.lang}`);
      parsed[lang] = article;
    }
    if (!parsed.en || !parsed.id) throw new Error(`Article ${slug} needs both en and id records`);
    return [slug, parsed];
  }),
);

for (const slug of ARTICLE_SLUGS) {
  if (!ARTICLES[slug]) throw new Error(`Slug "${slug}" in slugs.ts has no registered article`);
}

export { ARTICLE_SLUGS };
