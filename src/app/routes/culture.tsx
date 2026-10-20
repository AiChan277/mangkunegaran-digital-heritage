import type { Route } from "./+types/culture";
import { CULTURE } from "~/content/culture";
import { aksara, image, pick } from "~/content/resolve";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { buildRefs, pageSetup } from "~/lib/page";
import { PageHeader } from "~/components/PageHeader";
import { FallbackNotice } from "~/components/FallbackNotice";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { Picture } from "~/components/Picture";
import { ScriptTitle } from "~/components/ScriptTitle";
import { ListenButton } from "~/components/ListenButton";
import { Reveal } from "~/components/Reveal";
import styles from "./culture.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "culture", ["culture"]);
  const lang = content.lang;
  const features = CULTURE.map((f) => ({
    id: f.id,
    title: pick(f.title, lang),
    kicker: pick(f.kicker, lang),
    summary: pick(f.summary, lang),
    body: f.body.map((p) => pick(p, lang)),
    factIds: f.factIds,
    image: f.imageId ? image(f.imageId, lang) : null,
    caption: f.imageCaption ? pick(f.imageCaption, lang) : null,
    aksara: aksara(f.aksaraId),
    figures: f.figures ?? null,
  }));
  return {
    messages,
    content,
    features,
    aksara: aksara("kabudayan"),
    refs: buildRefs(features.flatMap((f) => f.factIds)),
    meta: buildMeta({
      locale,
      path: "culture",
      title: t("culture:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("culture:meta.description"),
      ogImage: "culture",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

type Figures = { label: string; value: number }[];

/** Typographic bar chart: stanzas per macapat metre. */
function StanzaChart({ figures, label, unit, total }: { figures: Figures; label: string; unit: string; total: string }) {
  const max = Math.max(...figures.map((f) => f.value));
  return (
    <figure className={styles.chart}>
      <figcaption className="eyebrow">{label}</figcaption>
      <dl>
        {figures.map((f) => (
          <div key={f.label} className={styles.bar}>
            <dt lang="jv">{f.label}</dt>
            <dd>
              <span className={styles.fill} style={{ transform: `scaleX(${f.value / max})` }} aria-hidden="true" />
              <span className={`${styles.value} numeral`}>
                {f.value} <span className="visually-hidden">{unit}</span>
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.total}>{total}</p>
    </figure>
  );
}

export default function Culture({ loaderData: d }: Route.ComponentProps) {
  const t = useT("culture");
  const locale = useLocale();
  const contentLang = d.content.lang !== locale ? d.content.lang : undefined;

  return (
    <>
      <FallbackNotice content={d.content} />
      <PageHeader eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="03" intro={t("header.intro")} />

      {d.features.map((f, i) => (
        <section
          key={f.id}
          id={f.id}
          className={`${styles.feature} ${styles[`layout${i % 4}`]}`}
          aria-labelledby={`${f.id}-title`}
        >
          <div className={`container grid ${styles.grid}`}>
            <header className={styles.head}>
              <p className="eyebrow" lang={contentLang}>
                <span className="numeral">{String(i + 1).padStart(2, "0")}</span> · {f.kicker}
              </p>
              <h2 id={`${f.id}-title`} className={styles.title} lang={contentLang}>
                {f.title}
              </h2>
              <ScriptTitle aksara={f.aksara} size="s" tone={i % 4 === 1 ? "light" : "default"} />
              <p className={styles.summary} lang={contentLang}>
                {f.summary}
              </p>
              <ListenButton text={[f.title, f.summary, ...f.body].join(". ")} lang={d.content.lang} label={f.title} />
            </header>
            <Reveal className={styles.body}>
              <div className="prose" lang={contentLang}>
                {f.body.map((p, j) => (
                  <p key={j}>
                    {p}
                    {j === f.body.length - 1 && <Refs factIds={f.factIds} byFact={d.refs.byFact} />}
                  </p>
                ))}
              </div>
            </Reveal>
            {f.image ? (
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  <Picture image={f.image} cover sizes="(max-width: 860px) 100vw, 50vw" />
                </div>
                <figcaption>
                  {f.caption && <span lang={contentLang}>{f.caption} </span>}
                  {f.image.attribution}
                </figcaption>
              </figure>
            ) : f.figures ? (
              <div className={styles.figure}>
                <StanzaChart
                  figures={f.figures}
                  label={t("stanzaChart")}
                  unit={t("stanzas")}
                  total={t("stanzaTotal", { n: f.figures.reduce((a, b) => a + b.value, 0) })}
                />
              </div>
            ) : null}
          </div>
        </section>
      ))}

      <div className="container">
        <SourceList sources={d.refs.sources} />
      </div>
    </>
  );
}
