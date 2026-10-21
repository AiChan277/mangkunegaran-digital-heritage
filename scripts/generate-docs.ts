/**
 * Regenerates docs/FACT_LEDGER.md, docs/ASSET_MANIFEST.md,
 * docs/TRANSLATION_STATUS.md, docs/ARCHIVE_RESEARCH.md, docs/AUDIO.md and
 * docs/BATIK_ASSETS.md
 * from the typed sources of truth, so the docs
 * never drift from what the site actually uses.
 * Usage: npx tsx scripts/generate-docs.ts
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { FACTS, SOURCES } from "../src/content/sources";
import { ASSETS } from "../src/content/assets";
import { AKSARA } from "../src/content/aksara";
import { LOCALES, LOCALE_INFO, NAMESPACES, contentStatus, uiStatus } from "../src/i18n/config";
import { ARCHIVE } from "../src/content/archive";
import { CHAPTER_AUDIO, SCRIPT_PATHS } from "../src/content/chapter-audio";
import { ORNAMENTS } from "../src/content/ornaments";
import { PERIODS } from "../src/content/history";
import { parseScript } from "../src/content/audio-script";
import { HISTORY_TRANSLATIONS } from "../src/content/history-translations";
import generated from "../src/content/images.generated.json";

const cell = (s: string | undefined) => (s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const IMAGES = generated as Record<string, { width: number; height: number; widths: number[] }>;

async function ledger() {
  const lines = [
    "# Fact ledger",
    "",
    "Generated from `src/content/sources.ts` by `scripts/generate-docs.ts`. Do not edit by hand.",
    "",
    "Every date or historical claim rendered on the site cites one of these facts; `npm run check:sources` fails the build if a page cites an unknown fact, or if a fact's only source is Wikipedia.",
    "",
    "**Spelling convention:** the institution is written *Mangkunegaran*, as on mangkunegaran.id. Ruler titles use *Mangkunegara I–X*; the official site writes *Mangkoenagoro*. Variants such as *Mangkunagaran* appear only in source titles.",
    "",
    `**Totals:** ${FACTS.length} facts · ${FACTS.filter((f) => f.confidence === "confirmed").length} confirmed · ${FACTS.filter((f) => f.confidence === "single-source").length} single-source · ${FACTS.filter((f) => f.confidence === "disputed").length} disputed`,
    "",
    "## Facts",
    "",
    "| id | claim | used on | sources | confidence | notes |",
    "|---|---|---|---|---|---|",
    ...FACTS.map((f) => `| \`${f.id}\` | ${cell(f.claim)} | ${f.usedOn.join(", ")} | ${f.sourceIds.map((s) => `\`${s}\``).join(", ")} | ${f.confidence} | ${cell(f.notes)} |`),
    "",
    "## Sources",
    "",
    "| id | title | publisher | kind | published | accessed | URL |",
    "|---|---|---|---|---|---|---|",
    ...SOURCES.map((s) => `| \`${s.id}\` | ${cell(s.title)} | ${cell(s.publisher)} | ${s.kind}${s.archived ? " (archived)" : ""} | ${s.published ?? "—"} | ${s.accessed} | ${s.url} |`),
    "",
    "## Sources that could not be used",
    "",
    "- **Britannica, “Mangkunegara I”** — returned HTTP 403 to our fetch on 2026-10-20; not cited.",
    "- **Kemendikbud cultural-heritage registry** — not consulted in this pass; the heritage-registration number given on Indonesian Wikipedia (CB.1240) is therefore not shown on the site.",
    "- **Tempo (22 Dec 2022) on Pracima Tuin** — cited by Wikipedia but not read directly; Good News From Indonesia was used instead.",
    "",
  ];
  await writeFile("docs/FACT_LEDGER.md", lines.join("\n"));
}

async function manifest() {
  const lines = [
    "# Asset manifest",
    "",
    "Generated from `src/content/assets.ts` by `scripts/generate-docs.ts`. Do not edit by hand.",
    "",
    "Image strategy: **open-license**. Every image is downloaded once into `images-raw/`, converted by `scripts/optimize-images.ts` into AVIF + WebP at several widths, and self-hosted from `public/images/`. Nothing is hotlinked.",
    "",
    "Excluded during selection (2026-10-20): three Commons photos in which the palace crest is the main subject (a gable detail, the Pracimayasa interior, and the uncropped Pringgitan view), plus a duplicate front view. The Pringgitan photo is used only as a crop below the crest.",
    "",
    "| id | subject | author | licence | source page | size | widths | focal point | archival | use |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...ASSETS.map((a) => {
      const g = IMAGES[a.id];
      return `| \`${a.id}\` | ${cell(a.subject)}${a.derivedFrom ? ` (crop of \`${a.derivedFrom}\`)` : ""} | ${cell(a.author)} | ${a.licenseUrl ? `[${a.license}](${a.licenseUrl})` : a.license} | [Commons](${a.sourcePageUrl}) | ${g ? `${g.width}×${g.height}` : "—"} | ${g?.widths.join(", ") ?? "—"} | ${a.focalPoint} | ${a.archival ? `yes — ${a.dated ?? ""}` : "no"} | ${cell(a.intendedUse)} |`;
    }),
    "",
    "## Alt text",
    "",
    "| id | en | id |",
    "|---|---|---|",
    ...ASSETS.map((a) => `| \`${a.id}\` | ${cell(a.alt.en)} | ${cell(a.alt.id)} |`),
    "",
    "## Attribution text (as displayed)",
    "",
    ...ASSETS.map((a) => `- \`${a.id}\`: ${a.attributionText}`),
    "",
  ];
  await writeFile("docs/ASSET_MANIFEST.md", lines.join("\n"));
}

async function translation() {
  const label = { source: "original", "ai-draft": "AI draft", partial: "partial (AI draft)", missing: "falls back" } as const;
  const lines = [
    "# Translation status",
    "",
    "Generated from `src/i18n/config.ts` by `scripts/generate-docs.ts`. Do not edit by hand.",
    "",
    "- **original** — written for this site in Indonesian and English from the cited sources (drafted with an AI assistant; team review recommended).",
    "- **AI draft** — translated with an AI assistant; awaiting review by a native speaker.",
    "- **partial (AI draft)** — History only: period and entry titles, dates and summaries are AI drafts in this language; extended explanations, the documentary and archive captions fall back to English.",
    "- **falls back** — no editorial version yet: shown in English (Indonesian for Javanese), marked with the right `lang`; the language panel states each language's status.",
    "",
    "## UI strings (all namespaces)",
    "",
    `Namespaces: ${NAMESPACES.join(", ")}.`,
    "",
    "| locale | language | tier | UI strings |",
    "|---|---|---|---|",
    ...LOCALES.map((l) => `| \`${l}\` | ${LOCALE_INFO[l].nativeName} (${LOCALE_INFO[l].englishName}) | ${LOCALE_INFO[l].tier} | ${label[uiStatus(l)]} |`),
    "",
    "## Editorial content",
    "",
    "| locale | home | history | architecture | culture | stories | visit | about |",
    "|---|---|---|---|---|---|---|---|",
    ...LOCALES.map(
      (l) =>
        `| \`${l}\` | ${["home", "history", "architecture", "culture", "stories", "visit", "about"].map((p) => label[contentStatus(l, p)]).join(" | ")} |`,
    ),
    "",
    "## History translations (titles, dates, summaries)",
    "",
    "Indonesian and English are the editorial originals in `src/content/history.ts`. The files below translate only the short fields; the History page marks every fallback field with its real `lang`.",
    "",
    "| locale | status | translated from | date | reviewed by |",
    "|---|---|---|---|---|",
    ...Object.values(HISTORY_TRANSLATIONS).map((h) => `| \`${h.lang}\` | ${h.status} | ${h.sourceLanguage} | ${h.translatedAt} | ${h.reviewedBy ?? "—"} |`),
    "",
    "## Aksara Jawa titles",
    "",
    "All transliterations below are AI-drafted and **awaiting native review**. Set `JAVANESE_REVIEWER` and change each entry's status to `reviewed` in `src/content/aksara.ts` once checked.",
    "",
    "| id | Latin | Aksara Jawa | status | note |",
    "|---|---|---|---|---|",
    ...AKSARA.map((a) => `| \`${a.id}\` | ${a.latin} | ${a.javanese} | ${a.status} | ${cell(a.note)} |`),
    "",
  ];
  await writeFile("docs/TRANSLATION_STATUS.md", lines.join("\n"));
}

async function archive() {
  const confirmed = ARCHIVE.filter((a) => a.verification === "confirmed").sort((a, b) => a.year - b.year);
  const candidates = ARCHIVE.filter((a) => a.verification === "candidate");
  const lines = [
    "# Archive research",
    "",
    "Generated from `src/content/archive.ts` by `scripts/generate-docs.ts`. Do not edit by hand; edit the manifest and regenerate.",
    "",
    "## Method",
    "",
    "- **Where we looked:** Leiden University Libraries (KITLV collection, via its Wikimedia Commons uploads and handle records), the Rijksmuseum, Wikimedia Commons, Delpher, and the Library of Congress World Digital Library record of the same Woodbury & Page view.",
    "- **What “confirmed” means:** the holding institution's catalogue describes the item as Mangkunegaran (the court, its rulers or its buildings), the record and rights statement were read, and the rights allow reuse (CC BY 4.0 or public domain). Confirmed files are self-hosted in `images-raw/archive/` and converted to AVIF/WebP without crops, filters or tonal changes.",
    "- **What “candidate” means:** relevant, but the content or the rights are not yet checked. Candidates are linked to their source only and are never downloaded or shown as images.",
    "- **Dates and titles** are the institution's catalogue values. Where two catalogues disagree, both are shown (see the note on the 1874 pendhapa).",
    "- **Access controls:** none were bypassed. Delpher refused automated requests (HTTP 403); we stopped there and list it as a candidate source for manual research.",
    "",
    `**Totals:** ${confirmed.length} confirmed · ${candidates.length} candidates`,
    "",
    "## Confirmed items",
    "",
    "| id | catalogue date | title (catalogue) | creator | institution | licence | record | file page | used on |",
    "|---|---|---|---|---|---|---|---|---|",
    ...confirmed.map(
      (a) =>
        `| \`${a.id}\` | ${cell(a.dateLabel.en)} | ${cell(a.originalTitle)} | ${cell(a.creator)} | ${cell(a.institution)} | ${a.license} | ${a.recordUrl} | ${a.mediaPageUrl ?? "—"} | History · period \`${a.periodId}\` |`,
    ),
    "",
    "## Notes on individual items",
    "",
    ...confirmed.filter((a) => a.note).map((a) => `- \`${a.id}\`: ${cell(a.note!.en)}`),
    "",
    "## Candidates (not reproduced)",
    "",
    "| id | title | institution | date | link | why it is not confirmed |",
    "|---|---|---|---|---|---|",
    ...candidates.map((a) => `| \`${a.id}\` | ${cell(a.title.en)} | ${cell(a.institution)} | ${cell(a.dateLabel.en)} | ${a.recordUrl} | ${cell(a.description.en)} |`),
    "",
  ];
  await writeFile("docs/ARCHIVE_RESEARCH.md", lines.join("\n"));
}

async function audio() {
  const recorded = CHAPTER_AUDIO.filter((a) => a.audioUrl);
  const synthetic = recorded.filter((a) => a.synthetic);
  const status =
    recorded.length === 0
      ? "**No narration has been recorded.** Every chapter and language is *ready-for-recording*: the page shows “Not yet recorded”, no play button, no duration and no waveform, and the chapter text is complete without audio."
      : `${recorded.length} of ${CHAPTER_AUDIO.length} chapter narrations have a file${synthetic.length ? `; **${synthetic.length} use a synthetic (AI) voice**, made by \`scripts/generate-voice-over.ts\` with Microsoft Edge neural voices, and the player labels them “AI voice” in every language. No human narrator has recorded them` : ""}. Files are mono MP3 and are not downloaded until the visitor presses play. A chapter without a file shows “Not yet recorded” and no play button.`;
  const lines = [
    "# Chapter audio",
    "",
    "Generated from `src/content/chapter-audio.ts` and the scripts in `content/audio/` by `scripts/generate-docs.ts`.",
    "",
    `Audio belongs to each History chapter (period), not to a separate documentary section. ${status}`,
    "",
    "| chapter | language | status | script sections | audio file | voice | duration | published |",
    "|---|---|---|---|---|---|---|---|",
    ...CHAPTER_AUDIO.map(
      (a) =>
        `| \`${a.chapterId}\` | ${a.lang} | ${a.status} | ${a.transcript ? a.transcript.sections.join(", ") : "—"} | ${a.audioUrl ?? "—"} | ${a.audioUrl ? `${a.credits.find((c) => c.role === "voice")?.name ?? "—"}${a.synthetic ? " (synthetic, AI)" : ""}` : "—"} | ${a.durationSeconds ? `${a.durationSeconds} s (measured)` : "—"} | ${a.published ? "yes" : "no"} |`,
    ),
    "",
    "## Narration scripts",
    "",
  ];
  for (const [lang, file] of Object.entries(SCRIPT_PATHS)) {
    const s = parseScript(await readFile(file, "utf8"));
    lines.push(`- \`${file}\` (${lang}) — version ${s.meta.script_version}, ${s.wordCount} words of narration in ${s.chapters.length} sections. Word counts are for planning only; no duration is shown on the site until a recording is measured.`);
  }
  lines.push(
    "",
    "## Regenerating the synthetic narration",
    "",
    "1. `npm run voice-over:sample` writes about one minute per candidate voice to `sample-audio/` (git-ignored) for choosing a voice.",
    "2. `npm run voice-over` reads the scripts through `parseScript` (only narration between the markers; headings and blockquote notes are never read), turns each `PAUSE`/`JEDA` into silence of the stated length, adds a 0.5 s breath between other paragraphs, calibrates the speaking rate per chapter to the script's words per minute, and writes `public/audio/<chapter>-<lang>.mp3` (mono, 48 kbps). It prints each file's measured duration.",
    "3. Copy those durations into `RECORDINGS` in `src/content/chapter-audio.ts`, then run this generator.",
    "4. Names the voice would misread are respelled for the voice only in `scripts/tts-lexicon.ts`; the scripts and the site keep the original spelling.",
    "",
    "## Recording and publishing one chapter (human narrator)",
    "",
    "1. Record the sections listed for that chapter from the script. Read only the narration between the markers; blockquote lines (`> SOUND:`, `> PAUSE:`, `> SUARA:`, `> JEDA:`) are production notes.",
    "2. Export a compressed file (for example AAC in M4A or Opus in WebM, mono, ~64 kbps) to `public/audio/`, e.g. `public/audio/foundation-id.m4a`.",
    "3. In `src/content/chapter-audio.ts` set, for that chapter and language: `audioUrl`, the measured `durationSeconds`, `credits` (narrator, recording), `status` (`recorded` → `reviewed` → `published`) and `published: true`.",
    "4. `npm run check:sources` verifies the file exists and that a duration is never set without a recording. The chapter then shows real controls: play/pause, seek, current time and duration, mute, loading and error states.",
    "5. Another language is one more entry per chapter; no component changes are needed.",
    "",
    `Chapters: ${PERIODS.map((p) => `\`${p.id}\` (${p.range})`).join(", ")}.`,
    "",
  );
  await writeFile("docs/AUDIO.md", lines.join("\n"));
}

async function batik() {
  const lines = [
    "# Batik ornament assets",
    "",
    "Generated from `src/content/ornaments.ts` by `scripts/generate-docs.ts`. The files are built by `scripts/build-batik.py`; the original CC0 source file is kept in `assets-src/batik/`.",
    "",
    "## Why kawung",
    "",
    "- **Not parang.** mangkunegaran.id (“Motif Batik Mangkunegaran”, 13 Aug 2024) says that inside Pura Mangkunegaran parang is still a *larangan* motif reserved for the core family, and the official reservation page asks visitors not to wear parang or lereng. An unofficial site should not use it as decoration. (The earlier parang-style accent on this site has been removed.)",
    "- **Mangkunegaran's own motifs** named in that article — Buketan Pakis, Sapanti Nata, Wahyu Tumurun, Parang Kesit Barong, Parang Sondhen, Parang Klithik Glebag Seruni, Liris Cemeng, Buketan Paris — have no openly licensed vector or reference image that we could verify.",
    "- **Not truntum:** popular accounts link it to the Kasunanan court (not verified here), and the site must not mix the two courts' symbols.",
    "- **Kawung** is a classical Javanese motif documented in a dated museum sample and available as a CC0 vector. It is **not** presented as a Mangkunegaran motif and no royal meaning is claimed for it.",
    "",
    "## Assets",
    "",
    "| id | file | motif | use | origin | modifications |",
    "|---|---|---|---|---|---|",
    ...ORNAMENTS.map((o) => `| \`${o.id}\` | \`${o.file}\` | ${cell(o.motif)} | ${cell(o.use)} | ${o.origin} | ${cell(o.modifications)} |`),
    "",
    "## Sources",
    "",
  ];
  const seen = new Set<string>();
  for (const src of ORNAMENTS.flatMap((o) => o.sources)) {
    if (seen.has(src.url)) continue;
    seen.add(src.url);
    lines.push(
      `- **${src.role === "base-vector" ? "Base vector" : "Reference"}:** ${src.title} — ${src.creator}${src.institution ? `, ${src.institution}` : ""}${src.date ? `, ${src.date}` : ""}. ${src.license}${src.attributionRequired ? " (attribution required)" : " (no attribution required)"}. ${src.url}`,
    );
  }
  lines.push(
    "",
    `**Attribution used on the site and in the files:** ${ORNAMENTS[0]!.attribution}`,
    "",
    "## How the ornament is used",
    "",
    "- The SVG files are applied as CSS masks so they take the colour of their surface; CSS only colours, sizes and positions them. No batik is drawn with CSS gradients or pseudo-element shapes.",
    "- `kawung-tile` — a low-contrast field behind hero text (13% opacity, faded towards the content).",
    "- `kawung-border` — one thin row where every royal-green hero meets the paper content, above a gold hairline.",
    "- `kawung-flower` — a single four-leaf mark in the gold `HeritageDivider` between sections, History chapters and in the footer.",
    "- Motion: one entrance per page (fade and a 24 px slide for the field, fade for the border). Nothing loops; all of it is off under `prefers-reduced-motion`.",
    "",
  );
  await writeFile("docs/BATIK_ASSETS.md", lines.join("\n"));
}

async function main() {
  await mkdir("docs", { recursive: true });
  await Promise.all([ledger(), manifest(), translation(), archive(), audio(), batik()]);
  console.log("✓ docs/FACT_LEDGER.md, ASSET_MANIFEST.md, TRANSLATION_STATUS.md, ARCHIVE_RESEARCH.md, AUDIO.md, BATIK_ASSETS.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
