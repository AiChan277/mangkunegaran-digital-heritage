import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { Route } from "./+types/root";
import { LOCALE_INFO, isLocale } from "~/i18n/config";

import "~/styles/fonts.css";
import "~/styles/tokens.css";
import "~/styles/base.css";
import "~/styles/lang.css";

export const links: Route.LinksFunction = () => [
  // No font preload: fonts use font-display: swap with metric-matched
  // fallbacks, so the hero photograph (the LCP element) gets the bandwidth.
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon-32.png", sizes: "32x32", type: "image/png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },
];

function useDocumentLang() {
  const first = useLocation().pathname.split("/").filter(Boolean)[0];
  if (isLocale(first)) return LOCALE_INFO[first];
  return LOCALE_INFO.id;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const info = useDocumentLang();
  return (
    <html lang={info.bcp47} dir={info.dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f5efe2" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

/** Last-resort error screen. Bilingual because the locale may be unknown here. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (import.meta.env.DEV && error instanceof Error) console.error(error);
  return (
    <main id="main" className="container" style={{ paddingBlock: "18vh" }}>
      <p className="eyebrow">Mangkunegaran — A Living Heritage · Concept</p>
      <h1 style={{ fontSize: "var(--step-4)", marginBlock: "16px 24px" }}>
        {notFound ? "Halaman tidak ditemukan · Page not found" : "Terjadi kesalahan · Something went wrong"}
      </h1>
      <p>
        <a className="text-link" href="/id">
          Kembali ke beranda
        </a>{" "}
        ·{" "}
        <a className="text-link" href="/en" lang="en">
          Back to the home page
        </a>
      </p>
    </main>
  );
}
