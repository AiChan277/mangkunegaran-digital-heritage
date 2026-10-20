import type { Route } from "./+types/history";
import { ERAS, RULERS, TIMELINE } from "~/content/history";
import { aksara, glossary, image, pick } from "~/content/resolve";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { buildRefs, pageSetup } from "~/lib/page";
import { PageHeader } from "~/components/PageHeader";
import { FallbackNotice } from "~/components/FallbackNotice";
import { GlossaryContext, RichText, plainText } from "~/components/Glossary";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { Picture } from "~/components/Picture";
import { ListenButton } from "~/components/ListenButton";
import { Reveal } from "~/components/Reveal";
import styles from "./history.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "history", ["history"]);
  const lang = content.lang;
  const eras = ERAS.map((era) => ({
    id: era.id,
    range: era.range,
    title: pick(era.title, lang),
    paragraphs: era.paragraphs.map((p) => pick(p, lang)),
    factIds: era.factIds,
    image: era.imageId ? image(era.imageId, lang) : null,
    entries: TIMELINE.filter((e) => e.year >= era.from && e.year <= era.to).map((e) => ({
      id: e.id,
      date: pick(e.date, lang),
      title: pick(e.title, lang),
      text: pick(e.text, lang),
      disputed: e.disputed ? pick(e.disputed, lang) : null,
      factIds: e.factIds,
      image: e.imageId ? image(e.imageId, lang) : null,
    })),
  }));
  const rulers = RULERS.map((r) => ({ ...r, disputed: r.disputed ? pick(r.disputed, lang) : null }));
  const factIds = [...eras.flatMap((e) => [...e.factIds, ...e.entries.flatMap((x) => x.factIds)]), ...rulers.flatMap((r) => r.factIds)];
  return {
    messages,
    content,
    eras,
    rulers,
    aksara: aksara("sejarah"),
    glossary: glossary(lang),
    refs: buildRefs(factIds),
    meta: buildMeta({
      locale,
      path: "history",
      title: t("history:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("history:meta.description"),
      ogImage: "history",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function History({ loaderData: d }: Route.ComponentProps) {
  const t = useT("history");
  const locale = useLocale();
  const contentLang = d.content.lang !== locale ? d.content.lang : undefined;

  return (
    <GlossaryContext.Provider value={d.glossary}>
      <FallbackNotice content={d.content} />
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="01" intro={t("header.intro")} />

      <nav className={`container ${styles.eraNav}`} aria-label={t("eraNav")}>
        <ol>
          {d.eras.map((era) => (
            <li key={era.id}>
              <a href={`#era-${era.id}`}>
                <span className="numeral">{era.range}</span>
                <span lang={contentLang}>{era.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {d.eras.map((era, ei) => (
        <section key={era.id} id={`era-${era.id}`} className={`${styles.era} ${ei % 2 ? styles.eraAlt : ""}`} aria-labelledby={`era-${era.id}-title`}>
          <div className="container grid">
            <header className={styles.eraHead}>
              <p className={`${styles.eraRange} numeral`}>{era.range}</p>
              <h2 id={`era-${era.id}-title`} className={styles.eraTitle} lang={contentLang}>
                {era.title}
              </h2>
              <ListenButton
                text={[era.title, ...era.paragraphs.map(plainText)].join(". ")}
                lang={d.content.lang}
                label={era.title}
              />
            </header>
            <div className={`prose ${styles.eraBody}`} lang={contentLang}>
              {era.paragraphs.map((p, i) => (
                <p key={i}>
                  <RichText text={p} />
                  {i === era.paragraphs.length - 1 && <Refs factIds={era.factIds} byFact={d.refs.byFact} />}
                </p>
              ))}
            </div>
            {era.image && (
              <figure className={styles.eraFigure}>
                <Picture image={era.image} sizes="(max-width: 760px) 100vw, 40vw" />
                <figcaption>
                  {era.image.dated ? `${era.image.dated} · ` : ""}
                  {era.image.attribution}
                </figcaption>
              </figure>
            )}

            <ol className={styles.timeline} aria-label={t("timelineLabel", { range: era.range })} lang={contentLang}>
              {era.entries.map((e) => (
                <Reveal as="li" key={e.id} className={styles.entry}>
                  <p className={`${styles.date} numeral`}>{e.date}</p>
                  <div className={styles.entryBody}>
                    <h3 className={styles.entryTitle}>{e.title}</h3>
                    <p>
                      {e.text}
                      <Refs factIds={e.factIds} byFact={d.refs.byFact} />
                    </p>
                    {e.disputed && (
                      <p className={styles.disputed}>
                        <strong>{t("common:sources.sourcesDiffer")}:</strong> {e.disputed}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ))}

      <section className={`container section ${styles.rulers}`} aria-labelledby="rulers-title">
        <div className="grid">
          <div className={styles.rulersHead}>
            <h2 id="rulers-title" className={styles.eraTitle}>
              {t("rulers.title")}
            </h2>
            <p className={styles.rulersNote}>{t("rulers.note")}</p>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className="visually-hidden">{t("rulers.title")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("rulers.ruler")}</th>
                  <th scope="col">{t("rulers.reign")}</th>
                </tr>
              </thead>
              <tbody>
                {d.rulers.map((r) => (
                  <tr key={r.ordinal}>
                    <th scope="row">
                      <span className={`${styles.ordinal} numeral`} aria-hidden="true">
                        {r.ordinal}
                      </span>
                      {r.name}
                    </th>
                    <td>
                      <span className="numeral">{r.reign}</span>
                      <Refs factIds={r.factIds} byFact={d.refs.byFact} />
                      {r.disputed && (
                        <span className={styles.disputedInline} lang={contentLang}>
                          {t("common:sources.sourcesDiffer")}: {r.disputed}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="container">
        <SourceList sources={d.refs.sources} />
      </div>
    </GlossaryContext.Provider>
  );
}
