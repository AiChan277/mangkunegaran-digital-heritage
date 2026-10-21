import type { ReactNode } from "react";
import type { AksaraView, ImageView } from "~/content/resolve";
import { BatikOrnament } from "./BatikOrnament";
import { Picture } from "./Picture";
import { ScriptTitle } from "./ScriptTitle";
import styles from "./PageHero.module.css";

export type HeroVariant =
  | "history"
  | "architecture"
  | "culture"
  | "stories"
  | "gallery"
  | "visit"
  | "about"
  | "article"
  | "notice";

type Props = {
  variant: HeroVariant;
  eyebrow: string;
  title: ReactNode;
  /** `lang` for a title shown in a fallback language. */
  titleLang?: string;
  aksara?: AksaraView;
  intro?: ReactNode;
  introLang?: string;
  /** Large folio number, e.g. "02". */
  folio?: string;
  /** One photograph beside the text (architecture, culture, history). */
  media?: ImageView;
  /** Several small archival images in a row (gallery). */
  strip?: ImageView[];
  /** Shown before the eyebrow (e.g. a back link). */
  lead?: ReactNode;
  /** Extra content under the intro (diagram, actions, disclaimer). */
  children?: ReactNode;
};

/**
 * Shared royal-green page hero. Every public page uses it with a
 * page-specific variant, so the identity stays consistent while the
 * composition changes: photographic (architecture, culture), archival
 * (history, gallery), literary (stories, article), practical (visit),
 * institutional (about). The hero ends in a thin kawung border and a
 * gold hairline before the paper content begins.
 */
export function PageHero({ variant, lead, eyebrow, title, titleLang, aksara, intro, introLang, folio, media, strip, children }: Props) {
  const hasMedia = !!media;
  return (
    <header className={`on-royal ${styles.hero}`} data-variant={variant} data-media={hasMedia}>
      <BatikOrnament variant="field" className={styles.field} />
      <div className={`container grid ${styles.grid}`}>
        {folio && (
          <span className={`${styles.folio} numeral`} aria-hidden="true">
            {folio}
          </span>
        )}
        <div className={styles.main}>
          {lead}
          {variant === "stories" || variant === "article" ? <BatikOrnament variant="flower" className={styles.mark} /> : null}
          <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
          <h1 className={styles.title} lang={titleLang}>
            {title}
          </h1>
          <ScriptTitle aksara={aksara} />
          {intro && (
            <div className={`lead ${styles.intro}`} lang={introLang}>
              {intro}
            </div>
          )}
          {children && <div className={styles.extra}>{children}</div>}
        </div>

        {media && (
          <figure className={styles.media}>
            <div className={styles.frame}>
              <Picture image={media} cover priority sizes="(max-width: 860px) 100vw, 40vw" />
            </div>
            <figcaption className={styles.credit}>
              {media.dated ? `${media.dated} · ` : ""}
              {media.attribution}
            </figcaption>
          </figure>
        )}

        {strip && strip.length > 0 && (
          <ul className={styles.strip}>
            {strip.map((img) => (
              <li key={img.id}>
                <figure>
                  <div className={styles.stripFrame}>
                    <Picture image={img} cover eager sizes="(max-width: 860px) 33vw, 18vw" />
                  </div>
                  <figcaption className={styles.credit}>{img.dated ?? ""}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
      <HeroEdge />
    </header>
  );
}

/** The hero's lower edge: a kawung row and a gold hairline. */
export function HeroEdge() {
  return (
    <div className={styles.edge} aria-hidden="true">
      <BatikOrnament variant="border" />
    </div>
  );
}

/** The low-contrast kawung field used behind hero text. */
export function HeroField({ className = "" }: { className?: string }) {
  return <BatikOrnament variant="field" className={`${styles.field} ${className}`} />;
}
