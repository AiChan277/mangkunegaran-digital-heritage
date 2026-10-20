/**
 * Original geometric divider: a thin rule broken by a stepped, tiered form
 * that echoes a joglo roof profile. Studio artwork — not a batik motif,
 * crest or emblem.
 */
export function Ornament({ tone = "default" }: { tone?: "default" | "light" }) {
  const color = tone === "light" ? "var(--brass-light)" : "var(--brass)";
  return (
    <svg
      viewBox="0 0 240 24"
      width="100%"
      height="24"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ maxInlineSize: 360, marginInline: "auto" }}
    >
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="square">
        <path d="M0 16h92M148 16h92" />
        <path d="M92 16h56M100 16l8-6h24l8 6M110 10l4-4h12l4 4M116 6l4-3 4 3" />
        <path d="M120 16v4" />
      </g>
    </svg>
  );
}
