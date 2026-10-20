/**
 * Route table. Each locale gets its own explicit route subtree (rather than
 * a ":lang" parameter) so unknown prefixes fall through to the 404 route and
 * every locale can have its own prerendered 404 page.
 */
import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { LOCALES } from "../i18n/config";

const PAGES = [
  ["history", "routes/history.tsx"],
  ["architecture", "routes/architecture.tsx"],
  ["culture", "routes/culture.tsx"],
  ["stories", "routes/stories.tsx"],
  ["stories/:slug", "routes/story.tsx"],
  ["gallery", "routes/gallery.tsx"],
  ["visit", "routes/visit.tsx"],
  ["about", "routes/about.tsx"],
] as const;

export default [
  index("routes/root-index.tsx"),
  ...LOCALES.map((lang) =>
    route(lang, "routes/locale-layout.tsx", { id: `${lang}` }, [
      index("routes/home.tsx", { id: `${lang}/home` }),
      ...PAGES.map(([path, file]) => route(path, file, { id: `${lang}/${path}` })),
      route("*", "routes/locale-not-found.tsx", { id: `${lang}/not-found` }),
    ]),
  ),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
