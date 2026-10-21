import { BatikOrnament } from "./BatikOrnament";
import styles from "./HeritageDivider.module.css";

/** Fine gold rule with a single kawung flower at its centre. Decorative. */
export function HeritageDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.divider} ${className}`} aria-hidden="true">
      <span className={styles.rule} />
      <BatikOrnament variant="flower" />
      <span className={styles.rule} />
    </div>
  );
}
