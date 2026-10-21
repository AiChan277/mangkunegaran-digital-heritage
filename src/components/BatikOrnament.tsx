import styles from "./BatikOrnament.module.css";

type Variant = "field" | "border" | "flower";

/**
 * Kawung batik ornament from the vector files in public/ornament/
 * (record: src/content/ornaments.ts, docs/BATIK_ASSETS.md). The SVG is used
 * as a CSS mask so it takes the colour of its surface; CSS only colours,
 * sizes and positions it — the motif itself is the vector asset.
 *
 * field  — a low-contrast patch of the repeating tile (hero backgrounds)
 * border — one thin row, where a green surface meets paper
 * flower — a single four-leaf group, for dividers and markers
 *
 * Decorative: aria-hidden, no pointer events, clipped to its own box.
 * Entrance animation runs once and is off under reduced motion.
 */
export function BatikOrnament({ variant, className = "" }: { variant: Variant; className?: string }) {
  return <span className={`${styles.ornament} ${className}`} data-variant={variant} aria-hidden="true" />;
}
