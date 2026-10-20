/**
 * Interactive schematic site plan. Original studio drawing — not traced from
 * any official, copyrighted or satellite plan, and not to scale. Hotspots are
 * real buttons; the same places are listed below the plan as text, so the
 * information never depends on seeing the drawing.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, X } from "lucide-react";
import type { AksaraView, ImageView } from "~/content/resolve";
import type { Etiquette } from "~/content/schema";
import { Picture } from "./Picture";
import { Pictogram } from "./Pictogram";
import { ScriptTitle } from "./ScriptTitle";
import styles from "./SitePlan.module.css";

export type PlanPlace = {
  id: string;
  order: number;
  name: string;
  summary: string;
  x: number;
  y: number;
  aksara?: AksaraView;
  image: ImageView | null;
  rules: { id: string; icon: Etiquette["icon"]; label: string }[];
  href: string;
};

type Labels = {
  title: string;
  gate: string;
  legend: string;
  close: string;
  more: string;
  rules: string;
  select: (name: string) => string;
  disclaimer: string;
};

export function SitePlan({ places, labels, contentLang }: { places: PlanPlace[]; labels: Labels; contentLang?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const current = places.find((p) => p.id === active) ?? null;

  useEffect(() => {
    if (!current) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        lastTrigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current]);

  const select = (id: string, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setActive((v) => (v === id ? null : id));
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.planCol}>
        <div className={styles.plan}>
          <svg viewBox="0 0 100 120" className={styles.drawing} aria-hidden="true" focusable="false" preserveAspectRatio="none">
            {/* Outer wall */}
            <rect x="4" y="2" width="92" height="110" className={styles.wall} />
            {/* Western garden (Pracima Tuin) */}
            <rect x="7" y="26" width="18" height="24" className={styles.garden} />
            {/* Pamedan: open field */}
            <rect x="28" y="80" width="44" height="22" className={styles.field} />
            {/* Pendhapa Ageng: large square hall */}
            <rect x="34" y="52" width="32" height="20" className={styles.hall} />
            <rect x="42" y="57" width="16" height="10" className={styles.hallInner} />
            {/* Pringgitan: veranda */}
            <rect x="38" y="40" width="24" height="6" className={styles.hall} />
            {/* Dalem Ageng */}
            <rect x="36" y="22" width="28" height="14" className={styles.hall} />
            {/* Pracimayasa: eight-sided room */}
            <polygon points="46,8 54,8 58,11 58,15 54,18 46,18 42,15 42,11" className={styles.hall} />
            {/* Axis */}
            <path d="M50 112V8" className={styles.axis} />
            {/* Main gate */}
            <rect x="44" y="110" width="12" height="4" className={styles.gate} />
          </svg>
          <span className={styles.gateLabel} aria-hidden="true">
            {labels.gate}
          </span>
          <ol className={styles.hotspots} aria-label={labels.title}>
            {places.map((p) => (
              <li key={p.id} style={{ insetInlineStart: `${p.x}%`, insetBlockStart: `${(p.y / 100) * 100}%` }}>
                <button
                  type="button"
                  className={styles.hotspot}
                  aria-expanded={active === p.id}
                  aria-controls={panelId}
                  onClick={(e) => select(p.id, e.currentTarget)}
                >
                  <span aria-hidden="true">{p.order}</span>
                  <span className="visually-hidden">{labels.select(p.name)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className={styles.disclaimer}>{labels.disclaimer}</p>
      </div>

      <div className={styles.side}>
        <div id={panelId} ref={panelRef} tabIndex={-1} className={styles.panel} aria-live="polite" hidden={!current}>
          {current && (
            <>
              <div className={styles.panelHead}>
                <p className={`${styles.panelNum} numeral`} aria-hidden="true">
                  {String(current.order).padStart(2, "0")}
                </p>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => {
                    setActive(null);
                    lastTrigger.current?.focus();
                  }}
                >
                  <X aria-hidden="true" size={20} strokeWidth={1.75} />
                  <span className="visually-hidden">{labels.close}</span>
                </button>
              </div>
              <h3 className={styles.panelTitle}>{current.name}</h3>
              <ScriptTitle aksara={current.aksara} size="s" />
              {current.image && (
                <div className={styles.panelImage}>
                  <Picture image={current.image} cover sizes="(max-width: 860px) 100vw, 380px" />
                </div>
              )}
              <p lang={contentLang}>{current.summary}</p>
              {current.rules.length > 0 && (
                <div className={styles.panelRules}>
                  <p className="eyebrow">{labels.rules}</p>
                  <ul>
                    {current.rules.map((r) => (
                      <li key={r.id}>
                        <Pictogram icon={r.icon} size={40} />
                        <span>{r.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link to={current.href} className="arrow-link">
                {labels.more} <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </>
          )}
        </div>

        <div className={styles.legend}>
          <p className="eyebrow">{labels.legend}</p>
          <ol>
            {places.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={styles.legendItem}
                  aria-expanded={active === p.id}
                  aria-controls={panelId}
                  onClick={(e) => select(p.id, e.currentTarget)}
                >
                  <span className={`${styles.legendNum} numeral`}>{p.order}</span>
                  <span>
                    <span className={styles.legendName}>{p.name}</span>
                    <span className={styles.legendSummary} lang={contentLang}>
                      {p.summary}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
