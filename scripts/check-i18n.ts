/**
 * Fails when any locale is missing a key, has an extra key, leaves a value
 * empty, drops an interpolation variable, or when a key used in the code
 * does not exist in English. Also reports English keys no code uses.
 * Usage: npx tsx scripts/check-i18n.ts
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { LOCALES, NAMESPACES } from "../src/i18n/config";

type Tree = { [k: string]: string | Tree };
const DIR = "src/i18n/locales";

function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.set(key, v);
    else for (const [kk, vv] of flatten(v, key)) out.set(kk, vv);
  }
  return out;
}

const vars = (s: string) => [...s.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]).sort().join(",");

async function load(lang: string, ns: string) {
  return flatten(JSON.parse(await readFile(path.join(DIR, lang, `${ns}.json`), "utf8")) as Tree);
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));
  return nested.flat();
}

/**
 * Collect keys referenced in code: t("ns:key"), t("key") with useT("ns"),
 * and template keys like t(`nav.${item}`) expanded from known lists.
 */
async function usedKeys(en: Map<string, Map<string, string>>): Promise<Set<string>> {
  const used = new Set<string>();
  const files = (await walk("src")).filter((f) => /\.tsx?$/.test(f));
  for (const file of files) {
    const code = await readFile(file, "utf8");
    const defaultNs = code.match(/useT\("(\w+)"\)/)?.[1] ?? "common";
    for (const m of code.matchAll(/\bt\(\s*["'`]([^"'`$]+)(\$\{[^}]+\})?([^"'`]*)["'`]/g)) {
      const raw = m[1]!;
      const dynamic = !!m[2];
      const [ns, key] = raw.includes(":") ? (raw.split(":", 2) as [string, string]) : [defaultNs, raw];
      if (dynamic) {
        // Template key: mark every key with this prefix (and suffix) as used.
        const suffix = m[3] ?? "";
        for (const k of en.get(ns)?.keys() ?? []) if (k.startsWith(key) && k.endsWith(suffix)) used.add(`${ns}:${k}`);
      } else {
        used.add(`${ns}:${key}`);
      }
    }
  }
  return used;
}

async function main() {
  const errors: string[] = [];
  const warnings: string[] = [];
  const en = new Map<string, Map<string, string>>();
  for (const ns of NAMESPACES) en.set(ns, await load("en", ns));

  for (const lang of LOCALES) {
    if (lang === "en") continue;
    for (const ns of NAMESPACES) {
      let msgs: Map<string, string>;
      try {
        msgs = await load(lang, ns);
      } catch {
        errors.push(`${lang}/${ns}.json is missing`);
        continue;
      }
      const base = en.get(ns)!;
      for (const [k, v] of base) {
        const t = msgs.get(k);
        if (t === undefined) errors.push(`${lang}/${ns}: missing "${k}"`);
        else if (!t.trim()) errors.push(`${lang}/${ns}: empty "${k}"`);
        else if (vars(t) !== vars(v)) errors.push(`${lang}/${ns}: "${k}" variables {${vars(t)}} ≠ English {${vars(v)}}`);
      }
      for (const k of msgs.keys()) if (!base.has(k)) errors.push(`${lang}/${ns}: extra key "${k}"`);
    }
  }

  const used = await usedKeys(en);
  for (const key of used) {
    const [ns, k] = key.split(":", 2) as [string, string];
    if (!en.get(ns)?.has(k)) errors.push(`code uses missing key ${key}`);
  }
  for (const [ns, map] of en) for (const k of map.keys()) if (!used.has(`${ns}:${k}`)) warnings.push(`unused key ${ns}:${k}`);

  if (warnings.length) console.warn(warnings.map((w) => `! ${w}`).join("\n"));
  if (errors.length) {
    console.error(errors.map((e) => `✗ ${e}`).join("\n"));
    console.error(`\ncheck-i18n: ${errors.length} error(s)`);
    process.exit(1);
  }
  const keyCount = [...en.values()].reduce((a, m) => a + m.size, 0);
  console.log(`✓ check-i18n: ${LOCALES.length} locales × ${NAMESPACES.length} namespaces, ${keyCount} keys each, all present`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
