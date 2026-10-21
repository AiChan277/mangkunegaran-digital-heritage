import type { Route } from "./+types/history";
import idScript from "../../../content/audio/id/mangkunegaran-documentary.md?raw";
import enScript from "../../../content/audio/en/mangkunegaran-documentary.md?raw";
import { parseScript } from "~/content/audio-script";
import { ARCHIVE_BY_ID } from "~/content/archive";
import { aksara, glossary, image } from "~/content/resolve";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { buildRefs, pageSetup, type Refs as RefsData } from "~/lib/page";
import { chapterAudioViews, historyView, type EntryView, type Text } from "~/lib/history-view";
import { PageHero } from "~/components/PageHero";
import { GlossaryContext, RichText, plainText } from "~/components/Glossary";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { ListenButton } from "~/components/ListenButton";
import { Reveal } from "~/components/Reveal";
import { HeritageDivider } from "~/components/HeritageDivider";
import { ArchivalImage } from "~/components/ArchivalImage";
import { ChapterAudioPlayer } from "~/components/ChapterAudioPlayer";
import styles from "./history.module.css";

const HERO_ARCHIVE_ID = "arc-pendhapa-1874";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "history", ["history"]);
  const view = historyView(locale, content.lang);
  const audio = chapterAudioViews({ id: parseScript(idScript), en: parseScript(enScript) });
  const factIds = [
    ...view.periods.flatMap((p) => [...p.factIds, ...p.entries.flatMap((e) => e.factIds)]),
    ...view.rulers.flatMap((r) => r.factIds),
  ];
  return {
    messages,
    content,
    ...view,
    audio,
    // Indonesian and Javanese readers start on the Indonesian narration.
    audioLang: locale === "id" || locale === "jv" ? "id" : "en",
    hero: image(ARCHIVE_BY_ID.get(HERO_ARCHIVE_ID)!.imageId!, content.lang),
    aksara: aksara("sejarah"),
    glossary: glossary(content.lang),
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

/** `lang` attribute for text shown in a language other than the page's. */
function useLangOf() {
  const locale = useLocale();
  return (x: Text | undefined) => (x && x.lang !== locale ? x.lang : undefined);
}

function TimelineEntry({ e, refs }: { e: EntryView; refs: RefsData }) {
  const t = useT("history");
  const langOf = useLangOf();
  const sourceNums = [...new Set(e.factIds.flatMap((f) => refs.byFact[f] ?? []))].sort((a, b) => a - b);
  return (
    <Reveal as="li" className={styles.entry}>
      <div id={`entry-${e.id}`} className={styles.entryAnchor} data-milestone={e.milestone} tabIndex={-1}>
        <div className={styles.dateCol}>
          <span className={styles.marker} aria-hidden="true" />
          <p className={`${styles.date} numeral`} lang={langOf(e.date)}>
            {e.date.text}
          </p>
          {e.precision === "approximate" && <p className={styles.precision}>{t("entry.precision.approximate")}</p>}
          {e.milestone && <p className={styles.turning}>{t("entry.turningPoint")}</p>}
        </div>
        <div className={styles.entryBody}>
          <h3 className={styles.entryTitle} lang={langOf(e.title)}>
            {e.title.text}
          </h3>
          <p className={styles.summary}>
            <span lang={langOf(e.summary)}>{e.summary.text}</span>
            <Refs factIds={e.factIds} byFact={refs.byFact} />
          </p>

          <details className={styles.more}>
            <summary>
              <span>{t("entry.more")}</span>
              <span className="visually-hidden">: {e.title.text}</span>
            </summary>
            <div className={styles.moreBody}>
              {e.context && (
                <section>
                  <h4>{t("entry.context")}</h4>
                  <p lang={langOf(e.context)}>
                    <RichText text={e.context.text} />
                  </p>
                </section>
              )}
              <section>
                <h4>{t("entry.happened")}</h4>
                <p lang={langOf(e.happened)}>
                  <RichText text={e.happened.text} />
                </p>
              </section>
              {e.people.length > 0 && (
                <section>
                  <h4>{t("entry.people")}</h4>
                  <ul className={styles.people}>
                    {e.people.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
              )}
              <section>
                <h4>{t("entry.significance")}</h4>
                <p lang={langOf(e.significance)}>
                  <RichText text={e.significance.text} />
                </p>
              </section>
              {e.uncertainty && (
                <section className={styles.uncertain}>
                  <h4>{t("entry.uncertainty")}</h4>
                  <p lang={langOf(e.uncertainty)}>{e.uncertainty.text}</p>
                </section>
              )}
              {e.archive.length > 0 && (
                <section>
                  <h4>{t("entry.archive")}</h4>
                  <div className={styles.entryFigures}>
                    {e.archive.map((a) => (
                      <ArchivalImage key={a.id} item={a} sizes="(max-width: 860px) 90vw, 30vw" variant="compact" />
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h4>{t("entry.sources")}</h4>
                <ul className={styles.entrySources}>
                  {sourceNums.map((n) => (
                    <li key={n}>
                      <a href={`#src-${n}`} className="text-link">
                        {refs.sources[n - 1]?.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              {e.articles.length > 0 && (
                <section className={styles.links}>
                  <p>
                    <span>{t("entry.related")}:</span>{" "}
                    {e.articles.map((a, i) => (
                      <span key={a.href}>
                        {i > 0 && " · "}
                        <a href={a.href} className="text-link" lang={langOf(a.title)}>
                          {a.title.text}
                        </a>
                      </span>
                    ))}
                  </p>
                </section>
              )}
            </div>
          </details>
        </div>
      </div>
    </Reveal>
  );
}

export default function History({ loaderData: d }: Route.ComponentProps) {
  const t = useT("history");
  const langOf = useLangOf();

  return (
    <GlossaryContext.Provider value={d.glossary}>
      <PageHero variant="history" eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="01" intro={t("header.intro")} media={d.hero} />

      <nav className={`container ${styles.periodNav}`} aria-label={t("periodNav")}>
        <ol>
          {d.periods.map((p) => (
            <li key={p.id}>
              <a href={`#period-${p.id}`}>
                <span className={`${styles.navNumeral} numeral`}>
                  {p.numeral} · {p.range}
                </span>
                <span lang={langOf(p.title)}>{p.title.text}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#archive">
              <span className={styles.navNumeral}>{t("archive.eyebrow")}</span>
              <span>{t("archive.title")}</span>
            </a>
          </li>
        </ol>
      </nav>

      {d.periods.map((p, pi) => (
        <section
          key={p.id}
          id={`period-${p.id}`}
          className={`${styles.period} ${pi % 2 ? styles.periodAlt : ""}`}
          aria-labelledby={`period-${p.id}-title`}
        >
          <div className="container grid">
            <header className={styles.periodHead}>
              <p className={`${styles.periodNumeral} numeral`} aria-hidden="true">
                {p.numeral}
              </p>
              <p className={`${styles.periodRange} numeral`}>{p.range}</p>
              <h2 id={`period-${p.id}-title`} className={styles.periodTitle} lang={langOf(p.title)}>
                {p.title.text}
              </h2>
              <HeritageDivider className={styles.periodDivider} />
              <ListenButton
                text={[p.title.text, ...p.intro.map((x) => plainText(x.text))].join(". ")}
                lang={p.intro[0]?.lang ?? p.title.lang}
                label={p.title.text}
              />
            </header>
            <div className={styles.periodBody}>
              <div className="prose">
                {p.intro.map((x, i) => (
                  <p key={i} lang={langOf(x)}>
                    <RichText text={x.text} />
                    {i === p.intro.length - 1 && <Refs factIds={p.factIds} byFact={d.refs.byFact} />}
                  </p>
                ))}
              </div>
              {p.sideNote && (
                <aside className={styles.sideNote} lang={langOf(p.sideNote)}>
                  {p.sideNote.text}
                </aside>
              )}
              {d.audio[p.id] && (
                <ChapterAudioPlayer chapterId={p.id} chapterTitle={p.title.text} tracks={d.audio[p.id]!} initialLang={d.audioLang} />
              )}
            </div>
            {p.lead && (
              <div className={styles.periodLead}>
                <ArchivalImage item={p.lead} sizes="(max-width: 860px) 92vw, 40vw" variant="lead" />
              </div>
            )}

            <ol className={styles.timeline} aria-label={t("timelineLabel", { range: p.range })}>
              {p.entries.map((e) => (
                <TimelineEntry key={e.id} e={e} refs={d.refs} />
              ))}
            </ol>
          </div>
        </section>
      ))}

      <section id="archive" className={`container section ${styles.archive}`} aria-labelledby="archive-title">
        <header className={styles.archiveHead}>
          <p className="eyebrow">{t("archive.eyebrow")}</p>
          <h2 id="archive-title" className={styles.periodTitle}>
            {t("archive.title")}
          </h2>
          <p className={styles.archiveIntro}>{t("archive.intro")}</p>
        </header>
        <div className={styles.exhibition}>
          {d.archive.confirmed.map((a) => (
            <ArchivalImage key={a.id} item={a} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 30vw" />
          ))}
        </div>

        <div className={styles.candidates}>
          <h3 className={styles.candidatesTitle}>{t("archive.candidatesTitle")}</h3>
          <p className={styles.archiveIntro}>{t("archive.candidatesIntro")}</p>
          <ul>
            {d.archive.candidates.map((c) => (
              <li key={c.id}>
                <span className={styles.candidateBadge}>{t("archive.candidateBadge")}</span>
                <a href={c.recordUrl} className="text-link" rel="noopener" lang={langOf(c.title)}>
                  {c.title.text}
                </a>
                <span className={styles.candidateMeta}>
                  {c.institution} · <span lang={langOf(c.dateLabel)}>{c.dateLabel.text}</span>
                </span>
                <span className={styles.candidateDesc} lang={langOf(c.description)}>
                  {c.description.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`container section ${styles.rulers}`} aria-labelledby="rulers-title">
        <div className="grid">
          <div className={styles.rulersHead}>
            <h2 id="rulers-title" className={styles.periodTitle}>
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
                        <span className={styles.disputedInline} lang={langOf(r.disputed)}>
                          {t("common:sources.sourcesDiffer")}: {r.disputed.text}
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
