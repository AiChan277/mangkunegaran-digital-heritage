import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import type { ArchiveView } from "~/lib/history-view";
import { Picture } from "./Picture";
import styles from "./ArchivalImage.module.css";

/**
 * An archival item shown as published by its institution (no filter, no
 * crop), on a plain mount, with title, catalogue date, creator,
 * institution, licence and a link to the catalogue record.
 */
export function ArchivalImage({
  item,
  sizes,
  variant = "full",
}: {
  item: ArchiveView;
  sizes: string;
  /** full = with description and notes; compact = provenance only */
  variant?: "full" | "compact" | "lead";
}) {
  const t = useT("history");
  const locale = useLocale();
  const langOf = (x?: { lang: string }) => (x && x.lang !== locale ? x.lang : undefined);
  if (!item.image) return null;
  return (
    <figure className={styles.figure} data-variant={variant}>
      <div className={styles.mount}>
        <Picture image={item.image} sizes={sizes} />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.title} lang={langOf(item.title)}>
          {item.title.text}
        </span>
        <span className={`${styles.date} numeral`} lang={langOf(item.dateLabel)}>
          {item.dateLabel.text}
        </span>
        {variant !== "compact" && (
          <span className={styles.desc} lang={langOf(item.description)}>
            {item.description.text}
          </span>
        )}
        <span className={styles.provenance}>
          {item.creator} · {item.institution} ·{" "}
          {item.licenseUrl ? (
            <a href={item.licenseUrl} className="text-link" rel="license noopener">
              {item.license}
            </a>
          ) : (
            item.license
          )}
        </span>
        <span className={styles.provenance}>
          <a href={item.recordUrl} className="text-link" rel="noopener">
            {t("archive.record")}
          </a>
          {item.mediaPageUrl && (
            <>
              {" · "}
              <a href={item.mediaPageUrl} className="text-link" rel="noopener">
                {t("archive.file")}
              </a>
            </>
          )}
        </span>
        {variant === "full" && item.note && (
          <span className={styles.note} lang={langOf(item.note)}>
            {item.note.text}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
