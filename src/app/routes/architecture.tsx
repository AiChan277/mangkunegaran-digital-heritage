import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Route } from "./+types/architecture";
import { SPACES } from "~/content/spaces";
import { aksara, image, pick } from "~/content/resolve";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { buildRefs, pageSetup } from "~/lib/page";
import { localePath } from "~/lib/paths";
import { PageHero } from "~/components/PageHero";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { Picture } from "~/components/Picture";
import { ScriptTitle } from "~/components/ScriptTitle";
import { ListenButton } from "~/components/ListenButton";
import { Reveal } from "~/components/Reveal";
import styles from "./architecture.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "architecture", ["architecture"]);
  const lang = content.lang;
  const spaces = [...SPACES]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      id: s.id,
      order: s.order,
      name: s.name,
      kicker: pick(s.kicker, lang),
      summary: pick(s.summary, lang),
      body: s.body.map((p) => pick(p, lang)),
      factIds: s.factIds,
      aksara: aksara(s.aksaraId),
      image: s.imageId ? image(s.imageId, lang) : null,
    }));
  return {
    messages,
    content,
    spaces,
    aksara: aksara("wewangunan"),
    heroImage: image("pendhapa-interior", content.lang),
    archival: image("pendhapa-archival", lang),
    refs: buildRefs([...spaces.flatMap((s) => s.factIds), "f-palace-1757", "f-sequence"]),
    meta: buildMeta({
      locale,
      path: "architecture",
      title: t("architecture:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("architecture:meta.description"),
      ogImage: "architecture",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

/** Original line diagram of the spatial sequence (studio artwork, not a survey). */
function SequenceDiagram({ names }: { names: string[] }) {
  const xs = [60, 230, 400, 570];
  return (
    <svg viewBox="0 0 640 170" className={styles.diagram} role="img" aria-labelledby="seq-title">
      <title id="seq-title">{names.join(" → ")}</title>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M10 120h620" strokeDasharray="2 6" />
        {/* Pamedan: open field */}
        <rect x="20" y="96" width="80" height="24" />
        {/* Pendhapa Ageng: tiered joglo roof on columns */}
        <path d="M170 120V88M290 120V88M160 88h140l-30-22h-80zM200 66l14-14h32l14 14M222 52l8-8 8 8" />
        {/* Pringgitan: low veranda */}
        <path d="M360 120v-20h80v20M352 100h96" />
        {/* Dalem Ageng: limasan house */}
        <path d="M520 120V86h100v34M510 86l40-30h40l40 30" />
      </g>
      <g className={styles.diagramLabels}>
        {names.map((n, i) => (
          <text key={n} x={xs[i]} y="150" textAnchor="middle">
            {String(i + 1).padStart(2, "0")} {n}
          </text>
        ))}
      </g>
    </svg>
  );
}

export default function Architecture({ loaderData: d }: Route.ComponentProps) {
  const t = useT("architecture");
  const locale = useLocale();
  const contentLang = d.content.lang !== locale ? d.content.lang : undefined;

  return (
    <>
      <PageHero variant="architecture" eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="02" intro={t("header.intro")} media={d.heroImage}>
        <SequenceDiagram names={d.spaces.slice(0, 4).map((s) => s.name)} />
        <p className={styles.note}>
          {t("header.note")}{" "}
          <Link to={localePath(locale, "visit")} className="text-link">
            {t("header.visitLink")}
          </Link>
        </p>
      </PageHero>

      <nav className={`container ${styles.toc}`} aria-label={t("tocLabel")}>
        <ol>
          {d.spaces.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                <span className="numeral">{String(s.order).padStart(2, "0")}</span> {s.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {d.spaces.map((s, i) => (
        <section key={s.id} id={s.id} className={`${styles.space} ${i % 2 ? styles.flip : ""}`} aria-labelledby={`${s.id}-title`}>
          <div className={`container grid ${styles.grid}`}>
            <div className={styles.head}>
              <span className={`${styles.num} numeral`} aria-hidden="true">
                {String(s.order).padStart(2, "0")}
              </span>
              <p className="eyebrow" lang={contentLang}>
                {s.kicker}
              </p>
              <h2 id={`${s.id}-title`} className={styles.title}>
                {s.name}
              </h2>
              <ScriptTitle aksara={s.aksara} size="s" />
              <ListenButton text={[s.name, ...s.body].join(". ")} lang={d.content.lang} label={s.name} />
            </div>
            <Reveal className={`prose ${styles.body}`}>
              <div lang={contentLang} className="prose">
                <p className={styles.summary}>{s.summary}</p>
                {s.body.map((p, j) => (
                  <p key={j}>
                    {p}
                    {j === s.body.length - 1 && <Refs factIds={s.factIds} byFact={d.refs.byFact} />}
                  </p>
                ))}
              </div>
            </Reveal>
            {s.image && (
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  <Picture image={s.image} cover sizes="(max-width: 860px) 100vw, 55vw" />
                </div>
                <figcaption>{s.image.attribution}</figcaption>
              </figure>
            )}
          </div>
        </section>
      ))}

      <section className={`container section ${styles.archival}`} aria-labelledby="archival-title">
        <div className="grid">
          <figure className={styles.archivalFigure}>
            <Picture image={d.archival} sizes="(max-width: 860px) 100vw, 66vw" />
            <figcaption>
              {d.archival.dated} · {d.archival.attribution}
            </figcaption>
          </figure>
          <div className={styles.archivalText}>
            <h2 id="archival-title" className={styles.title}>
              {t("archival.title")}
            </h2>
            <p>{t("archival.body")}</p>
            <Link to={localePath(locale, "gallery")} className="arrow-link">
              {t("archival.cta")} <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <SourceList sources={d.refs.sources} />
      </div>
    </>
  );
}
