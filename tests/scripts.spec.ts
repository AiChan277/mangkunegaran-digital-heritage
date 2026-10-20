import { expect, test } from "@playwright/test";

/**
 * Script rendering: screenshots of Javanese (Aksara Jawa), Thai, Khmer, Lao
 * and Burmese text in each engine, saved for visual review in
 * test-results/scripts/. Also asserts the script fonts actually loaded.
 */
const CASES = [
  { locale: "jv", font: "Noto Sans Javanese", selector: '[lang="jv-Java"]' },
  { locale: "th", font: "Noto Sans Thai", selector: "h1" },
  { locale: "km", font: "Noto Sans Khmer", selector: "h1" },
  { locale: "lo", font: "Noto Sans Lao", selector: "h1" },
  { locale: "my", font: "Noto Sans Myanmar", selector: "h1" },
];

for (const c of CASES) {
  test(`renders ${c.locale} script`, async ({ page }, info) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(c.locale === "jv" ? "/jv" : `/${c.locale}/visit`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200); // let the intro animation finish
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate((family) => document.fonts.check(`16px "${family}"`, "ꦲ ก ក ກ က"), c.font);
    expect(loaded, `${c.font} not available`).toBe(true);
    await page.screenshot({ path: `test-results/scripts/${c.locale}-${info.project.name}.png`, clip: { x: 0, y: 0, width: 1280, height: 700 } });
  });
}
