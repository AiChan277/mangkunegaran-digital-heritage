import { Link } from "react-router";
import { Info } from "lucide-react";
import { LOCALE_INFO, type ContentLang } from "~/i18n/config";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { localePath } from "~/lib/paths";
import type { ContentState } from "~/lib/page";
import styles from "./FallbackNotice.module.css";

const CONTENT_NAMES: Record<ContentLang, string> = { id: "id", en: "en", jv: "jv" };

/**
 * Tells the visitor, in their language, when the editorial content on a
 * page is shown in another language or is an unreviewed AI draft.
 */
export function FallbackNotice({ content }: { content: ContentState }) {
  const t = useT();
  const locale = useLocale();
  if (!content.fallback && !content.draft) return null;
  const shownIn = LOCALE_INFO[CONTENT_NAMES[content.lang] as keyof typeof LOCALE_INFO].nativeName;
  const message = content.fallback
    ? t("fallback.notice", { language: LOCALE_INFO[locale].nativeName, shownIn })
    : t("fallback.draft");
  return (
    <aside className={`container ${styles.wrap}`} aria-label={t("fallback.label")}>
      <p className={styles.note}>
        <Info aria-hidden="true" size={18} strokeWidth={1.75} />
        <span>
          {message}{" "}
          <Link to={`${localePath(locale, "about")}#translation-status`} className="text-link">
            {t("fallback.link")}
          </Link>
        </span>
      </p>
    </aside>
  );
}
