import { expect, test } from "@playwright/test";
import { PAGES } from "./routes";

const WIDTHS = [360, 768, 1280, 1920];
// Latin + the scripts most likely to overflow (long words, tall stacks).
const LOCALES = ["en", "id", "th", "my", "vi"];

for (const width of WIDTHS) {
  for (const locale of LOCALES) {
    test(`no horizontal overflow at ${width}px · ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const p of PAGES) {
        await page.goto(p ? `/${locale}/${p}` : `/${locale}`, { waitUntil: "domcontentloaded" });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `/${locale}/${p} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }
}
