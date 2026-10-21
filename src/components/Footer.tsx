import { Link } from "react-router";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { localePath } from "~/lib/paths";
import { site } from "~/site";
import { NAV_ITEMS, Wordmark } from "./Header";
import { LanguageList } from "./LanguageSelector";
import { HeritageDivider } from "./HeritageDivider";
import styles from "./Footer.module.css";

const BUILD_YEAR = new Date().getFullYear();

export function Footer() {
  const t = useT();
  const locale = useLocale();
  const studio = site.studioUrl ? (
    <a href={site.studioUrl} className="text-link">
      {site.studioName}
    </a>
  ) : (
    <strong>{site.studioName}</strong>
  );

  return (
    <footer className={`night ${styles.footer}`}>
      <div className="container">
        <HeritageDivider />
        <div className={styles.top}>
          <div className={styles.brand}>
            <Wordmark tone="light" />
            <p className={styles.disclaimer} id="disclaimer">
              {t("footer.disclaimer", { studio: site.studioName })}{" "}
              <a href="https://mangkunegaran.id" className="text-link" rel="noopener">
                mangkunegaran.id
              </a>
            </p>
          </div>

          <nav aria-label={t("footer.navLabel")} className={styles.col}>
            <p className={styles.colTitle}>{t("footer.explore")}</p>
            <ul>
              <li>
                <Link to={localePath(locale)}>{t("nav.home")}</Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <Link to={localePath(locale, item)}>{t(`nav.${item}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <p className={styles.colTitle}>{t("footer.project")}</p>
            <ul>
              <li>
                <Link to={localePath(locale, "about")}>{t("nav.about")}</Link>
              </li>
              <li>
                <Link to={`${localePath(locale, "about")}#sources`}>{t("footer.sources")}</Link>
              </li>
              <li>
                <Link to={`${localePath(locale, "about")}#credits`}>{t("footer.credits")}</Link>
              </li>
              <li>
                <Link to={`${localePath(locale, "about")}#translation-status`}>{t("footer.translationStatus")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <section className={styles.langs} aria-label={t("lang.label")}>
          <p className={styles.colTitle}>{t("lang.choose")}</p>
          <LanguageList compact />
        </section>

        <div className={styles.bottom}>
          <p>
            {t("footer.madeBy")} {studio} · {BUILD_YEAR}
          </p>
        </div>
      </div>
    </footer>
  );
}
