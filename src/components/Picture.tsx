import type { CSSProperties } from "react";
import type { ImageView } from "~/content/resolve";
import styles from "./Picture.module.css";

type Props = {
  image: ImageView;
  /** The sizes attribute: how wide the image renders at each breakpoint. */
  sizes: string;
  /** LCP image: eager + high fetch priority. */
  priority?: boolean;
  /** Fill the parent box (parent sets the aspect ratio). */
  cover?: boolean;
  /** Art-directed crop used below 700px. */
  mobile?: ImageView;
  className?: string;
  /** Decorative usage: empty alt. */
  decorative?: boolean;
  /** Load immediately (visible on first paint) without raising fetch priority. */
  eager?: boolean;
};

const srcset = (img: ImageView, ext: "avif" | "webp") =>
  img.widths.map((w) => `/images/${img.id}-${w}.${ext} ${w}w`).join(", ");

export function Picture({ image, sizes, priority = false, cover = false, mobile, className, decorative = false, eager = false }: Props) {
  const fallbackWidth = image.widths.find((w) => w >= 1200) ?? image.widths[image.widths.length - 1];
  const style: CSSProperties = { backgroundColor: image.color, objectPosition: image.focalPoint };
  return (
    <picture className={`${cover ? styles.fill : ""} ${className ?? ""}`.trim() || undefined}>
      {mobile && (
        <>
          <source media="(max-width: 699px)" type="image/avif" srcSet={srcset(mobile, "avif")} sizes="100vw" />
          <source media="(max-width: 699px)" type="image/webp" srcSet={srcset(mobile, "webp")} sizes="100vw" />
        </>
      )}
      <source type="image/avif" srcSet={srcset(image, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(image, "webp")} sizes={sizes} />
      <img
        className={`${styles.img} ${cover ? styles.cover : ""}`}
        src={`/images/${image.id}-${fallbackWidth}.webp`}
        width={image.width}
        height={image.height}
        alt={decorative ? "" : image.alt}
        loading={priority || eager ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        style={style}
      />
    </picture>
  );
}
