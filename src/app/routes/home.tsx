import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Route } from "./+types/home";
import { HOME, HOME_FACT_IDS } from "~/content/home";
import { SPACES } from "~/content/spaces";
import { ARTICLES, ARTICLE_SLUGS } from "~/content/articles";
import { aksara, glossary, image, pick } from "~/content/resolve";
import { LOCALES, LOCALE_INFO } from "~/i18n/config";
import { useT } from "~/i18n/useT";
import { buildMeta, studioJsonLd } from "~/lib/meta";
import { buildRefs, pageSetup } from "~/lib/page";
import { localePath } from "~/lib/paths";
import { site } from "~/site";
import { Reveal } from "~/components/Reveal";
import { useLocale } from "~/i18n/useLocale";
import { Picture } from "~/components/Picture";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { ScriptTitle } from "~/components/ScriptTitle";
import { FallbackNotice } from "~/components/FallbackNotice";
import { GlossaryContext, RichText } from "~/components/Glossary";
import { Ornament } from "~/components/Ornament";
import styles from "./home.module.css";

const JOURNEY = ["pamedan", "pendhapa-ageng", "pringgitan", "dalem-ageng"];
const PHOTOS = ["kumudawati", "dancers-male", "stained-glass", "pracimayasa-garden", "wayang-beber", "gate"];

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "home", ["home"]);
  const lang = content.lang;
  const journey = JOURNEY.map((id) => {
    const s = SPACES.find((x) => x.id === id)!;
    return {
      id: s.id,
      order: s.order,
      name: s.name,
      kicker: pick(s.kicker, lang === "jv" ? "id" : lang),
      summary: pick(s.summary, lang === "jv" ? "id" : lang),
      aksara: aksara(s.aksaraId),
      image: s.imageId ? image(s.imageId, lang) : null,
      factIds: s.factIds,
    };
  });
  const stories = ARTICLE_SLUGS.map((slug) => {
    const rec = ARTICLES[slug]!;
    const a = rec[lang === "jv" ? "id" : lang] ?? rec.en!;
    return { slug, title: a.title, dek: a.dek, lang: a.lang, image: image(a.heroImageId, lang) };
  });
  const factIds = [...HOME_FACT_IDS, ...journey.flatMap((j) => j.factIds)];
  const refs = buildRefs(factIds);
  const siteTitle = t("common:brand.siteTitle");
  return {
    messages,
    content,
    hero: image("pendhapa-grand", lang),
    heroMobile: image("pendhapa-grand-portrait", lang),
    heroAksara: aksara("mangkunegaran"),
    intro: HOME.intro.map((p) => ({ text: pick(p.text, lang), factIds: p.factIds })),
    journeyIntro: pick(HOME.journeyIntro, lang),
    journey,
    stories,
    arts: { text: pick(HOME.arts.text, lang), factIds: HOME.arts.factIds, image: image("dancers-female", lang) },
    photos: PHOTOS.map((id) => image(id, lang)),
    continuity: HOME.continuity.map((c) => ({
      date: pick(c.date, lang),
      text: pick(c.text, lang),
      factIds: c.factIds,
      image: c.imageId ? image(c.imageId, lang) : null,
    })),
    multilingual: pick(HOME.multilingual, lang),
    glossary: glossary(lang),
    refs,
    meta: buildMeta({
      locale,
      path: "",
      title: t("home:meta.title"),
      siteTitle,
      description: t("home:meta.description"),
      ogImage: "home",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteTitle,
        inLanguage: LOCALE_INFO[locale].bcp47,
        description: t("home:meta.description"),
        ...(site.siteUrl ? { url: `${site.siteUrl}/${locale}` } : {}),
        publisher: studioJsonLd(),
        author: studioJsonLd(),
      },
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const t = useT("home");
  const d = loaderData;
  const lang = d.content.lang;
  const locale = useLocale();
  const contentLangAttr = lang !== locale ? lang : undefined;

  return (
    <GlossaryContext.Provider value={d.glossary}>
      <FallbackNotice content={d.content} />

      {/* 1 · Hero — split editorial layout; the photograph is the LCP element. */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`container grid ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              <span className={styles.heroLine}>Mangkunegaran</span>
              <span className={`${styles.heroLine} ${styles.heroSub}`}>{t("hero.subtitle")}</span>
            </h1>
            <ScriptTitle aksara={d.heroAksara} size="l" />
            <p className={styles.heroConcept}>{t("hero.concept")}</p>
          </div>
          <figure className={styles.heroFigure}>
            <div className={styles.heroFrame}>
              <Picture image={d.hero} mobile={d.heroMobile} priority cover sizes="(max-width: 699px) 100vw, 60vw" />
            </div>
            <figcaption className={styles.credit}>
              {d.hero.attribution}
            </figcaption>
          </figure>
          <span className={`${styles.heroYear} numeral`} aria-hidden="true">
            1757
          </span>
        </div>
      </section>

      {/* 2 · Introduction — large serif lead, every sentence sourced. */}
      <section className={`container ${styles.intro}`} aria-labelledby="intro-title" lang={contentLangAttr}>
        <div className="grid">
          <h2 id="intro-title" className={`eyebrow ${styles.introLabel}`}>
            {t("intro.eyebrow")}
          </h2>
          <div className={styles.introBody}>
            {d.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "lead" : styles.introSecond}>
                <RichText text={p.text} />
                <Refs factIds={p.factIds} byFact={d.refs.byFact} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Architectural journey — numbered sequence, alternating rows. */}
      <section className={styles.journey} aria-labelledby="journey-title">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">{t("journey.eyebrow")}</p>
            <h2 id="journey-title" className={styles.h2}>
              {t("journey.title")}
            </h2>
            <p className={styles.sectionLead} lang={contentLangAttr}>
              {d.journeyIntro}
              <Refs factIds={["f-sequence"]} byFact={d.refs.byFact} />
            </p>
          </div>
          <ol className={styles.journeyList}>
            {d.journey.map((s, i) => (
              <Reveal as="li" key={s.id} className={`${styles.step} ${i % 2 ? styles.stepFlip : ""}`}>
                {s.image ? (
                  <div className={styles.stepImage}>
                    <Picture image={s.image} cover sizes="(max-width: 760px) 100vw, 50vw" />
                  </div>
                ) : (
                  // No openly licensed photograph of this space: a typographic panel instead.
                  <div className={`${styles.stepImage} ${styles.stepType}`} aria-hidden="true">
                    <span lang="jv-Java">{s.aksara?.javanese}</span>
                    <span className={styles.stepTypeLatin}>{s.name}</span>
                  </div>
                )}
                <div className={styles.stepText}>
                  <span className={`${styles.stepNum} numeral`} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow" lang={lang === "jv" ? "id" : contentLangAttr}>
                    {s.kicker}
                  </p>
                  <h3 className={styles.stepTitle}>{s.name}</h3>
                  <ScriptTitle aksara={s.aksara} size="s" />
                  <p lang={lang === "jv" ? "id" : contentLangAttr}>
                    {s.summary}
                    <Refs factIds={s.factIds} byFact={d.refs.byFact} />
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Link to={localePath(locale, "architecture")} className="arrow-link">
            {t("journey.cta")} <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      {/* 4 · Stories — one feature, two indexed entries. */}
      <section className={`container section ${styles.stories}`} aria-labelledby="stories-title">
        <div className={styles.sectionHeadRow}>
          <div>
            <p className="eyebrow">{t("stories.eyebrow")}</p>
            <h2 id="stories-title" className={styles.h2}>
              {t("stories.title")}
            </h2>
          </div>
          <Link to={localePath(locale, "stories")} className="arrow-link">
            {t("stories.cta")} <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className={`grid ${styles.storyGrid}`}>
          {d.stories[0] && (
            <Reveal className={styles.storyFeature}>
              <Link to={localePath(locale, `stories/${d.stories[0].slug}`)} className={styles.storyLink} lang={d.stories[0].lang !== locale ? d.stories[0].lang : undefined}>
                <div className={styles.storyImage}>
                  <Picture image={d.stories[0].image} cover sizes="(max-width: 760px) 100vw, 58vw" />
                </div>
                <h3 className={styles.storyTitleLarge}>{d.stories[0].title}</h3>
                <p className={styles.storyDek}>{d.stories[0].dek}</p>
              </Link>
            </Reveal>
          )}
          <ol className={styles.storyIndex}>
            {d.stories.slice(1).map((s, i) => (
              <Reveal as="li" key={s.slug}>
                <Link to={localePath(locale, `stories/${s.slug}`)} className={styles.storyRow} lang={s.lang !== locale ? s.lang : undefined}>
                  <span className={`${styles.storyNum} numeral`} aria-hidden="true">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <span>
                    <span className={styles.storyTitle}>{s.title}</span>
                    <span className={styles.storyDekSmall}>{s.dek}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 · Arts and traditions — the "night pendhapa" band. */}
      <section className={`night ${styles.arts}`} aria-labelledby="arts-title">
        <div className={`container grid ${styles.artsGrid}`}>
          <div className={styles.artsImage}>
            <Picture image={d.arts.image} cover sizes="(max-width: 760px) 100vw, 58vw" />
          </div>
          <Reveal className={styles.artsText}>
            <p className="eyebrow">{t("arts.eyebrow")}</p>
            <h2 id="arts-title" className={styles.h2}>
              {t("arts.title")}
            </h2>
            <p lang={contentLangAttr}>
              {d.arts.text}
              <Refs factIds={d.arts.factIds} byFact={d.refs.byFact} />
            </p>
            <Link to={localePath(locale, "culture")} className="arrow-link">
              {t("arts.cta")} <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6 · Curated photography — mosaic strip. */}
      <section className={`container section ${styles.photos}`} aria-labelledby="photos-title">
        <div className={styles.sectionHeadRow}>
          <div>
            <p className="eyebrow">{t("photos.eyebrow")}</p>
            <h2 id="photos-title" className={styles.h2}>
              {t("photos.title")}
            </h2>
          </div>
          <Link to={localePath(locale, "gallery")} className="arrow-link">
            {t("photos.cta")} <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <ul className={styles.mosaic}>
          {d.photos.map((img) => (
            <li key={img.id} className={styles.tile}>
              <Picture image={img} cover sizes="(max-width: 760px) 50vw, 33vw" />
            </li>
          ))}
        </ul>
      </section>

      {/* 7 · Cultural continuity — dated ledger. */}
      <section className={styles.continuity} aria-labelledby="continuity-title">
        <div className={`container grid ${styles.continuityGrid}`}>
          <div className={styles.continuityHead}>
            <p className="eyebrow">{t("continuity.eyebrow")}</p>
            <h2 id="continuity-title" className={styles.h2}>
              {t("continuity.title")}
            </h2>
          </div>
          <ol className={styles.ledger} lang={contentLangAttr}>
            {d.continuity.map((c) => (
              <Reveal as="li" key={c.date + c.text} className={styles.ledgerRow}>
                <span className={`${styles.ledgerDate} numeral`}>{c.date}</span>
                <p>
                  {c.text}
                  <Refs factIds={c.factIds} byFact={d.refs.byFact} />
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 · Multilingual entry point. */}
      <section className={`container section ${styles.languages}`} aria-labelledby="languages-title">
        <Ornament />
        <div className={`grid ${styles.languagesGrid}`}>
          <div className={styles.languagesText}>
            <p className="eyebrow">{t("languages.eyebrow")}</p>
            <h2 id="languages-title" className={styles.h2}>
              {t("languages.title")}
            </h2>
            <p lang={contentLangAttr}>
              {d.multilingual}
              <Refs factIds={["f-chulalongkorn-1871"]} byFact={d.refs.byFact} />
            </p>
          </div>
          <ul className={styles.langCloud}>
            {LOCALES.map((code) => (
              <li key={code}>
                <Link
                  to={localePath(code)}
                  lang={LOCALE_INFO[code].bcp47}
                  hrefLang={LOCALE_INFO[code].bcp47}
                  aria-current={code === locale ? "true" : undefined}
                  className={code === locale ? undefined : "lang-name"}
                >
                  {LOCALE_INFO[code].nativeName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container">
        <SourceList sources={d.refs.sources} title={t("sources")} />
      </div>
    </GlossaryContext.Provider>
  );
}
