import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router";
import { Check, Languages, X } from "lucide-react";
import { LOCALES, LOCALE_INFO, localeAvailability, type Locale } from "~/i18n/config";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { localePath, switchLocalePath } from "~/lib/paths";
import { saveLocale } from "~/lib/storage";
import styles from "./LanguageControl.module.css";

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

function matches(code: Locale, query: string): boolean {
  if (!query) return true;
  const info = LOCALE_INFO[code];
  const q = normalise(query.trim());
  return [info.nativeName, info.englishName, info.code, info.badge].some((s) => normalise(s).includes(q));
}

/**
 * Floating language control: a fixed button (bottom inline-end corner,
 * clear of safe-area insets) that opens a modal panel listing every
 * language by its native name, with a filter and a plain statement of how
 * complete each translation is. Uses <dialog>.showModal() for focus
 * containment, Esc and the top layer; focus returns to the button on close.
 */
export function LanguageControl() {
  const t = useT();
  const locale = useLocale();
  const { pathname, hash } = useLocation();
  const info = LOCALE_INFO[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const links = useRef(new Map<Locale, HTMLAnchorElement>());
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const titleId = useId();
  const noteId = useId();

  const shown = useMemo(() => LOCALES.filter((code) => matches(code, query)), [query]);

  // Close when the route changes (a language was picked).
  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [pathname]);

  const show = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    dialog.showModal();
    setOpen(true);
    // Start on the current language so Enter keeps it and arrows move from it.
    requestAnimationFrame(() => links.current.get(locale)?.focus());
  };

  const close = () => dialogRef.current?.close();

  const focusLink = (from: HTMLElement | null, step: number) => {
    const list = shown.map((code) => links.current.get(code)).filter((el): el is HTMLAnchorElement => !!el);
    if (!list.length) return;
    const i = from ? list.indexOf(from as HTMLAnchorElement) : -1;
    const next = i < 0 ? (step > 0 ? 0 : list.length - 1) : (i + step + list.length) % list.length;
    list[next]?.focus();
  };

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const active = document.activeElement as HTMLElement | null;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusLink(active, 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusLink(active, -1);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      focusLink(null, e.key === "Home" ? 1 : -1);
    } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Typing anywhere in the list goes to the filter.
      e.preventDefault();
      setQuery((q) => q + e.key);
      searchRef.current?.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.fab}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={show}
      >
        <Languages aria-hidden="true" size={20} strokeWidth={1.75} />
        <span className={styles.fabCode}>{info.badge}</span>
        <span className="visually-hidden">
          {" "}
          — {t("lang.open")}. {t("lang.current", { language: info.nativeName })}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        aria-describedby={noteId}
        onClose={() => {
          setOpen(false);
          buttonRef.current?.focus();
        }}
        onClick={(e) => {
          // A click on the backdrop lands on the <dialog> itself.
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.head}>
            <h2 id={titleId} className={styles.title}>
              {t("lang.label")}
            </h2>
            <button type="button" className={styles.close} onClick={close}>
              <X aria-hidden="true" size={20} strokeWidth={1.75} />
              <span className="visually-hidden">{t("lang.close")}</span>
            </button>
          </div>

          <p className={styles.current}>
            {t("lang.currentLabel")}{" "}
            <strong lang={info.bcp47} className="lang-name">
              {info.nativeName}
            </strong>
          </p>

          <div className={styles.search}>
            <label htmlFor={`${titleId}-q`} className={styles.searchLabel}>
              {t("lang.filter")}
            </label>
            <input
              ref={searchRef}
              id={`${titleId}-q`}
              type="search"
              className={styles.searchInput}
              value={query}
              placeholder={t("lang.filterHint")}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setQuery(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  focusLink(null, 1);
                }
              }}
            />
          </div>

          <p className={styles.count} role="status">
            {shown.length ? t("lang.count", { count: String(shown.length) }) : t("lang.none", { query })}
          </p>

          <ul className={styles.list} onKeyDown={onListKey}>
            {shown.map((code) => {
              const l = LOCALE_INFO[code];
              const current = code === locale;
              const availability = localeAvailability(code);
              return (
                <li key={code}>
                  <Link
                    ref={(el) => {
                      if (el) links.current.set(code, el);
                      else links.current.delete(code);
                    }}
                    to={`${switchLocalePath(pathname, code)}${hash}`}
                    hrefLang={l.bcp47}
                    aria-current={current ? "true" : undefined}
                    className={styles.option}
                    data-availability={availability}
                    onClick={() => {
                      saveLocale(code);
                      close();
                    }}
                    preventScrollReset
                  >
                    <span className={styles.names}>
                      <span lang={l.bcp47} className={`${styles.native} lang-name`}>
                        {l.nativeName}
                      </span>
                      {l.englishName !== l.nativeName && (
                        <span className={styles.english} lang="en">
                          {l.englishName}
                        </span>
                      )}
                    </span>
                    <span className={styles.availability}>
                      <span className={styles.dot} aria-hidden="true" />
                      {t(`lang.availability.${availability}`)}
                    </span>
                    {current && <Check aria-hidden="true" size={18} className={styles.check} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p id={noteId} className={styles.note}>
            {t("lang.explain")}{" "}
            <Link to={`${localePath(locale, "about")}#translation-status`} className="text-link" onClick={close}>
              {t("fallback.link")}
            </Link>
          </p>
        </div>
      </dialog>
    </>
  );
}
