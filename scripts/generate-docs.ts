/**
 * Regenerates docs/FACT_LEDGER.md, docs/ASSET_MANIFEST.md and
 * docs/TRANSLATION_STATUS.md from the typed sources of truth, so the docs
 * never drift from what the site actually uses.
 * Usage: npx tsx scripts/generate-docs.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import { FACTS, SOURCES } from "../src/content/sources";
import { ASSETS } from "../src/content/assets";
import { AKSARA } from "../src/content/aksara";
import { LOCALES, LOCALE_INFO, NAMESPACES, contentStatus, uiStatus } from "../src/i18n/config";
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
  const label = { source: "original", "ai-draft": "AI draft", missing: "falls back" } as const;
  const lines = [
    "# Translation status",
    "",
    "Generated from `src/i18n/config.ts` by `scripts/generate-docs.ts`. Do not edit by hand.",
    "",
    "- **original** — written for this site in Indonesian and English from the cited sources (drafted with an AI assistant; team review recommended).",
    "- **AI draft** — translated with an AI assistant; awaiting review by a native speaker.",
    "- **falls back** — no editorial version yet: shown in English (Indonesian for Javanese) with a visible notice.",
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

async function main() {
  await mkdir("docs", { recursive: true });
  await Promise.all([ledger(), manifest(), translation()]);
  console.log("✓ docs/FACT_LEDGER.md, docs/ASSET_MANIFEST.md, docs/TRANSLATION_STATUS.md");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
