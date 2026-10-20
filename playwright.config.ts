import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke, keyboard and accessibility tests against the production build,
 * served the way Cloudflare serves it (scripts/serve-static.ts).
 * Run `npm run build` first.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx tsx scripts/serve-static.ts 4173",
    url: "http://localhost:4173/404.html",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: /scripts\.spec\.ts/ },
    // Script rendering screenshots run in all three engines.
    { name: "scripts-chromium", use: { ...devices["Desktop Chrome"] }, testMatch: /scripts\.spec\.ts/ },
    { name: "scripts-firefox", use: { ...devices["Desktop Firefox"] }, testMatch: /scripts\.spec\.ts/ },
    { name: "scripts-webkit", use: { ...devices["Desktop Safari"] }, testMatch: /scripts\.spec\.ts/ },
  ],
});
