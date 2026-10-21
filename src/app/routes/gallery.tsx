import { lazy, Suspense, useCallback, useRef, useState } from "react";
import type { Route } from "./+types/gallery";
import { ASSETS } from "~/content/assets";
import { aksara, image } from "~/content/resolve";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { pageSetup } from "~/lib/page";
import { PageHero } from "~/components/PageHero";
import { Picture } from "~/components/Picture";
import styles from "./gallery.module.css";

const Lightbox = lazy(() => import("~/components/Lightbox"));

/** Curated order; derived crops are left out (their source is shown instead). */
const ORDER = [
  "pendhapa-grand",
  "kumudawati",
  "dancers-female",
  "pendhapa-archival",
  "gamelan",
  "stained-glass",
  "pringgitan",
  "wayang-beber",
  "gamelan-archival",
  "pracima-tuin",
  "pendhapa-floor",
  "legion-archival",
  "dancers-male",
  "pracimayasa-garden",
  "aerial-archival",
  "crafts",
  "gate",
  "wayang-archival",
  "pamedan",
  "gate-archival",
  "pendhapa-interior",
];

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "gallery", ["gallery"]);
  const known = new Set(ASSETS.map((a) => a.id));
  const images = ORDER.filter((id) => known.has(id)).map((id) => image(id, content.lang === "jv" ? "id" : content.lang));
  return {
    messages,
    content,
    images,
    aksara: aksara("galeri"),
    strip: ["arc-pendhapa-1874", "arc-gamelan-arnhem-1879", "arc-palace-1902"].map((id) => image(id, content.lang)),
    meta: buildMeta({
      locale,
      path: "gallery",
      title: t("gallery:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("gallery:meta.description"),
      ogImage: "gallery",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function Gallery({ loaderData: d }: Route.ComponentProps) {
  const t = useT("gallery");
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setIndex((current) => {
      if (current !== null) requestAnimationFrame(() => triggers.current[current]?.focus());
      return null;
    });
  }, []);

  return (
    <>
      <PageHero variant="gallery" eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="05" intro={t("header.intro")} strip={d.strip} />
      <section className="container" aria-label={t("gridLabel")}>
        <ul className={styles.mosaic}>
          {d.images.map((img, i) => {
            const ratio = img.width / img.height;
            const shape = ratio > 1.9 ? styles.pano : ratio < 0.9 ? styles.tall : ratio > 1.45 ? styles.wide : styles.std;
            return (
              <li key={img.id} className={`${styles.tile} ${shape}`}>
                <button
                  ref={(el) => {
                    triggers.current[i] = el;
                  }}
                  type="button"
                  className={styles.open}
                  onClick={() => setIndex(i)}
                  aria-haspopup="dialog"
                >
                  <span className="visually-hidden">{t("open", { title: img.alt })}</span>
                  <Picture image={img} cover decorative priority={i === 0} eager={i < 4} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  {img.archival && <span className={styles.badge}>{t("archival")}</span>}
                </button>
                <p className={styles.caption}>
                  {img.dated ? `${img.dated} · ` : ""}
                  {img.author}
                  <span className={styles.license}> · {img.license}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </section>
      {index !== null && (
        <Suspense fallback={null}>
          <Lightbox
            images={d.images}
            index={index}
            onIndex={setIndex}
            onClose={close}
            labels={{
              dialog: t("dialogLabel"),
              close: t("close"),
              prev: t("prev"),
              next: t("next"),
              counter: (current: number, total: number) => t("counter", { current, total }),
              source: t("source"),
              license: t("license"),
            }}
          />
        </Suspense>
      )}
      <div className={`container ${styles.note}`}>
        <p>{t("note")}</p>
      </div>
    </>
  );
}
