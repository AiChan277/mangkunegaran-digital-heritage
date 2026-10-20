import type { Route } from "./+types/about";
import { ABOUT_SECTIONS, CODE_CREDITS, FONT_CREDITS, SPECIMEN } from "~/content/about";
import { ASSETS } from "~/content/assets";
import { FACTS, SOURCES } from "~/content/sources";
import { aksara, pick } from "~/content/resolve";
import { LOCALES, LOCALE_INFO, contentStatus, uiStatus, type Status } from "~/i18n/config";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { pageSetup } from "~/lib/page";
import { site } from "~/site";
import { PageHeader } from "~/components/PageHeader";
import { FallbackNotice } from "~/components/FallbackNotice";
import styles from "./about.module.css";

const SWATCHES = [
  { token: "--green-pareanom", hex: "#2e4a3b" },
  { token: "--brass", hex: "#a8833a" },
  { token: "--ivory", hex: "#f5efe2" },
  { token: "--teak", hex: "#3a271b" },
  { token: "--ink", hex: "#1c1a17" },
  { token: "--terracotta", hex: "#9a4529" },
];

const PAGES_FOR_STATUS = ["home", "history", "architecture"] as const;

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "about", ["about"]);
  const lang = content.lang;
  const sourceIndex = new Map(SOURCES.map((s, i) => [s.id, i + 1]));
  return {
    messages,
    content,
    sections: ABOUT_SECTIONS.map((s) => ({ id: s.id, title: pick(s.title, lang), paragraphs: s.paragraphs.map((p) => pick(p, lang)) })),
    facts: FACTS.map((f) => ({
      id: f.id,
      claim: f.claim,
      confidence: f.confidence,
      notes: f.notes ?? null,
      sources: f.sourceIds.map((sid) => sourceIndex.get(sid)!),
    })),
    sources: SOURCES.map((s) => ({ id: s.id, title: s.title, publisher: s.publisher, url: s.url, accessed: s.accessed, kind: s.kind, archived: !!s.archived })),
    images: ASSETS.filter((a) => !a.derivedFrom).map((a) => ({
      id: a.id,
      subject: a.subject,
      attribution: a.attributionText,
      license: a.license,
      licenseUrl: a.licenseUrl ?? null,
      sourcePageUrl: a.sourcePageUrl,
    })),
    status: LOCALES.map((code) => ({
      code,
      ui: uiStatus(code),
      pages: PAGES_FOR_STATUS.map((p) => contentStatus(code, p)),
    })),
    aksara: aksara("babagan"),
    meta: buildMeta({
      locale,
      path: "about",
      title: t("about:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("about:meta.description"),
      ogImage: "about",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function About({ loaderData: d }: Route.ComponentProps) {
  const t = useT("about");
  const locale = useLocale();
  const contentLang = d.content.lang !== locale ? d.content.lang : undefined;
  const statusLabel = (s: Status) => t(`status.${s}`);
  const counts = {
    confirmed: d.facts.filter((f) => f.confidence === "confirmed").length,
    single: d.facts.filter((f) => f.confidence === "single-source").length,
    disputed: d.facts.filter((f) => f.confidence === "disputed").length,
  };

  return (
    <>
      <FallbackNotice content={d.content} />
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="07" intro={t("header.intro")}>
        <p className={styles.disclaimer}>{t("common:footer.disclaimer", { studio: site.studioName })} mangkunegaran.id</p>
      </PageHeader>

      <div className={`container ${styles.layout}`}>
        <nav className={styles.toc} aria-label={t("tocLabel")}>
          <ol>
            {d.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} lang={contentLang}>
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#sources">{t("sources.title")}</a>
            </li>
            <li>
              <a href="#credits">{t("credits.title")}</a>
            </li>
            <li>
              <a href="#translation-status">{t("translation.title")}</a>
            </li>
            <li>
              <a href="#studio">{t("studio.title")}</a>
            </li>
          </ol>
        </nav>

        <div className={styles.main}>
          {d.sections.map((s) => (
            <section key={s.id} id={s.id} className={styles.section} aria-labelledby={`${s.id}-title`}>
              <h2 id={`${s.id}-title`} className={styles.h2} lang={contentLang}>
                {s.title}
              </h2>
              <div className="prose" lang={contentLang}>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {s.id === "design" && (
                <div className={styles.specimen}>
                  <ul className={styles.swatches} aria-label={t("design.palette")}>
                    {SWATCHES.map((sw) => (
                      <li key={sw.token}>
                        <span className={styles.chip} style={{ background: sw.hex }} aria-hidden="true" />
                        <code>{sw.token}</code>
                        <span className={styles.hex}>{sw.hex}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.type}>
                    <p className={styles.typeDisplay}>{SPECIMEN.display}</p>
                    <p className={styles.typeText}>{SPECIMEN.text}</p>
                    <p className={styles.typeScripts}>
                      {SPECIMEN.scripts.map((s) => (
                        <span key={s.lang} lang={s.lang} className={s.lang === "jv-Java" ? undefined : "lang-name"}>
                          {s.text}
                        </span>
                      ))}
                    </p>
                    <p className={styles.typeNote}>{t("design.scriptsNote")}</p>
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* Measured Lighthouse / Web Vitals results appear here only after they are measured on the deployed site. */}

          <section id="sources" className={styles.section} aria-labelledby="sources-title">
            <h2 id="sources-title" className={styles.h2}>
              {t("sources.title")}
            </h2>
            <p>{t("sources.summary", { facts: d.facts.length, sources: d.sources.length, confirmed: counts.confirmed, single: counts.single, disputed: counts.disputed })}</p>
            <ol className={styles.sourceList}>
              {d.sources.map((s, i) => (
                <li key={s.id} id={`about-src-${i + 1}`}>
                  <span className={`${styles.n} numeral`}>{i + 1}</span>
                  <span>
                    <a href={s.url} className="text-link" rel="noopener">
                      {s.title}
                    </a>
                    <span className={styles.muted}>
                      {" "}
                      · {s.publisher} · {t(`sources.kind.${s.kind}`)} · {t("common:sources.accessed", { date: s.accessed })}
                      {s.archived ? ` · ${t("common:sources.archived")}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <details className={styles.ledger}>
              <summary>{t("sources.ledger", { n: d.facts.length })}</summary>
              <div className={styles.tableWrap}>
                <table className={styles.table} lang="en">
                  <thead>
                    <tr>
                      <th scope="col">{t("sources.colClaim")}</th>
                      <th scope="col">{t("sources.colConfidence")}</th>
                      <th scope="col">{t("sources.colSources")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.facts.map((f) => (
                      <tr key={f.id}>
                        <td>
                          {f.claim}
                          {f.notes && <span className={styles.note}>{f.notes}</span>}
                        </td>
                        <td>
                          <span className={styles.badge} data-c={f.confidence}>
                            {t(`sources.confidence.${f.confidence}`)}
                          </span>
                        </td>
                        <td className="numeral">
                          {f.sources.map((n, i) => (
                            <span key={n}>
                              <a href={`#about-src-${n}`}>{n}</a>
                              {i < f.sources.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </section>

          <section id="credits" className={styles.section} aria-labelledby="credits-title">
            <h2 id="credits-title" className={styles.h2}>
              {t("credits.title")}
            </h2>
            <h3 className={styles.h3}>{t("credits.images")}</h3>
            <ul className={styles.credits}>
              {d.images.map((img) => (
                <li key={img.id}>
                  <span lang="en">{img.subject}</span> — {img.attribution} ·{" "}
                  {img.licenseUrl ? (
                    <a href={img.licenseUrl} className="text-link" rel="license noopener">
                      {img.license}
                    </a>
                  ) : (
                    img.license
                  )}{" "}
                  ·{" "}
                  <a href={img.sourcePageUrl} className="text-link" rel="noopener">
                    {t("credits.source")}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.muted}>{t("credits.imagesNote")}</p>
            <h3 className={styles.h3}>{t("credits.fonts")}</h3>
            <ul className={styles.credits}>
              {FONT_CREDITS.map((f) => (
                <li key={f.name}>
                  <a href={f.url} className="text-link" rel="noopener">
                    {f.name}
                  </a>{" "}
                  — {f.by} · {f.license}
                </li>
              ))}
            </ul>
            <h3 className={styles.h3}>{t("credits.code")}</h3>
            <ul className={styles.credits}>
              {CODE_CREDITS.map((c) => (
                <li key={c.name}>
                  {c.name} · {c.license}
                </li>
              ))}
            </ul>
          </section>

          <section id="translation-status" className={styles.section} aria-labelledby="translation-title">
            <h2 id="translation-title" className={styles.h2}>
              {t("translation.title")}
            </h2>
            <p>{t("translation.intro")}</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">{t("translation.language")}</th>
                    <th scope="col">{t("translation.ui")}</th>
                    <th scope="col">{t("translation.home")}</th>
                    <th scope="col">{t("translation.history")}</th>
                    <th scope="col">{t("translation.other")}</th>
                  </tr>
                </thead>
                <tbody>
                  {d.status.map((row) => (
                    <tr key={row.code}>
                      <th scope="row">
                        <span lang={LOCALE_INFO[row.code].bcp47} className="lang-name">
                          {LOCALE_INFO[row.code].nativeName}
                        </span>
                        <span className={styles.muted} lang="en">
                          {" "}
                          · {LOCALE_INFO[row.code].englishName}
                        </span>
                      </th>
                      <td>
                        <span className={styles.badge} data-s={row.ui}>
                          {statusLabel(row.ui)}
                        </span>
                      </td>
                      {row.pages.map((s, i) => (
                        <td key={i}>
                          <span className={styles.badge} data-s={s}>
                            {statusLabel(s)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.muted}>{t("translation.legend")}</p>
            {!site.javaneseReviewer && <p className={styles.muted}>{t("translation.javanese")}</p>}
          </section>

          <section id="studio" className={styles.section} aria-labelledby="studio-title">
            <h2 id="studio-title" className={styles.h2}>
              {t("studio.title")}
            </h2>
            <p>
              {t("studio.body", { studio: site.studioName })}
              {site.studioUrl && (
                <>
                  {" "}
                  <a href={site.studioUrl} className="text-link">
                    {site.studioUrl}
                  </a>
                </>
              )}
              {site.contactEmail && (
                <>
                  {" "}
                  <a href={`mailto:${site.contactEmail}`} className="text-link">
                    {site.contactEmail}
                  </a>
                </>
              )}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
