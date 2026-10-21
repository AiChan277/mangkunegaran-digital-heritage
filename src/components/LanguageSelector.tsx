import { Link, useLocation } from "react-router";
import { LOCALES, LOCALE_INFO } from "~/i18n/config";
import { useLocale } from "~/i18n/useLocale";
import { switchLocalePath } from "~/lib/paths";
import { saveLocale } from "~/lib/storage";
import styles from "./LanguageSelector.module.css";

/**
 * Plain list of language links, used in the footer so every page links to
 * every language without JavaScript. The main control is LanguageControl.
 */
export function LanguageList({
  onPick,
  itemRef,
  compact = false,
}: {
  onPick?: () => void;
  itemRef?: (el: HTMLAnchorElement | null, index: number) => void;
  compact?: boolean;
}) {
  const locale = useLocale();
  const { pathname } = useLocation();
  return (
    <ul className={`${styles.list} ${compact ? styles.compact : ""}`}>
      {LOCALES.map((code, i) => {
        const info = LOCALE_INFO[code];
        const current = code === locale;
        return (
          <li key={code}>
            <Link
              ref={(el) => itemRef?.(el, i)}
              to={switchLocalePath(pathname, code)}
              lang={info.bcp47}
              hrefLang={info.bcp47}
              aria-current={current ? "true" : undefined}
              className={styles.option}
              onClick={() => {
                saveLocale(code);
                onPick?.();
              }}
              preventScrollReset
            >
              <span className={styles.badge} aria-hidden="true">
                {info.badge}
              </span>
              <span className={styles.names}>
                <span className={`${styles.native} lang-name`}>{info.nativeName}</span>
                {info.tier === 3 && !compact && (
                  <span className={styles.english} lang="en">
                    {info.englishName}
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
