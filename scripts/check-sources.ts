/**
 * Content integrity check (runs before every build):
 *  - every content module parses with its Zod schema (they validate on import)
 *  - every factId used anywhere exists in the ledger, and every fact's
 *    sourceIds exist
 *  - every imageId exists in the asset manifest, has a licence and alt text
 *    in id + en, and has generated files on disk
 *  - every aksaraId and [[glossary]] term resolves
 *  - article related links resolve
 *  - history entries: period, archive, story and documentary-chapter links
 *    resolve; draft translations cover every entry (validated on import)
 *  - archive manifest: confirmed items have generated images; candidates
 *    have none
 *  - chapter audio: every chapter id is a History period, transcript
 *    sections exist in the scripts, scripts cite only known fact ids, any
 *    audioUrl points at a real file
 *  - batik ornaments: every recorded file exists and has a source
 * Usage: npx tsx scripts/check-sources.ts
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { FACTS, FACT_BY_ID, SOURCE_BY_ID } from "../src/content/sources";
import { ASSETS, ASSET_BY_ID } from "../src/content/assets";
import { AKSARA_BY_ID } from "../src/content/aksara";
import { GLOSSARY, GLOSSARY_BY_ID } from "../src/content/glossary";
import { ETIQUETTE, VISIT_FACT_IDS } from "../src/content/etiquette";
import { SPACES } from "../src/content/spaces";
import { CULTURE } from "../src/content/culture";
import { ENTRIES, PERIODS, RULERS } from "../src/content/history";
import { HISTORY_TRANSLATIONS } from "../src/content/history-translations";
import { ARCHIVE } from "../src/content/archive";
import { CHAPTER_AUDIO, SCRIPT_PATHS, SCRIPT_SECTIONS } from "../src/content/chapter-audio";
import { ORNAMENTS } from "../src/content/ornaments";
import { parseScript } from "../src/content/audio-script";
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
  const original = [path.join("images-raw", `${a.id}.jpg`), path.join("images-raw/archive", `${a.id}.jpg`)];
  if (!a.derivedFrom && !original.some((f) => existsSync(f))) errors.push(`asset ${a.id}: original missing in images-raw/`);
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
const periodIds = new Set(PERIODS.map((p) => p.id));
for (const p of PERIODS) {
  facts(`period ${p.id}`, p.factIds);
  if (p.leadArchiveId) {
    const a = ARCHIVE.find((x) => x.id === p.leadArchiveId);
    if (!a || a.verification !== "confirmed") errors.push(`period ${p.id}: lead archive item "${p.leadArchiveId}" is not a confirmed item`);
  }
  for (const x of p.intro) glossaryRefs(`period ${p.id}`, `${x.en} ${x.id} ${x.jv ?? ""}`);
}
const archiveById = new Map(ARCHIVE.map((a) => [a.id, a]));
for (const e of ENTRIES) {
  const where = `history ${e.id}`;
  if (!periodIds.has(e.periodId)) errors.push(`${where}: unknown period "${e.periodId}"`);
  const period = PERIODS.find((p) => p.id === e.periodId);
  if (period && (e.year < period.from || e.year > period.to)) errors.push(`${where}: year ${e.year} outside period ${period.range}`);
  facts(where, e.factIds);
  for (const d of Object.values(e.details)) if (d) glossaryRefs(where, `${d.en} ${d.id} ${d.jv ?? ""}`);
  for (const id of e.archiveIds) {
    const a = archiveById.get(id);
    if (!a) errors.push(`${where}: unknown archive item "${id}"`);
    else if (a.verification !== "confirmed") errors.push(`${where}: archive item "${id}" is only a candidate`);
  }
  for (const slug of e.relatedArticles) if (!ARTICLES[slug]) errors.push(`${where}: related story "${slug}" does not exist`);
}
const years = ENTRIES.map((e) => e.year);
if (years.some((y, i) => i > 0 && y < years[i - 1]!)) errors.push("history: entries are not in chronological order");
for (const [lang, tr] of Object.entries(HISTORY_TRANSLATIONS)) {
  if (tr.status === "reviewed" && !tr.reviewedBy) errors.push(`history translation ${lang}: reviewed without reviewedBy`);
}

// Archive manifest
for (const a of ARCHIVE) {
  const where = `archive ${a.id}`;
  if (!periodIds.has(a.periodId)) errors.push(`${where}: unknown period "${a.periodId}"`);
  if (a.verification === "confirmed") {
    if (!a.imageId) errors.push(`${where}: confirmed item without image`);
    imageRef(where, a.imageId);
    if (!a.alt) errors.push(`${where}: confirmed item without alt text`);
  } else if (a.imageId) errors.push(`${where}: candidate must not be reproduced`);
}

// Narration scripts and chapter audio
const scripts = new Map<string, ReturnType<typeof parseScript>>();
for (const [lang, scriptPath] of Object.entries(SCRIPT_PATHS)) {
  if (!existsSync(scriptPath)) {
    errors.push(`script ${lang}: ${scriptPath} not found`);
    continue;
  }
  const source = readFileSync(scriptPath, "utf8");
  try {
    const parsed = parseScript(source);
    scripts.set(lang, parsed);
    if (parsed.meta.language !== lang) errors.push(`script ${lang}: front matter language is "${parsed.meta.language}"`);
    const ids = parsed.chapters.map((c) => c.id).join(",");
    if (ids !== SCRIPT_SECTIONS.join(",")) errors.push(`script ${lang}: sections ${ids} ≠ ${SCRIPT_SECTIONS.join(",")}`);
  } catch (err) {
    errors.push(`script ${lang}: ${(err as Error).message}`);
    continue;
  }
  const after = source.slice(source.indexOf("<!-- narration:end -->"));
  for (const m of after.matchAll(/f-[a-z0-9-]+/g)) facts(`script ${lang} sources`, [m[0]]);
}
for (const a of CHAPTER_AUDIO) {
  const where = `chapter audio ${a.chapterId}/${a.lang}`;
  if (!periodIds.has(a.chapterId)) errors.push(`${where}: no History period "${a.chapterId}"`);
  if (a.transcript) {
    const parsed = scripts.get(a.lang);
    for (const sec of a.transcript.sections) if (parsed && !parsed.chapters.some((c) => c.id === sec)) errors.push(`${where}: script has no section "${sec}"`);
    if (parsed && parsed.meta.script_version !== a.transcript.scriptVersion) errors.push(`${where}: script version ${parsed.meta.script_version} ≠ ${a.transcript.scriptVersion}`);
  }
  if (a.audioUrl && !existsSync(path.join("public", a.audioUrl))) errors.push(`${where}: audio file ${a.audioUrl} not found in public/`);
}
for (const p of PERIODS) if (!CHAPTER_AUDIO.some((a) => a.chapterId === p.id)) errors.push(`period ${p.id}: no chapter audio entry`);

// Batik ornaments
for (const o of ORNAMENTS) {
  if (!existsSync(o.file)) errors.push(`ornament ${o.id}: ${o.file} not found`);
  if (o.origin !== "original" && !o.sources.length) errors.push(`ornament ${o.id}: ${o.origin} asset without a source`);
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
