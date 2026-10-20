import type { SourceView } from "~/content/resolve";
import { useT } from "~/i18n/useT";
import styles from "./SourceList.module.css";

type Props = { sources: SourceView[]; id?: string; title?: string };

export function SourceList({ sources, id = "sources", title }: Props) {
  const t = useT();
  if (!sources.length) return null;
  return (
    <section className={styles.wrap} aria-labelledby={`${id}-title`} id={id}>
      <h2 id={`${id}-title`} className={styles.title}>
        {title ?? t("sources.title")}
      </h2>
      <ol className={styles.list}>
        {sources.map((s, i) => (
          <li key={s.id} id={`src-${i + 1}`} className={styles.item}>
            <span className={`${styles.n} numeral`} aria-hidden="true">
              {i + 1}
            </span>
            <span>
              <a href={s.url} className="text-link" rel="noopener" lang={undefined}>
                {s.title}
              </a>
              <span className={styles.meta}>
                {" "}
                · {s.publisher}
                {s.published ? ` · ${t("sources.published", { date: s.published })}` : ""} ·{" "}
                {t("sources.accessed", { date: s.accessed })}
                {s.archived ? ` · ${t("sources.archived")}` : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
