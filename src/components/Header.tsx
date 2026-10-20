import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { localePath } from "~/lib/paths";
import { LanguageList, LanguageSelector } from "./LanguageSelector";
import styles from "./Header.module.css";

export const NAV_ITEMS = ["history", "architecture", "culture", "stories", "gallery", "visit"] as const;

export function Wordmark({ tone = "default" }: { tone?: "default" | "light" }) {
  const t = useT();
  return (
    <span className={`${styles.wordmark} ${tone === "light" ? styles.light : ""}`}>
      <span className={styles.wordmarkName}>Mangkunegaran</span>
      <span className={styles.wordmarkTag}>
        {t("brand.tagline")} · <span className={styles.concept}>{t("brand.concept")}</span>
      </span>
    </span>
  );
}

export function Header() {
  const t = useT();
  const locale = useLocale();
  const location = useLocation();
  const [compact, setCompact] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setCompact(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [location.pathname]);

  const openDrawer = () => dialogRef.current?.showModal();
  const closeDrawer = () => dialogRef.current?.close();

  const links = NAV_ITEMS.map((item) => (
    <li key={item}>
      <NavLink to={localePath(locale, item)} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {t(`nav.${item}`)}
      </NavLink>
    </li>
  ));

  return (
    <header className={styles.header} data-compact={compact}>
      <div className={`container ${styles.bar}`}>
        <Link to={localePath(locale)} className={styles.home}>
          <Wordmark />
          <span className="visually-hidden"> — {t("nav.home")}</span>
        </Link>

        <nav className={styles.nav} aria-label={t("nav.primary")}>
          <ul>{links}</ul>
        </nav>

        <div className={styles.tools}>
          <NavLink
            to={localePath(locale, "about")}
            className={({ isActive }) => `${styles.about} ${isActive ? styles.active : ""}`}
          >
            {t("nav.about")}
          </NavLink>
          <LanguageSelector />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          onClick={openDrawer}
          aria-haspopup="dialog"
        >
          <Menu aria-hidden="true" size={22} strokeWidth={1.75} />
          <span>{t("nav.menu")}</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.drawer}
        aria-label={t("nav.menu")}
        onClose={() => menuButtonRef.current?.focus()}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDrawer();
        }}
      >
        <div className={styles.drawerInner}>
          <div className={styles.drawerTop}>
            <Wordmark />
            <button type="button" className={styles.close} onClick={closeDrawer}>
              <X aria-hidden="true" size={22} strokeWidth={1.75} />
              <span className="visually-hidden">{t("nav.close")}</span>
            </button>
          </div>
          <nav aria-label={t("nav.primary")} className={styles.drawerNav}>
            <ul>
              <li>
                <NavLink to={localePath(locale)} end onClick={closeDrawer}>
                  {t("nav.home")}
                </NavLink>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <NavLink to={localePath(locale, item)} onClick={closeDrawer}>
                    {t(`nav.${item}`)}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to={localePath(locale, "about")} onClick={closeDrawer}>
                  {t("nav.about")}
                </NavLink>
              </li>
            </ul>
          </nav>
          <section className={styles.drawerLangs} aria-label={t("lang.label")}>
            <p className="eyebrow">{t("lang.choose")}</p>
            <LanguageList onPick={closeDrawer} />
          </section>
        </div>
      </dialog>
    </header>
  );
}
