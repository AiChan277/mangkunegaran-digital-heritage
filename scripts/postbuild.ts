/**
 * Post-build steps for the static output in build/client:
 *  1. Move prerendered 404 pages to 404.html files (root and per locale),
 *     so Cloudflare's "404-page" handling serves the nearest one.
 *  2. Add a strict Content-Security-Policy <meta> to every HTML file, with a
 *     sha256 hash for each inline script on that page (no 'unsafe-inline').
 *  3. Write sitemap.xml (with hreflang alternates) and robots.txt.
 *  4. Verify every HTML file has a lang attribute, a title and one h1.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, LOCALE_INFO } from "../src/i18n/config";
import { ARTICLE_SLUGS } from "../src/content/articles/slugs";

const OUT = path.resolve("build/client");

try {
  process.loadEnvFile(".env");
} catch {
  /* no .env file: SITE_URL stays blank */
}
const SITE_URL = (process.env.SITE_URL ?? "").replace(/\/+$/, "");

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : Promise.resolve([path.join(dir, e.name)]))),
  );
  return files.flat();
}

async function move404s() {
  const targets = ["404", ...LOCALES.map((l) => `${l}/404`)];
  for (const t of targets) {
    const from = path.join(OUT, t, "index.html");
    if (!existsSync(from)) throw new Error(`Missing prerendered ${t}/index.html`);
    await rename(from, path.join(OUT, `${t}.html`));
    await rm(path.join(OUT, t), { recursive: true, force: true });
  }
  // Every route is prerendered, so the SPA fallback is never needed.
  await rm(path.join(OUT, "__spa-fallback.html"), { force: true });
}

const SCRIPT_RE = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")([^>]*)>([\s\S]*?)<\/script>/g;

function cspFor(html: string): string {
  const hashes = new Set<string>();
  for (const m of html.matchAll(SCRIPT_RE)) {
    const body = m[2] ?? "";
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // upgrade-insecure-requests lives only in _headers: in a <meta> policy
    // WebKit also applies it to http://localhost, which breaks local testing.
  ].join("; ");
}

async function addCsp(files: string[]) {
  for (const file of files) {
    let html = await readFile(file, "utf8");
    if (html.includes('http-equiv="Content-Security-Policy"')) continue;
    const meta = `<meta http-equiv="Content-Security-Policy" content="${cspFor(html)}">`;
    html = html.replace(/<head>/, `<head>${meta}`);
    await writeFile(file, html);
  }
}

function pagePaths(): string[] {
  const pages = ["", "history", "architecture", "culture", "stories", "gallery", "visit", "about"];
  return [...pages, ...ARTICLE_SLUGS.map((s) => `stories/${s}`)];
}

async function writeSitemap() {
  if (!SITE_URL) {
    console.warn("! SITE_URL is blank: sitemap.xml not written and robots.txt has no Sitemap line.");
    await writeFile(path.join(OUT, "robots.txt"), "User-agent: *\nAllow: /\n");
    return;
  }
  const urls: string[] = [];
  for (const page of pagePaths()) {
    for (const l of LOCALES) {
      const loc = `${SITE_URL}/${l}${page ? `/${page}` : ""}`;
      const alternates = LOCALES.map(
        (a) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_INFO[a].bcp47}" href="${SITE_URL}/${a}${page ? `/${page}` : ""}"/>`,
      ).join("\n");
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page ? `/id/${page}` : "/"}"/>`;
      urls.push(`  <url>\n    <loc>${loc}</loc>\n${alternates}\n${xDefault}\n  </url>`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  await writeFile(path.join(OUT, "sitemap.xml"), xml);
  await writeFile(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

async function verify(files: string[]) {
  const problems: string[] = [];
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const rel = path.relative(OUT, file);
    if (!/<html[^>]*\blang="[^"]+"/.test(html)) problems.push(`${rel}: missing <html lang>`);
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: missing <title>`);
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) problems.push(`${rel}: ${h1} <h1> elements`);
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    throw new Error(`${problems.length} HTML problem(s)`);
  }
}

async function main() {
  await move404s();
  const html = (await walk(OUT)).filter((f) => f.endsWith(".html"));
  await addCsp(html);
  await writeSitemap();
  await verify(html);
  console.log(`✓ postbuild: ${html.length} HTML files, CSP added, 404 pages in place`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
