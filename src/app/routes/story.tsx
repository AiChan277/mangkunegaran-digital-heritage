import { useEffect, useRef } from "react";
import { Link, data } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/story";
import { ARTICLES } from "~/content/articles";
import { glossary, image } from "~/content/resolve";
import { LOCALE_INFO } from "~/i18n/config";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta, studioJsonLd } from "~/lib/meta";
import { buildRefs, pageSetup } from "~/lib/page";
import { localePath } from "~/lib/paths";
import { readingMinutes } from "~/lib/readingTime";
import { absoluteUrl } from "~/site";
import { GlossaryContext, RichText, plainText } from "~/components/Glossary";
import { FallbackNotice } from "~/components/FallbackNotice";
import { Picture } from "~/components/Picture";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { ListenButton } from "~/components/ListenButton";
import styles from "./story.module.css";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "stories", ["stories"]);
  const rec = ARTICLES[params.slug];
  if (!rec) throw data("Not found", { status: 404 });
  const lang = content.lang;
  const a = rec[lang] ?? rec.en!;
  const body = a.body.map((b) => (b.type === "figure" ? { ...b, image: image(b.imageId, lang) } : { ...b, image: null }));
  const texts = [a.title, a.dek, ...a.body.flatMap((b) => ("text" in b ? [plainText(b.text)] : []))];
  const related = a.related
    .filter((slug) => ARTICLES[slug])
    .map((slug) => {
      const r = ARTICLES[slug]![lang] ?? ARTICLES[slug]!.en!;
      return { slug, title: r.title, lang: r.lang };
    });
  const siteTitle = t("common:brand.siteTitle");
  const path = `stories/${a.id}`;
  return {
    messages,
    content,
    article: { id: a.id, title: a.title, dek: a.dek, lang: a.lang, verifiedAt: a.verifiedAt, status: a.translationStatus },
    hero: image(a.heroImageId, lang),
    body,
    related,
    minutes: readingMinutes(texts),
    speech: texts.join(". "),
    glossary: glossary(lang),
    refs: buildRefs(a.factIds),
    meta: buildMeta({
      locale,
      path,
      title: a.title,
      siteTitle,
      description: a.dek,
      ogImage: `story-${a.id}`,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.dek,
        inLanguage: LOCALE_INFO[a.lang].bcp47,
        dateModified: a.verifiedAt,
        author: studioJsonLd(),
        publisher: studioJsonLd(),
        ...(absoluteUrl(localePath(locale, path)) ? { mainEntityOfPage: absoluteUrl(localePath(locale, path)) } : {}),
        ...(absoluteUrl(`/images/${a.heroImageId}-1200.webp`) ? { image: absoluteUrl(`/images/${a.heroImageId}-1200.webp`) } : {}),
      },
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

/** Fixed reading-progress bar driven by a transform (no layout work). */
function ProgressBar({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const el = target.current;
      if (!el || !bar.current) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);
  return (
    <div className={styles.progress} aria-hidden="true">
      <div ref={bar} className={styles.progressBar} />
    </div>
  );
}

export default function Story({ loaderData: d }: Route.ComponentProps) {
  const t = useT("stories");
  const locale = useLocale();
  const articleRef = useRef<HTMLElement>(null);
  const contentLang = d.article.lang !== locale ? d.article.lang : undefined;

  return (
    <GlossaryContext.Provider value={d.glossary}>
      <ProgressBar target={articleRef} />
      <FallbackNotice content={d.content} />
      <article ref={articleRef} className={styles.article}>
        <header className={`container ${styles.header}`}>
          <Link to={localePath(locale, "stories")} className={`arrow-link ${styles.back}`}>
            <ArrowLeft aria-hidden="true" size={18} /> {t("back")}
          </Link>
          <p className="eyebrow">
            {t("header.eyebrow")} · {t("readingTime", { n: d.minutes })}
          </p>
          <h1 className={styles.title} lang={contentLang}>
            {d.article.title}
          </h1>
          <p className={styles.dek} lang={contentLang}>
            {d.article.dek}
          </p>
          <div className={styles.tools}>
            <ListenButton text={d.speech} lang={d.article.lang} label={d.article.title} />
            <span className={styles.verified}>{t("verified", { date: d.article.verifiedAt })}</span>
          </div>
        </header>

        <figure className={`container ${styles.hero}`}>
          <Picture image={d.hero} priority sizes="(max-width: 1360px) 100vw, 1360px" />
          <figcaption>
            {d.hero.dated ? `${d.hero.dated} · ` : ""}
            {d.hero.attribution}
          </figcaption>
        </figure>

        <div className={`container ${styles.bodyWrap}`}>
          <div className={styles.body} lang={contentLang}>
            {d.body.map((b, i) => {
              switch (b.type) {
                case "p":
                  return (
                    <p key={i}>
                      <RichText text={b.text} />
                      <Refs factIds={b.factIds} byFact={d.refs.byFact} />
                    </p>
                  );
                case "h2":
                  return <h2 key={i}>{b.text}</h2>;
                case "figure":
                  return b.image ? (
                    <figure key={i} className={b.wide ? styles.wide : styles.figure}>
                      <Picture image={b.image} sizes="(max-width: 860px) 100vw, 900px" />
                      <figcaption>
                        {b.caption && <span>{b.caption} </span>}
                        <span className={styles.credit}>{b.image.attribution}</span>
                      </figcaption>
                    </figure>
                  ) : null;
                case "quote":
                  return (
                    <blockquote key={i} className={styles.quote}>
                      <p>{b.text}</p>
                      <footer>
                        — {b.cite}
                        <Refs factIds={b.factIds} byFact={d.refs.byFact} />
                      </footer>
                    </blockquote>
                  );
                case "note":
                  return (
                    <aside key={i} className={styles.note}>
                      <p className={styles.noteLabel}>{t("noteLabel")}</p>
                      <p>
                        {b.text}
                        <Refs factIds={b.factIds} byFact={d.refs.byFact} />
                      </p>
                    </aside>
                  );
                default:
                  return null;
              }
            })}
          </div>

          <SourceList sources={d.refs.sources} />

          {d.related.length > 0 && (
            <nav className={styles.related} aria-labelledby="related-title">
              <h2 id="related-title" className="eyebrow">
                {t("related")}
              </h2>
              <ul>
                {d.related.map((r) => (
                  <li key={r.slug}>
                    <Link to={localePath(locale, `stories/${r.slug}`)} lang={r.lang !== locale ? r.lang : undefined}>
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>
    </GlossaryContext.Provider>
  );
}
