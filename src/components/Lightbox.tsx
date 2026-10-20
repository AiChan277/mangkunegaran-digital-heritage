/**
 * Accessible image viewer on a native <dialog>: focus is trapped by the
 * browser, Esc closes, ←/→ move, swipe works on touch, and focus returns to
 * the thumbnail that opened it (handled by the caller). Lazy-loaded.
 */
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ImageView } from "~/content/resolve";
import { Picture } from "./Picture";
import styles from "./Lightbox.module.css";

type Labels = {
  dialog: string;
  close: string;
  prev: string;
  next: string;
  counter: (current: number, total: number) => string;
  source: string;
  license: string;
};

type Props = {
  images: ImageView[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  labels: Labels;
};

export default function Lightbox({ images, index, onIndex, onClose, labels }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const img = images[index]!;
  const total = images.length;
  const go = (delta: number) => onIndex((index + delta + total) % total);

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    return () => {
      if (el?.open) el.close();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={labels.dialog}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onTouchStart={(e) => {
        touch.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        const end = e.changedTouches[0]?.clientX;
        touch.current = null;
        if (start == null || end == null) return;
        if (Math.abs(end - start) > 50) go(end < start ? 1 : -1);
      }}
    >
      <div className={styles.inner}>
        <div className={styles.bar}>
          <p className={styles.counter} aria-live="polite">
            {labels.counter(index + 1, total)}
          </p>
          <button type="button" className={styles.btn} onClick={onClose} autoFocus>
            <X aria-hidden="true" size={22} strokeWidth={1.75} />
            <span className="visually-hidden">{labels.close}</span>
          </button>
        </div>
        <figure className={styles.figure} key={img.id}>
          <div className={styles.stage}>
            <Picture image={img} sizes="100vw" priority />
          </div>
          <figcaption className={styles.caption}>
            <span className={styles.alt}>{img.alt}</span>
            <span className={styles.credit}>
              {img.dated ? `${img.dated} · ` : ""}
              {img.attribution} ·{" "}
              {img.licenseUrl ? (
                <a href={img.licenseUrl} rel="license noopener">
                  {labels.license}: {img.license}
                </a>
              ) : (
                <span>
                  {labels.license}: {img.license}
                </span>
              )}{" "}
              ·{" "}
              <a href={img.sourcePageUrl} rel="noopener">
                {labels.source}
              </a>
            </span>
          </figcaption>
        </figure>
        <div className={styles.nav}>
          <button type="button" className={styles.btn} onClick={() => go(-1)}>
            <ChevronLeft aria-hidden="true" size={24} strokeWidth={1.75} />
            <span className="visually-hidden">{labels.prev}</span>
          </button>
          <button type="button" className={styles.btn} onClick={() => go(1)}>
            <ChevronRight aria-hidden="true" size={24} strokeWidth={1.75} />
            <span className="visually-hidden">{labels.next}</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
