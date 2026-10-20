import type { AksaraView } from "~/content/resolve";
import { useT } from "~/i18n/useT";
import styles from "./ScriptTitle.module.css";

type Props = { aksara?: AksaraView; tone?: "default" | "light"; size?: "s" | "m" | "l" };

/**
 * Aksara Jawa line shown beside a Latin title. The Latin heading carries the
 * accessible name, so the script line is presentational for screen readers;
 * a visible note says whether the transliteration has been reviewed.
 */
export function ScriptTitle({ aksara, tone = "default", size = "m" }: Props) {
  const t = useT();
  if (!aksara) return null;
  return (
    <p className={`${styles.wrap} ${styles[tone]} ${styles[size]}`}>
      <span lang="jv-Java" className={styles.script} aria-hidden="true" title={aksara.latin}>
        {aksara.javanese}
      </span>
      <span className={styles.note}>
        {t("aksara.label")}
        {aksara.reviewed ? "" : ` · ${t("aksara.awaiting")}`}
      </span>
    </p>
  );
}
