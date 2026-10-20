import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const site = {
    siteUrl: (env.SITE_URL ?? "").replace(/\/+$/, ""),
    studioName: env.STUDIO_NAME || "Kelompok 7",
    studioUrl: env.STUDIO_URL ?? "",
    contactEmail: env.CONTACT_EMAIL ?? "",
    javaneseReviewer: env.JAVANESE_REVIEWER ?? "",
  };
  return {
    plugins: [reactRouter()],
    resolve: { tsconfigPaths: true },
    define: { __SITE__: JSON.stringify(site) },
    build: {
      // Keep small assets as files so the CSP can stay strict (no data: URIs).
      assetsInlineLimit: 0,
      // One small stylesheet (~10 KB compressed) instead of a render-blocking
      // chain of per-component files.
      cssCodeSplit: false,
    },
  };
});
