import { useEffect, useState } from "react";
import { Pause, Square, Volume2 } from "lucide-react";
import { useLocation } from "react-router";
import { useSpeech } from "~/hooks/useSpeech";
import { useT } from "~/i18n/useT";
import styles from "./ListenButton.module.css";

type Props = {
  /** Plain text to read aloud. */
  text: string;
  /** Language of that text (the content language, not the UI language). */
  lang: string;
  /** Short name of what will be read, for the accessible label. */
  label?: string;
};

/**
 * "Listen" control. Renders nothing on the server and nothing when the
 * browser has no voice for the language — never a dead button.
 */
export function ListenButton({ text, lang, label }: Props) {
  const t = useT();
  const { available, state, play, pause, stop } = useSpeech(lang);
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Stop reading when the visitor navigates away.
  useEffect(() => stop, [location.pathname, stop]);

  if (!mounted || !available) return null;
  const name = label ?? t("listen.thisSection");
  return (
    <span className={`${styles.wrap} no-print`} data-state={state}>
      {state === "playing" ? (
        <button type="button" className={styles.btn} onClick={pause} aria-label={t("listen.pause", { name })}>
          <Pause aria-hidden="true" size={18} strokeWidth={1.75} />
          <span className={styles.text}>{t("listen.pauseShort")}</span>
        </button>
      ) : (
        <button
          type="button"
          className={styles.btn}
          onClick={() => play(text)}
          aria-label={state === "paused" ? `${t("listen.resumeShort")} — ${name}` : t("listen.play", { name })}
        >
          <Volume2 aria-hidden="true" size={18} strokeWidth={1.75} />
          <span className={styles.text}>{state === "paused" ? t("listen.resumeShort") : t("listen.playShort")}</span>
        </button>
      )}
      {state !== "idle" && (
        <button type="button" className={styles.btn} onClick={stop} aria-label={t("listen.stop")}>
          <Square aria-hidden="true" size={16} strokeWidth={1.75} />
        </button>
      )}
      <span className="visually-hidden" aria-live="polite">
        {state === "playing" ? t("listen.statusPlaying") : ""}
      </span>
    </span>
  );
}
