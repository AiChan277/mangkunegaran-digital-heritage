import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** History page (iteration 2): disclosure, translations, documentary, archive. */

async function axeSerious(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  return results.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}

test.describe("timeline", () => {
  test("has four periods and entries that open progressively", async ({ page }) => {
    await page.goto("/en/history");
    await expect(page.locator('section[id^="period-"]')).toHaveCount(4);
    const entry = page.locator("#entry-salatiga");
    const details = entry.locator("details");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(entry.getByText("What happened")).toBeHidden();
    await entry.getByText("Read more").click();
    await expect(details).toHaveAttribute("open", "");
    for (const label of ["What happened", "People", "Why it matters", "What is uncertain", "Sources for this entry"]) {
      await expect(entry.getByRole("heading", { name: label })).toBeVisible();
    }
    // Uncertainty is disclosed, sources are linked.
    await expect(entry).toContainText("Sources differ");
    await expect(entry.locator('a[href^="#src-"]').first()).toBeVisible();
    // Turning points are marked with text, not colour alone.
    await expect(entry.getByText("Turning point")).toBeVisible();
  });

  test("entries link to archive records and stories", async ({ page }) => {
    await page.goto("/en/history");
    const sugar = page.locator("#entry-sugar");
    await sugar.getByText("Read more").click();
    const fig = sugar.locator("figure").first();
    await expect(fig.getByRole("link", { name: "Catalogue record" })).toHaveAttribute("href", /hdl\.handle\.net\/1887\.1\/item:/);
    await expect(fig).toContainText("CC BY 4.0");
    const legion = page.locator("#entry-legion");
    await legion.getByText("Read more").click();
    await expect(legion.locator('a[href="/en/stories/legiun-mangkunegaran"]')).toBeVisible();
  });

  test("new sourced entries are present and cite official articles", async ({ page }) => {
    await page.goto("/en/history");
    for (const id of ["estri", "tasikmadu", "schools", "electricity", "kali-samin", "ponten", "srv-1942"]) {
      await expect(page.locator(`#entry-${id}`)).toHaveCount(1);
    }
    const t = page.locator("#entry-tasikmadu");
    await expect(t).toContainText("11 June 1871");
    await t.getByText("Read more").click();
    await expect(t.getByRole("link", { name: "Manisnya Gula Tasikmadu" })).toBeVisible();
  });

  test("works without JavaScript (details are native)", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/en/history");
    const entry = page.locator("#entry-giyanti");
    await entry.locator("summary").click();
    await expect(entry.getByRole("heading", { name: "What happened" })).toBeVisible();
    await context.close();
  });
});

test.describe("incomplete translations", () => {
  test("Thai shows draft titles and marks English details with lang, without warning banners", async ({ page }) => {
    await page.goto("/th/history");
    await expect(page.locator("html")).toHaveAttribute("lang", "th");
    // No translation warning banner or draft tag on the page.
    await expect(page.locator("main")).not.toContainText("ฉบับร่างโดย AI");
    const entry = page.locator("#entry-salatiga");
    // Title is the Thai draft (no lang override); the details fall back to English and are marked.
    await expect(entry.locator("h3")).not.toHaveAttribute("lang", /.+/);
    await expect(entry.locator("h3")).toContainText("ซาลาติกา");
    await entry.locator("summary").click();
    await expect(entry.locator('details p[lang="en"]').first()).toBeVisible();
  });

  test("Javanese uses Javanese where written and marks Indonesian fallback", async ({ page }) => {
    await page.goto("/jv/history");
    const entry = page.locator("#entry-salatiga");
    await expect(entry.locator("h3")).not.toHaveAttribute("lang", /.+/);
    await entry.locator("summary").click();
    await expect(entry.locator('details p[lang="id"]').first()).toBeVisible();
  });
});

test.describe("chapter audio", () => {
  test("each historical chapter has its own audio control; there is no standalone documentary section", async ({ page }) => {
    await page.goto("/en/history");
    await expect(page.locator("#documentary")).toHaveCount(0);
    for (const id of ["foundation", "court", "modern", "republic"]) {
      const player = page.locator(`#period-${id} section[data-chapter="${id}"]`);
      await expect(player).toHaveCount(1);
      await expect(player.getByText("Listen to this chapter")).toBeVisible();
    }
    // Timeline entries do not carry their own players.
    await expect(page.locator("li section[data-chapter]")).toHaveCount(0);
  });

  test("synthetic narration is labelled as AI and downloads nothing before play", async ({ page }) => {
    const audioRequests: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/audio/")) audioRequests.push(r.url());
    });
    await page.goto("/en/history");
    const player = page.locator('section[data-chapter="foundation"]');
    await expect(player.getByText("AI voice", { exact: true })).toBeVisible();
    await expect(player).toContainText("not by a human narrator");
    await expect(player).toContainText("Voice: Microsoft Edge");
    await expect(player.getByRole("button", { name: "Play" })).toBeVisible();
    // The measured duration is shown before anything loads.
    await expect(player).toContainText("0:00 of 5:06");
    await expect(player.locator("audio")).toHaveAttribute("preload", "none");
    await page.waitForLoadState("networkidle");
    expect(audioRequests).toEqual([]);
  });

  test("pressing play loads and plays the recording", async ({ page }) => {
    await page.goto("/en/history");
    const player = page.locator('section[data-chapter="modern"]');
    const audioResponse = page.waitForResponse((r) => r.url().includes("/audio/modern-en.mp3"));
    await player.getByRole("button", { name: "Play" }).click();
    const response = await audioResponse;
    expect([200, 206]).toContain(response.status());
    expect(response.headers()["content-type"]).toBe("audio/mpeg");
    await expect(player.getByRole("button", { name: "Pause" })).toBeVisible();
    await expect.poll(() => player.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime), { timeout: 15_000 }).toBeGreaterThan(0.5);
    await player.getByRole("button", { name: "Pause" }).click();
    await expect(player.getByRole("button", { name: "Play" })).toBeVisible();
    await expect(player).not.toContainText("could not be loaded");
  });

  test("the AI label is translated", async ({ page }) => {
    await page.goto("/id/history");
    await expect(page.locator('section[data-chapter="court"]').getByText("Suara AI", { exact: true })).toBeVisible();
  });

  test("narration language follows the locale, can be switched, and shows the script", async ({ page }) => {
    await page.goto("/id/history");
    const player = page.locator('section[data-chapter="court"]');
    await expect(player.getByRole("radio", { name: "Bahasa Indonesia" })).toBeChecked();
    await player.getByRole("radio", { name: "English" }).check();
    await player.locator("summary").click();
    const body = player.locator("details > div");
    await expect(body).toHaveAttribute("lang", "en");
    await expect(body).toContainText("Court, colony and enterprise");
    // Production notes are never part of the text.
    await expect(body).not.toContainText("SOUND:");
    await expect(body).not.toContainText("PAUSE:");
  });

  test("the chapter stays readable without audio", async ({ page }) => {
    await page.goto("/en/history");
    const chapter = page.locator("#period-modern");
    await expect(chapter.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(chapter.locator(".prose p").first()).toBeVisible();
    await expect(chapter.locator("ol > li").first()).toBeVisible();
  });
});

