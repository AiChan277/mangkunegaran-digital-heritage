/**
 * "/" — picks a language and redirects on the client:
 * saved preference → navigator.languages → Indonesian.
 * The prerendered HTML is a plain list of language links, so it works
 * without JavaScript and serves as the x-default page.
 */
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/root-index";
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, isLocale, matchLocale } from "~/i18n/config";
import { readSavedLocale } from "~/lib/storage";
import { buildMeta } from "~/lib/meta";
import { HeritageDivider } from "~/components/HeritageDivider";
import { PageHero } from "~/components/PageHero";
import styles from "./root-index.module.css";

const TITLE = "Mangkunegaran — A Living Heritage · Concept";

export function loader() {
  return {
    meta: buildMeta({
      locale: "id",
      path: "",
      title: TITLE,
      siteTitle: TITLE,
      description:
        "Independent multilingual concept redesign about Pura Mangkunegaran, Surakarta — in 12 languages. Konsep desain ulang independen dalam 12 bahasa.",
    }).filter((m) => !("tagName" in m && m.rel === "canonical")),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function RootIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    const saved = readSavedLocale();
    const target = isLocale(saved ?? undefined) ? saved! : (matchLocale(navigator.languages ?? []) ?? DEFAULT_LOCALE);
    navigate(`/${target}`, { replace: true });
  }, [navigate]);

  return (
    <main id="main">
      {/* i18n-exempt: language-neutral entry page listing every locale by native name */}
      <PageHero
        variant="notice"
        eyebrow="Mangkunegaran — A Living Heritage · Concept"
        title={
          <>
            <span lang="id">Pilih bahasa</span> · <span lang="en">Choose a language</span>
          </>
        }
      />
      <div className={`container ${styles.wrap}`}>
      <HeritageDivider />
      <ul className={styles.list}>
        {LOCALES.map((code) => (
          <li key={code}>
            <Link to={`/${code}`} lang={LOCALE_INFO[code].bcp47} hrefLang={LOCALE_INFO[code].bcp47}>
              <span className={`${styles.native} lang-name`}>{LOCALE_INFO[code].nativeName}</span>
              <span className={styles.english} lang="en">
                {LOCALE_INFO[code].englishName}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        <span lang="id">Konsep desain ulang independen — tidak berafiliasi dengan Pura Mangkunegaran.</span>{" "}
        <span lang="en">Independent concept redesign — not affiliated with Pura Mangkunegaran.</span>
      </p>
      </div>
    </main>
  );
}
