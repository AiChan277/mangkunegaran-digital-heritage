/**
 * Translators work in one file per language (scripts/translations/<lang>.json,
 * all namespaces together). This writes the per-namespace files the app
 * loads: src/i18n/locales/<lang>/<namespace>.json.
 * English lives directly in src/i18n/locales/en and is the source of truth.
 * Usage: npx tsx scripts/split-translations.ts
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = "scripts/translations";
const OUT = "src/i18n/locales";

async function main() {
  const files = (await readdir(SRC)).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const lang = path.basename(file, ".json");
    if (lang === "en") throw new Error("English is edited directly in src/i18n/locales/en");
    const all = JSON.parse(await readFile(path.join(SRC, file), "utf8")) as Record<string, unknown>;
    await mkdir(path.join(OUT, lang), { recursive: true });
    for (const [ns, messages] of Object.entries(all)) {
      await writeFile(path.join(OUT, lang, `${ns}.json`), JSON.stringify(messages, null, 2) + "\n");
    }
    console.log(`✓ ${lang}: ${Object.keys(all).length} namespaces`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
