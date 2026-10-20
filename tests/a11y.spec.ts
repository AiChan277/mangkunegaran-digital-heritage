import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES } from "./routes";

/** axe-core on every Tier-1 route: no serious or critical violations. */
for (const locale of ["en", "id"]) {
  for (const p of PAGES) {
    const url = p ? `/${locale}/${p}` : `/${locale}`;
    test(`axe ${url}`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });
      // Reveal every scroll-triggered element before scanning.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 20));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(800);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      const report = serious.map((v) => `${v.impact} ${v.id}: ${v.help}\n  ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join("\n  ")}`);
      expect(serious, report.join("\n")).toEqual([]);
    });
  }
}
