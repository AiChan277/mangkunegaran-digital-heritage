/**
 * Content integrity check (runs before every build):
 *  - every content module parses with its Zod schema (they validate on import)
 *  - every factId used anywhere exists in the ledger, and every fact's
 *    sourceIds exist
 *  - every imageId exists in the asset manifest, has a licence and alt text
 *    in id + en, and has generated files on disk
 *  - every aksaraId and [[glossary]] term resolves
 *  - article related links resolve
 * Usage: npx tsx scripts/check-sources.ts
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { FACTS, FACT_BY_ID, SOURCE_BY_ID } from "../src/content/sources";
import { ASSETS, ASSET_BY_ID } from "../src/content/assets";
import { AKSARA_BY_ID } from "../src/content/aksara";
import { GLOSSARY, GLOSSARY_BY_ID } from "../src/content/glossary";
import { ETIQUETTE, VISIT_FACT_IDS } from "../src/content/etiquette";
import { SPACES } from "../src/content/spaces";
import { CULTURE } from "../src/content/culture";
import { ERAS, RULERS, TIMELINE } from "../src/content/history";
import { HOME, HOME_FACT_IDS } from "../src/content/home";
import { ARTICLES } from "../src/content/articles";
import generated from "../src/content/images.generated.json";

const errors: string[] = [];
const usedFacts = new Set<string>();
const IMAGES = generated as Record<string, { widths: number[] }>;

function facts(where: string, ids: readonly string[] | undefined) {
  for (const id of ids ?? []) {
    usedFacts.add(id);
    if (!FACT_BY_ID.has(id)) errors.push(`${where}: unknown fact "${id}"`);
  }
}

function imageRef(where: string, id: string | undefined) {
  if (!id) return;
  const asset = ASSET_BY_ID.get(id);
  if (!asset) return void errors.push(`${where}: unknown image "${id}"`);
  const gen = IMAGES[id];
  if (!gen) return void errors.push(`${where}: image "${id}" has not been generated (run npm run images)`);
  for (const w of gen.widths) {
    for (const ext of ["avif", "webp"]) {
      if (!existsSync(path.join("public/images", `${id}-${w}.${ext}`))) errors.push(`${where}: missing file ${id}-${w}.${ext}`);
    }
  }
}

function aksaraRef(where: string, id: string | undefined) {
  if (id && !AKSARA_BY_ID.has(id)) errors.push(`${where}: unknown aksara "${id}"`);
}

function glossaryRefs(where: string, text: string) {
  for (const m of text.matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)) {
    if (!GLOSSARY_BY_ID.has(m[1]!)) errors.push(`${where}: unknown glossary term "${m[1]}"`);
  }
}

// Ledger integrity
for (const f of FACTS) {
  if (!f.sourceIds.length) errors.push(`fact ${f.id}: no sources`);
  for (const s of f.sourceIds) if (!SOURCE_BY_ID.has(s)) errors.push(`fact ${f.id}: unknown source "${s}"`);
  const onlyWiki = f.sourceIds.every((s) => s.startsWith("src-wiki"));
  if (onlyWiki) errors.push(`fact ${f.id}: Wikipedia is its only source`);
}

// Assets: licence + alt text
for (const a of ASSETS) {
  if (!a.license.trim()) errors.push(`asset ${a.id}: no licence`);
  if (!a.alt.en.trim() || !a.alt.id.trim()) errors.push(`asset ${a.id}: alt text missing in en or id`);
  if (!a.attributionText.trim()) errors.push(`asset ${a.id}: no attribution`);
  if (!a.derivedFrom && !existsSync(path.join("images-raw", `${a.id}.jpg`))) errors.push(`asset ${a.id}: original missing in images-raw/`);
  imageRef(`asset ${a.id}`, a.id);
}

// Structured content
for (const s of SPACES) {
  facts(`space ${s.id}`, s.factIds);
  facts(`space ${s.id} plan`, s.plan?.factIds);
  imageRef(`space ${s.id}`, s.imageId);
  aksaraRef(`space ${s.id}`, s.aksaraId);
  for (const e of s.etiquetteIds) if (!ETIQUETTE.some((x) => x.id === e)) errors.push(`space ${s.id}: unknown etiquette "${e}"`);
}
for (const c of CULTURE) {
  facts(`culture ${c.id}`, c.factIds);
  imageRef(`culture ${c.id}`, c.imageId);
  aksaraRef(`culture ${c.id}`, c.aksaraId);
}
for (const e of ERAS) {
  facts(`era ${e.id}`, e.factIds);
  imageRef(`era ${e.id}`, e.imageId);
  for (const p of e.paragraphs) glossaryRefs(`era ${e.id}`, `${p.en} ${p.id} ${p.jv ?? ""}`);
}
for (const t of TIMELINE) {
  facts(`timeline ${t.id}`, t.factIds);
  imageRef(`timeline ${t.id}`, t.imageId);
}
for (const r of RULERS) facts(`ruler ${r.ordinal}`, r.factIds);
for (const g of GLOSSARY) facts(`glossary ${g.id}`, g.factIds);
for (const e of ETIQUETTE) facts(`etiquette ${e.id}`, e.factIds);
facts("home", HOME_FACT_IDS);
facts("visit", Object.values(VISIT_FACT_IDS));
for (const p of HOME.intro) facts("home intro", p.factIds);
facts("home arts", HOME.arts.factIds);
for (const c of HOME.continuity) {
  facts("home continuity", c.factIds);
  imageRef("home continuity", c.imageId);
}

for (const [slug, records] of Object.entries(ARTICLES)) {
  for (const [lang, a] of Object.entries(records)) {
    if (!a) continue;
    const where = `article ${slug}/${lang}`;
    facts(where, a.factIds);
    imageRef(where, a.heroImageId);
    for (const b of a.body) {
      if ("factIds" in b) facts(where, b.factIds);
      if (b.type === "figure") imageRef(where, b.imageId);
      if ("text" in b) glossaryRefs(where, b.text);
      // Every block's facts must also be listed on the article so they appear in its sources.
      if ("factIds" in b) for (const f of b.factIds) if (!a.factIds.includes(f)) errors.push(`${where}: block cites ${f} not in article factIds`);
    }
    for (const r of a.related) if (!ARTICLES[r]) errors.push(`${where}: related article "${r}" does not exist`);
  }
}

// Facts that nothing displays are allowed (e.g. kept for the record) but reported.
const unused = FACTS.filter((f) => !usedFacts.has(f.id)).map((f) => f.id);

if (unused.length) console.warn(`! facts recorded but not cited on any page: ${unused.join(", ")}`);
if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  console.error(`\ncheck-sources: ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`✓ check-sources: ${FACTS.length} facts, ${SOURCE_BY_ID.size} sources, ${ASSETS.length} images — all references resolve`);
