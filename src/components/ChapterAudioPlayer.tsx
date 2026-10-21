import { useId, useRef, useState, type CSSProperties } from "react";
import { Headphones, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { LOCALE_INFO, isLocale } from "~/i18n/config";
import { useT } from "~/i18n/useT";
import styles from "./ChapterAudioPlayer.module.css";

export type ChapterAudioView = {
  lang: string;
  status: "script-draft" | "ready-for-recording" | "recorded" | "reviewed" | "published";
  audioUrl?: string;
  durationSeconds?: number;
  credits: { role: string; name: string }[];
  /** Narration text from the script, by section. */
  transcript: { title: string; paragraphs: string[] }[];
};

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

type LoadState = "idle" | "loading" | "ready" | "error";

/** Real controls; rendered only when a recording exists. */
function Controls({ track }: { track: ChapterAudioView & { audioUrl: string } }) {
  const t = useT("history");
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(track.durationSeconds ?? 0);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState<LoadState>("idle");

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setState((s) => (s === "ready" ? s : "loading"));
      el.play().catch(() => setState("error"));
    } else el.pause();
  };

  return (
    <div className={styles.controls} data-state={state}>
      <audio
        ref={ref}
        src={track.audioUrl}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setState("ready");
        }}
        onWaiting={() => setState("loading")}
        onCanPlay={() => setState("ready")}
        onError={() => setState("error")}
      />
      <button type="button" className={styles.play} onClick={toggle} disabled={state === "error"}>
        {playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
        <span className="visually-hidden">{playing ? t("audio.pause") : t("audio.play")}</span>
      </button>
      <input
        type="range"
        className={styles.seek}
        min={0}
        max={Math.max(duration, 0.1)}
        step={1}
        value={Math.min(time, duration || 0)}
        aria-label={t("audio.seek")}
        aria-valuetext={t("audio.time", { current: clock(time), total: clock(duration) })}
        style={{ "--progress": `${duration ? (time / duration) * 100 : 0}%` } as CSSProperties}
        onChange={(e) => {
          if (ref.current) ref.current.currentTime = Number(e.currentTarget.value);
        }}
        disabled={state === "error"}
      />
      <span className={`${styles.time} numeral`} aria-hidden="true">
        {t("audio.time", { current: clock(time), total: clock(duration) })}
      </span>
      <button
        type="button"
        className={styles.icon}
        aria-pressed={muted}
        onClick={() => {
          if (!ref.current) return;
          ref.current.muted = !ref.current.muted;
          setMuted(ref.current.muted);
        }}
      >
        {muted ? <VolumeX aria-hidden="true" size={18} /> : <Volume2 aria-hidden="true" size={18} />}
        <span className="visually-hidden">{t("audio.mute")}</span>
      </button>
      <p className={styles.live} role="status">
        {state === "loading" ? t("audio.loading") : state === "error" ? t("audio.error") : ""}
      </p>
    </div>
  );
}

/**
 * Narration for one History chapter. With no recording it shows a plain
 * "not yet recorded" state — no play button, duration or waveform — and the
 * chapter stays complete without it. The narration text sits behind a
 * disclosure, labelled as a script until a recording exists.
 */
export function ChapterAudioPlayer({
  chapterId,
  chapterTitle,
  tracks,
  initialLang,
}: {
  chapterId: string;
  chapterTitle: string;
  tracks: ChapterAudioView[];
  initialLang: string;
}) {
  const t = useT("history");
  const [lang, setLang] = useState(tracks.some((x) => x.lang === initialLang) ? initialLang : tracks[0]!.lang);
  const group = useId();
  const track = tracks.find((x) => x.lang === lang) ?? tracks[0]!;
  const recorded = !!track.audioUrl;
  const name = (code: string) => (isLocale(code) ? LOCALE_INFO[code].nativeName : code);

  return (
    <section className={styles.player} aria-label={t("audio.region", { chapter: chapterTitle })} data-chapter={chapterId}>
      <div className={styles.head}>
        <p className={styles.label}>
          <Headphones aria-hidden="true" size={18} />
          {t("audio.label")}
        </p>
        {tracks.length > 1 && (
          <fieldset className={styles.langs}>
            <legend className="visually-hidden">{t("audio.lang")}</legend>
            {tracks.map((x) => (
              <label key={x.lang} className={styles.langOption}>
                <input type="radio" name={group} value={x.lang} checked={x.lang === lang} onChange={() => setLang(x.lang)} />
                <span lang={x.lang}>{name(x.lang)}</span>
              </label>
            ))}
          </fieldset>
        )}
      </div>

      {recorded ? (
        <Controls key={track.lang} track={track as ChapterAudioView & { audioUrl: string }} />
      ) : (
        <p className={styles.unavailable}>
          <span className={styles.badge}>{t("audio.unavailable")}</span>
          <span>{t("audio.unavailableBody")}</span>
        </p>
      )}

      {recorded && track.credits.length > 0 && (
        <p className={styles.credits}>
          {track.credits.map((c) => (
            <span key={c.role}>
              {c.role}: {c.name}
            </span>
          ))}
        </p>
      )}

      {track.transcript.length > 0 && (
        <details className={styles.transcript}>
          <summary>
            {recorded ? t("audio.transcript") : t("audio.script")} <span lang={track.lang}>· {name(track.lang)}</span>
          </summary>
          <div className={styles.transcriptBody} lang={track.lang}>
            {track.transcript.map((sec) => (
              <div key={sec.title}>
                <p className={styles.sectionTitle}>{sec.title}</p>
                {sec.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
