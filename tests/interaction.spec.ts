import { expect, test } from "@playwright/test";

test.describe("language switching", () => {
  test("keeps the current page and survives back/forward", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en/history");
    await page.getByRole("button", { name: /Language/ }).click();
    await page.locator('a[hreflang="th"]').first().click();
    await expect(page).toHaveURL(/\/th\/history$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "th");
    await page.goBack();
    await expect(page).toHaveURL(/\/en\/history$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goForward();
    await expect(page).toHaveURL(/\/th\/history$/);
  });

  test("language menu works by keyboard only", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/en");
    const trigger = page.getByRole("button", { name: /Language/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Current language is focused; arrow down moves to the next.
    await expect(page.locator('a[aria-current="true"][hreflang="en"]').first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('a[hreflang="ms"]').first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(page.locator('a[hreflang="es"]').first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("root redirects using the browser language", async ({ browser }) => {
    const context = await browser.newContext({ locale: "th-TH" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/th$/);
    await context.close();
  });

  test("root without JavaScript lists every language", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("main a[hreflang]")).toHaveCount(12);
    await context.close();
  });
});

test.describe("mobile drawer", () => {
  test("opens, traps focus and closes by keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/en");
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menu).toBeFocused();
  });
});

test.describe("gallery lightbox", () => {
  test("opens by keyboard, moves with arrows, closes with Esc, returns focus", async ({ page }) => {
    await page.goto("/en/gallery");
    const first = page.locator("main ul button").first();
    await first.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("1 of");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("2 of");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("1 of");
    // Licence credit is shown inside the lightbox.
    await expect(dialog).toContainText("Licence");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(first).toBeFocused();
  });
});

test.describe("site plan", () => {
  test("hotspots open a panel and Esc returns focus", async ({ page }) => {
    await page.goto("/en/visit");
    const hotspot = page.getByRole("button", { name: "Show Pendhapa Ageng" }).first();
    await hotspot.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Pendhapa Ageng", level: 3 })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(hotspot).toBeFocused();
  });
});

test.describe("404", () => {
  test("unknown paths get the localized 404 page", async ({ page }) => {
    const res = await page.goto("/th/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "th");
    await expect(page.locator("h1")).toHaveText("ไม่พบหน้านี้");
  });

  test("paths outside any locale get the bilingual 404", async ({ page }) => {
    const res = await page.goto("/nowhere/at/all");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("Page not found");
  });
});

test.describe("content stays visible", () => {
  test("without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const url of ["/en", "/en/history", "/id/stories/panembrama", "/th/visit"]) {
      await page.goto(url);
      await expect(page.locator("h1")).toBeVisible();
      const hidden = await page.evaluate(
        () => [...document.querySelectorAll("main section, main article, main li")].filter((el) => getComputedStyle(el).opacity === "0").length,
      );
      expect(hidden, `${url}: ${hidden} hidden elements`).toBe(0);
    }
    await context.close();
  });

  for (const reducedMotion of ["reduce", "no-preference"] as const) {
    test(`after a fast scroll everything is shown (motion: ${reducedMotion})`, async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion });
      const page = await context.newPage();
      // Wait for hydration: scroll restoration on first render would undo an early scroll.
      await page.goto("/en", { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      // Fast flings until the real bottom (the page grows as lazy sections render).
      await page.evaluate(async () => {
        for (let i = 0; i < 100 && window.scrollY + window.innerHeight < document.body.scrollHeight - 2; i++) {
          window.scrollTo({ top: window.scrollY + 1200, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 16));
        }
      });
      await page.waitForTimeout(400);
      expect(await page.locator('[data-reveal="pending"]').count()).toBe(0);
      await context.close();
    });
  }

  test("with reduced motion nothing is ever hidden", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/en");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    await page.waitForTimeout(300);
    const pending = await page.locator('[data-reveal="pending"]').count();
    expect(pending).toBe(0);
    await context.close();
  });
});
