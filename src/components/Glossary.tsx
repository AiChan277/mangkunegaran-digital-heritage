import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { GlossaryView } from "~/content/resolve";
import { useT } from "~/i18n/useT";
import styles from "./Glossary.module.css";

export const GlossaryContext = createContext<GlossaryView>({});

/** A Javanese term with a sourced definition on hover, focus or tap. */
export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const glossary = useContext(GlossaryContext);
  const entry = glossary[id];
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const label = children ?? entry?.term ?? id;
  if (!entry) return <span lang="jv">{label}</span>;

  return (
    <span className={styles.wrap} ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className={styles.term}
        lang="jv"
        aria-expanded={open}
        aria-controls={panelId}
        aria-describedby={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {label}
        <span className="visually-hidden"> ({t("glossary.hint")})</span>
      </button>
      <span id={panelId} role="note" className={styles.panel} hidden={!open}>
        <span className={styles.panelTerm} lang="jv">
          {entry.term}
        </span>
        {entry.definition}
      </span>
    </span>
  );
}

const TOKEN = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\*([^*]+)\*/g;

/** Render editorial text with [[term|label]] glossary links and *emphasis*. */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<Term key={key++} id={m[1]}>{m[2]}</Term>);
    else if (m[3]) out.push(<em key={key++}>{m[3]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Plain text version (for speech and reading time). */
export function plainText(text: string): string {
  return text.replace(TOKEN, (_m, id: string, label: string, em: string) => label ?? em ?? id);
}
