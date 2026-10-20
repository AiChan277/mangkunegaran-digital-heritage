import type { ReactNode } from "react";
import type { AksaraView } from "~/content/resolve";
import { ScriptTitle } from "./ScriptTitle";
import styles from "./PageHeader.module.css";

type Props = {
  eyebrow: string;
  title: string;
  aksara?: AksaraView;
  intro?: ReactNode;
  /** Large folio number shown in the margin, e.g. "02". */
  folio?: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, aksara, intro, folio, children }: Props) {
  return (
    <header className={`container ${styles.wrap}`}>
      <div className={`grid ${styles.grid}`}>
        {folio && (
          <span className={`${styles.folio} numeral`} aria-hidden="true">
            {folio}
          </span>
        )}
        <div className={styles.main}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <ScriptTitle aksara={aksara} />
        </div>
        {intro && <div className={`lead ${styles.intro}`}>{intro}</div>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </header>
  );
}
