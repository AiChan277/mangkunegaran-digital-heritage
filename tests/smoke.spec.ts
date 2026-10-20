import { expect, test } from "@playwright/test";
import { ALL } from "./routes";

/** Every route × every locale: 200, correct <html lang>, a title, one h1, no console errors. */
for (const r of ALL) {
  test(`smoke ${r.url}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

    const res = await page.goto(r.url, { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", r.lang);
    expect((await page.title()).trim().length).toBeGreaterThan(0);
    await expect(page.locator("h1")).toHaveCount(1);
    // The disclaimer is on every page.
    await expect(page.locator("#disclaimer")).toContainText("mangkunegaran.id");
    expect(errors, errors.join("\n")).toEqual([]);
  });
}
