import { Link } from "react-router";
import type { Route } from "./+types/stories";
import { ARTICLES, ARTICLE_SLUGS } from "~/content/articles";
import { aksara, image } from "~/content/resolve";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { pageSetup } from "~/lib/page";
import { localePath } from "~/lib/paths";
import { readingMinutes } from "~/lib/readingTime";
import { plainText } from "~/components/Glossary";
import { PageHeader } from "~/components/PageHeader";
import { FallbackNotice } from "~/components/FallbackNotice";
import { Picture } from "~/components/Picture";
import { Reveal } from "~/components/Reveal";
import styles from "./stories.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "stories", ["stories"]);
  const lang = content.lang;
  const stories = ARTICLE_SLUGS.map((slug) => {
    const rec = ARTICLES[slug]!;
    const a = rec[lang] ?? rec.en!;
    const texts = [a.title, a.dek, ...a.body.flatMap((b) => ("text" in b ? [plainText(b.text)] : []))];
    return { slug, title: a.title, dek: a.dek, lang: a.lang, image: image(a.heroImageId, lang), minutes: readingMinutes(texts) };
  });
  return {
    messages,
    content,
    stories,
    aksara: aksara("cariyos"),
    meta: buildMeta({
      locale,
      path: "stories",
      title: t("stories:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("stories:meta.description"),
      ogImage: "stories",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function Stories({ loaderData: d }: Route.ComponentProps) {
  const t = useT("stories");
  const locale = useLocale();
  return (
    <>
      <FallbackNotice content={d.content} />
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="04" intro={t("header.intro")} />
      <ol className={`container ${styles.list}`}>
        {d.stories.map((s, i) => (
          <Reveal as="li" key={s.slug} className={`${styles.item} ${i % 2 ? styles.flip : ""}`}>
            <Link to={localePath(locale, `stories/${s.slug}`)} className={styles.link} lang={s.lang !== locale ? s.lang : undefined}>
              <div className={styles.image}>
                <Picture image={s.image} cover sizes="(max-width: 760px) 100vw, 45vw" />
              </div>
              <div className={styles.text}>
                <span className={`${styles.num} numeral`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className={styles.title}>{s.title}</h2>
                <p className={styles.dek}>{s.dek}</p>
                <p className={styles.meta}>{t("readingTime", { n: s.minutes })}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>
    </>
  );
}
