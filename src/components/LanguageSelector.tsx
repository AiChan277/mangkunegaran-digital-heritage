import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, Languages } from "lucide-react";
import { LOCALES, LOCALE_INFO, uiStatus, type Locale } from "~/i18n/config";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { switchLocalePath } from "~/lib/paths";
import { saveLocale } from "~/lib/storage";
import styles from "./LanguageSelector.module.css";

/** The list of language links, shared by the dropdown, drawer and footer. */
export function LanguageList({
  onPick,
  itemRef,
  compact = false,
}: {
  onPick?: () => void;
  itemRef?: (el: HTMLAnchorElement | null, index: number) => void;
  compact?: boolean;
}) {
  const t = useT();
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
              {uiStatus(code) === "ai-draft" && !compact && <span className={styles.status}>{t("lang.draft")}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function LanguageSelector() {
  const t = useT();
  const locale = useLocale();
  const info = LOCALE_INFO[locale];
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const typed = useRef({ text: "", at: 0 });
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    items.current[LOCALES.indexOf(locale)]?.focus();
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, locale]);

  const focusAt = (i: number) => {
    const n = LOCALES.length;
    items.current[((i % n) + n) % n]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    const idx = items.current.findIndex((el) => el === document.activeElement);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusAt(idx + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusAt(idx - 1);
        break;
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(LOCALES.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && e.key.trim()) {
          const now = Date.now();
          typed.current.text = now - typed.current.at > 700 ? e.key : typed.current.text + e.key;
          typed.current.at = now;
          const q = typed.current.text.toLowerCase();
          const match = LOCALES.findIndex((code: Locale) => {
            const l = LOCALE_INFO[code];
            return [l.nativeName, l.englishName, l.badge].some((s) => s.toLowerCase().startsWith(q));
          });
          if (match >= 0) focusAt(match);
        }
    }
  };

  return (
    <div className={styles.wrap} ref={wrapRef} onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Languages aria-hidden="true" size={18} strokeWidth={1.75} />
        <span className="visually-hidden">{t("lang.label")}: </span>
        <span lang={info.bcp47} className="lang-name">
          {info.nativeName}
        </span>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={1.75} className={styles.chev} data-open={open} />
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <p className={styles.panelTitle}>{t("lang.choose")}</p>
        <LanguageList
          onPick={() => setOpen(false)}
          itemRef={(el, i) => {
            items.current[i] = el;
          }}
        />
      </div>
    </div>
  );
}
