/** Project variables, injected at build time from .env (see .env.example). */
export type SiteConfig = {
  siteUrl: string;
  studioName: string;
  studioUrl: string;
  contactEmail: string;
  javaneseReviewer: string;
};

declare const __SITE__: SiteConfig;

export const site: SiteConfig = __SITE__;

/** Absolute URL for a path, or null when SITE_URL is not configured. */
export function absoluteUrl(pathname: string): string | null {
  return site.siteUrl ? `${site.siteUrl}${pathname}` : null;
}
