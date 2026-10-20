/**
 * Original visitor pictograms. Each is a 24×24 line drawing placed inside a
 * ring: a ring with a diagonal bar means "not allowed", a plain ring means
 * "please do" or "good to know". Meaning never relies on colour alone, and
 * every pictogram is shown with a text label.
 */
import type { Etiquette } from "~/content/schema";

type Icon = Etiquette["icon"];

const PROHIBITED = new Set<Icon>([
  "no-shorts",
  "no-parang",
  "no-headwear",
  "no-sunglasses",
  "no-velvet",
  "no-flipflops",
  "no-tripod",
  "no-food",
  "no-weapons",
  "no-smoking",
  "keep-off-grass",
]);

const GLYPHS: Record<Icon, React.ReactNode> = {
  "modest-dress": (
    <>
      <circle cx="12" cy="4.2" r="2" />
      <path d="M9 7.5h6l1.2 6H7.8z" />
      <path d="M8 13.5h8l1.2 7.5H6.8z" />
    </>
  ),
  "no-shorts": <path d="M6 4h12l1.5 15h-5.2L12 10.5 9.7 19H4.5z" />,
  "no-parang": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 13c2.5 0 3-3 5.5-3S12 7 14 4.5M8 20c2.5-.5 3-3.5 5.5-3.5S17 13 20 11.5M13.5 20c1.5-1 2.5-2.5 6.5-3" />
    </>
  ),
  "no-velvet": (
    <>
      <path d="M5 5h14v9c-2 4-5.2 6-7 6s-5-2-7-6z" />
      <path d="M9 8v7M12.5 8v9M16 8v5" />
    </>
  ),
  "no-headwear": (
    <>
      <path d="M4.5 15a7.5 7.5 0 0 1 15 0z" />
      <path d="M3 15h18M12 7.5V6" />
    </>
  ),
  "no-sunglasses": (
    <>
      <path d="M2.5 13h7.5v1.5a3.75 3.75 0 0 1-7.5 0zM14 13h7.5v1.5a3.75 3.75 0 0 1-7.5 0z" />
      <path d="M10 13.5h4M2.5 13l2-5.5h2M21.5 13l-2-5.5h-2" />
    </>
  ),
  "no-flipflops": (
    <>
      <path d="M12 3c3.2 0 5 3.3 5 8.3S15.8 21 12.4 21 7 17 7 12 8.8 3 12 3z" />
      <path d="M8.2 9.2 12 11l3.8-1.8M12 11V4.8" />
    </>
  ),
  "camera-permission": (
    <>
      <path d="M3.5 8h3.2l1.8-2.6h7l1.8 2.6h3.2v10.5h-17z" />
      <circle cx="12" cy="13" r="3.4" />
      <path d="M17.6 20.6l1.4 1.4 2.8-2.8" />
    </>
  ),
  "no-tripod": (
    <>
      <rect x="8" y="3" width="8" height="5" rx="1" />
      <path d="M12 8v4M12 12l-5 9M12 12l5 9M12 12v9" />
    </>
  ),
  "no-food": (
    <>
      <path d="M5 9h10v4.5a5 5 0 0 1-10 0z" />
      <path d="M15 10h1.8a2.2 2.2 0 0 1 0 4.4H15M8 3.5c0 1.5 1.5 1.5 1.5 3M11.5 3.5c0 1.5 1.5 1.5 1.5 3" />
    </>
  ),
  "no-smoking": (
    <>
      <path d="M2.5 14h13.5v3H2.5z" />
      <path d="M18.5 14v3M21 14v3M18.5 11c0-1.8 2.5-1.8 2.5-4" />
    </>
  ),
  "no-weapons": (
    <>
      <path d="M4 20l8.5-8.5" />
      <path d="M12.5 11.5 19.5 4c1 3.5-.5 6.8-4 8.6z" />
      <path d="M6 16l2 2" />
    </>
  ),
  "keep-off-grass": (
    <>
      <path d="M3 20h18" />
      <path d="M6 20c0-3.5-1.6-5.8-3-7M10 20c0-5 1-8 3.2-10.2M14.2 20c0-3.6 2-6 4.3-7.3M18 20c0-2.6-.8-4.4-1.8-5.6" />
    </>
  ),
  litter: (
    <>
      <path d="M6 8h12l-1.1 12.5H7.1zM4 8h16M10 4.5h4" />
      <path d="M12 11v5.5M9.6 14.2 12 16.6l2.4-2.4" />
    </>
  ),
  guide: (
    <>
      <circle cx="8" cy="5" r="2" />
      <path d="M8 8.2v6.3M8 14.5l-2.3 6M8 14.5l2.3 6M8 10l4.5 2.2" />
      <path d="M15 3.5v10M15 3.5l5 2-5 2" />
    </>
  ),
  "arrive-early": (
    <>
      <circle cx="12" cy="13.5" r="7" />
      <path d="M12 9.5v4.2l3 2M9.5 3.5h5M12 3.5v3" />
    </>
  ),
  cashless: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M3 10h18M6.5 14.5h4" />
    </>
  ),
  "children-free": (
    <>
      <circle cx="12" cy="6" r="2.4" />
      <path d="M12 9.5v5.5M8 11.5l4 1 4-1M12 15l-2.6 5.5M12 15l2.6 5.5" />
    </>
  ),
};

type Props = { icon: Icon; size?: number };

export function Pictogram({ icon, size = 56 }: Props) {
  const prohibited = PROHIBITED.has(icon);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      data-kind={prohibited ? "prohibited" : "guidance"}
    >
      <circle
        cx="24"
        cy="24"
        r="21.5"
        fill="none"
        stroke={prohibited ? "var(--terracotta)" : "var(--green-pareanom)"}
        strokeWidth={prohibited ? 3.5 : 2.5}
      />
      <g
        transform="translate(9.6 9.6) scale(1.2)"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[icon]}
      </g>
      {prohibited && (
        <path d="M9.2 9.2 38.8 38.8" stroke="var(--terracotta)" strokeWidth="3.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function isProhibited(icon: Icon) {
  return PROHIBITED.has(icon);
}