test.describe("archive exhibition", () => {
  test("every confirmed item has creator, licence and a catalogue record; candidates are not reproduced", async ({ page }) => {
    await page.goto("/en/history#archive");
    const figures = page.locator("#archive figure");
    const count = await figures.count();
    expect(count).toBeGreaterThanOrEqual(10);
    for (let i = 0; i < count; i++) {
      const f = figures.nth(i);
      await expect(f.locator("img")).toHaveAttribute("alt", /.{20,}/);
      await expect(f.getByRole("link", { name: "Catalogue record" })).toHaveAttribute("href", /^https?:\/\//);
      await expect(f.getByRole("link", { name: /CC BY 4\.0|Public domain/i }).or(f.getByText(/Public domain/i))).toHaveCount(1);
    }
    const candidates = page.locator("#archive li", { hasText: "Candidate" });
    await expect(candidates).toHaveCount(2);
    await expect(candidates.locator("img")).toHaveCount(0);
  });
});

test.describe("accessibility of new UI", () => {
  test("history with entries and transcript open has no serious axe violations", async ({ page }) => {
    // Reduced motion: nothing is hidden for reveal-on-scroll while axe scans.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/history", { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    await page.waitForTimeout(300);
    expect(await axeSerious(page)).toEqual([]);
  });

  test("language panel has no serious axe violations", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Change language/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await axeSerious(page)).toEqual([]);
  });

  test("Thai history (partial translation) has no serious axe violations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/th/history", { waitUntil: "networkidle" });
    expect(await axeSerious(page)).toEqual([]);
  });
});

test.describe("batik ornament", () => {
  test("uses the kawung SVG files, which are served as SVG", async ({ page, request }) => {
    await page.goto("/en/history");
    const masks = await page.evaluate(() =>
      [...document.querySelectorAll("[data-variant]")]
        .map((el) => getComputedStyle(el).maskImage || getComputedStyle(el).webkitMaskImage)
        .filter((m) => m && m !== "none"),
    );
    expect(masks.length).toBeGreaterThan(0);
    for (const m of masks) expect(m).toMatch(/\/ornament\/kawung-(tile|border|flower)\.svg/);
    for (const f of ["kawung-tile", "kawung-border", "kawung-flower"]) {
      const res = await request.get(`/ornament/${f}.svg`);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body).toContain("<svg");
      expect(body).toContain("CC0");
    }
    // No pattern is drawn with CSS gradients.
    const gradients = await page.evaluate(() =>
      [...document.styleSheets].flatMap((s) => [...s.cssRules]).filter((r) => /repeating-(linear|radial)-gradient/.test(r.cssText)).length,
    );
    expect(gradients).toBe(0);
  });

  test("ornament motion runs once, never loops, and is off under reduced motion", async ({ browser }) => {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const context = await browser.newContext({ reducedMotion });
      const page = await context.newPage();
      await page.goto("/en/architecture");
      const info = await page.evaluate(() =>
        [...document.querySelectorAll('[data-variant="field"], [data-variant="border"]')].map((el) => {
          const cs = getComputedStyle(el);
          return { name: cs.animationName, count: cs.animationIterationCount, overflow: getComputedStyle(el.parentElement!).overflow };
        }),
      );
      expect(info.length).toBeGreaterThan(0);
      for (const i of info) {
        if (reducedMotion === "reduce") expect(i.name).toBe("none");
        else expect(i.count).toBe("1");
      }
      await context.close();
    }
  });
});

test.describe("royal-green identity", () => {
  const ROUTES = ["/en", "/en/history", "/en/architecture", "/en/culture", "/en/stories", "/en/stories/panembrama", "/en/gallery", "/en/visit", "/en/about", "/en/does-not-exist", "/id/history", "/th/gallery"];
  for (const url of ROUTES) {
    test(`hero is royal green on ${url}`, async ({ page }) => {
      await page.goto(url);
      const hero = page.locator("main .on-royal").first();
      await expect(hero).toBeVisible();
      const bg = await hero.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg).toBe("rgb(17, 48, 27)");
      // One h1, inside the green hero.
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await hero.locator("h1").count()).toBe(1);
      // The paper content follows.
      const body = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(body).toBe("rgb(245, 239, 226)");
    });
  }
});
