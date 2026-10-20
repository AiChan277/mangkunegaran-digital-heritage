import type { Config } from "@react-router/dev/config";
import { LOCALES } from "./src/i18n/config";
import { ARTICLE_SLUGS } from "./src/content/articles/slugs";

const PAGES = ["", "history", "architecture", "culture", "stories", "gallery", "visit", "about", "404"];

export default {
  appDirectory: "src/app",
  // Static site: every locale × route is prerendered to HTML at build time.
  ssr: false,
  prerender: {
    paths: [
      "/",
      "/404",
      ...LOCALES.flatMap((lang) => [
        ...PAGES.map((p) => (p ? `/${lang}/${p}` : `/${lang}`)),
        ...ARTICLE_SLUGS.map((slug) => `/${lang}/stories/${slug}`),
      ]),
    ],
    concurrency: 6,
  },
} satisfies Config;
