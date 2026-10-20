/**
 * Site-wide 404 for paths outside any locale (served as /404.html).
 * The locale is unknown here, so the page is bilingual (Indonesian/English)
 * and lists every language by its native name.
 */
import { Link } from "react-router";
import type { Route } from "./+types/not-found";
import { LOCALES, LOCALE_INFO } from "~/i18n/config";
import { Ornament } from "~/components/Ornament";
import styles from "./not-found.module.css";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "404 — Mangkunegaran · A Living Heritage (Concept)" },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFound() {
  return (
    <main id="main" className={`container ${styles.wrap}`}>
      {/* i18n-exempt: language-neutral fallback page */}
      <p className={`${styles.code} numeral`} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>
        <span lang="id">Halaman tidak ditemukan</span>
        <br />
        <span lang="en">Page not found</span>
      </h1>
      <Ornament />
      <ul className={styles.list}>
        {LOCALES.map((code) => (
          <li key={code}>
            <Link to={`/${code}`} lang={LOCALE_INFO[code].bcp47} hrefLang={LOCALE_INFO[code].bcp47} className="lang-name">
              {LOCALE_INFO[code].nativeName}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
