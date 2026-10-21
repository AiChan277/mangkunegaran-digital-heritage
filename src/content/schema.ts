/**
 * Zod schemas for every content module. scripts/check-sources.ts parses all
 * content with these schemas and fails the build on any invalid entry or
 * unresolved fact / asset id.
 */
import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

/** Text available per content language. id + en are required; jv optional. */
export const localized = z.object({
  id: z.string().min(1),
  en: z.string().min(1),
  jv: z.string().min(1).optional(),
});
export type Localized = z.infer<typeof localized>;

/* ── Sources & fact ledger ─────────────────────────────────────────────── */

export const sourceSchema = z.object({
  id: z.string().regex(/^src-[a-z0-9-]+$/),
  title: z.string(),
  publisher: z.string(),
  url: z.url(),
  /** Page publication date when the page states one. */
  published: isoDate.optional(),
  accessed: isoDate,
  kind: z.enum(["primary", "secondary", "supporting"]),
  /** Archived copy of a page that is no longer online. */
  archived: z.boolean().optional(),
  note: z.string().optional(),
});
export type Source = z.infer<typeof sourceSchema>;

export const factSchema = z.object({
  id: z.string().regex(/^f-[a-z0-9-]+$/),
  claim: z.string(),
  usedOn: z.array(z.string()).min(1),
  sourceIds: z.array(z.string()).min(1),
  confidence: z.enum(["confirmed", "single-source", "disputed"]),
  notes: z.string().optional(),
});
export type Fact = z.infer<typeof factSchema>;

/* ── Images ────────────────────────────────────────────────────────────── */

export const assetSchema = z.object({
  id: z.string(),
  subject: z.string(),
  sourcePageUrl: z.url(),
  originalFileUrl: z.url(),
  author: z.string().min(1),
  license: z.string().min(1),
  licenseUrl: z.url().optional(),
  attributionText: z.string().min(1),
  alt: localized,
  intendedUse: z.string(),
  /** CSS object-position for art-directed crops, e.g. "50% 40%". */
  focalPoint: z.string().default("50% 50%"),
  /** True for photographs that are genuine historical records. */
  archival: z.boolean().default(false),
  /** Date or period as stated by the source, if any. */
  dated: z.string().optional(),
  derivedFrom: z.string().optional(),
});
export type Asset = z.infer<typeof assetSchema>;

/* ── Editorial blocks ──────────────────────────────────────────────────── */

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string(), factIds: z.array(z.string()).default([]) }),
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({
    type: z.literal("figure"),
    imageId: z.string(),
    caption: z.string().optional(),
    wide: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("quote"),
    text: z.string(),
    cite: z.string(),
    factIds: z.array(z.string()).min(1),
  }),
  z.object({ type: z.literal("note"), text: z.string(), factIds: z.array(z.string()).default([]) }),
]);
export type Block = z.infer<typeof blockSchema>;

export const articleSchema = z.object({
  id: z.string(),
  lang: z.enum(["id", "en", "jv"]),
  title: z.string(),
  dek: z.string(),
  heroImageId: z.string(),
  body: z.array(blockSchema).min(3),
  factIds: z.array(z.string()).min(1),
  translationStatus: z.enum(["source", "ai-draft", "reviewed"]),
  reviewedBy: z.string().optional(),
  verifiedAt: isoDate,
  related: z.array(z.string()).default([]),
});
export type Article = z.infer<typeof articleSchema>;

/* ── Structured content ───────────────────────────────────────────────── */

/* ── History (iteration 2) ────────────────────────────────────────────── */

export const historyPeriodSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  numeral: z.string(),
  range: z.string(),
  from: z.number().int(),
  to: z.number().int(),
  title: localized,
  intro: z.array(localized).min(1),
  factIds: z.array(z.string()).default([]),
  /** Optional sourced side note shown in the margin. */
  sideNote: localized.optional(),
  /** Confirmed archive item shown as the chapter's lead image. */
  leadArchiveId: z.string().optional(),
});
export type HistoryPeriod = z.infer<typeof historyPeriodSchema>;

/**
 * A timeline event. The id is stable across all languages; translations in
 * src/content/history-translations/<lang>.ts attach to the same id.
 */
export const historyEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  periodId: z.string(),
  /** Machine-sortable year (first year of a range). */
  year: z.number().int(),
  date: localized,
  /** "exact" | "range" | "approximate" — shown as a small label. */
  precision: z.enum(["exact", "range", "approximate"]).default("exact"),
  title: localized,
  summary: localized,
  details: z.object({
    context: localized.optional(),
    happened: localized,
    significance: localized,
    uncertainty: localized.optional(),
  }),
  /** Names as written in the sources; not translated. */
  people: z.array(z.string()).default([]),
  factIds: z.array(z.string()).min(1),
  archiveIds: z.array(z.string()).default([]),
  relatedArticles: z.array(z.string()).default([]),
  /** Highlight with the royal-green marker (major turning points). */
  milestone: z.boolean().default(false),
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;
export type HistoryEntryInput = z.input<typeof historyEntrySchema>;
export type HistoryPeriodInput = z.input<typeof historyPeriodSchema>;

/** Draft translations of short history fields for languages without full text. */
export const historyTranslationSchema = z.object({
  lang: z.string(),
  status: z.enum(["ai-draft", "reviewed"]),
  sourceLanguage: z.enum(["en", "id"]),
  translatedAt: isoDate,
  reviewedBy: z.string().optional(),
  periods: z.record(z.string(), z.object({ title: z.string(), intro: z.string().optional() })),
  entries: z.record(z.string(), z.object({ title: z.string(), summary: z.string(), date: z.string().optional() })),
});
export type HistoryTranslation = z.infer<typeof historyTranslationSchema>;

/* ── Archive (iteration 2) ────────────────────────────────────────────── */

export const archiveItemSchema = z.object({
  id: z.string(),
  kind: z.enum(["photograph", "postcard", "painting", "newspaper", "document"]),
  /** Catalogue title as published by the holding institution (original language). */
  originalTitle: z.string(),
  title: localized,
  description: localized,
  dateLabel: localized,
  year: z.number().int(),
  creator: z.string(),
  institution: z.string(),
  /** Persistent record at the holding institution. */
  recordUrl: z.url(),
  /** Where the reproduction was obtained (e.g. Wikimedia Commons file page). */
  mediaPageUrl: z.url().optional(),
  originalFileUrl: z.url().optional(),
  rightsStatement: z.string(),
  license: z.string(),
  licenseUrl: z.url().optional(),
  attributionText: z.string(),
  /** confirmed = relevance and rights checked; candidate = linked only, needs review. */
  verification: z.enum(["confirmed", "candidate"]),
  periodId: z.string(),
  /** Local image id when the file is self-hosted (confirmed items only). */
  imageId: z.string().optional(),
  alt: localized.optional(),
  note: localized.optional(),
  modifications: z.string().optional(),
});
export type ArchiveItem = z.infer<typeof archiveItemSchema>;

/* ── Chapter audio ───────────────────────────────────────────────────── */

/**
 * Narration for one History chapter (period) in one language. Data only:
 * adding a language or a recording never requires a new component.
 */
export const chapterAudioSchema = z.object({
  /** Stable History period id, e.g. "foundation". */
  chapterId: z.string(),
  /** Locale code of the narration. */
  lang: z.string(),
  /** Unset until a genuine recording exists. */
  audioUrl: z.string().optional(),
  status: z.enum(["script-draft", "ready-for-recording", "recorded", "reviewed", "published"]),
  /** Where the narration text lives: a script file and its section ids. */
  transcript: z
    .object({
      scriptPath: z.string(),
      sections: z.array(z.string()).min(1),
      scriptVersion: z.string(),
    })
    .optional(),
  /** Measured duration of a real recording; never estimated. */
  durationSeconds: z.number().int().positive().optional(),
  credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
  published: z.boolean().default(false),
});
export type ChapterAudio = z.infer<typeof chapterAudioSchema>;
export type ChapterAudioInput = z.input<typeof chapterAudioSchema>;

export const rulerSchema = z.object({
  ordinal: z.string(),
  name: z.string(),
  reign: z.string(),
  factIds: z.array(z.string()).min(1),
  disputed: localized.optional(),
});
export type Ruler = z.infer<typeof rulerSchema>;

export const spaceSchema = z.object({
  id: z.string(),
  order: z.number().int(),
  name: z.string(),
  aksaraId: z.string().optional(),
  kicker: localized,
  summary: localized,
  body: z.array(localized).min(1),
  factIds: z.array(z.string()).min(1),
  imageId: z.string().optional(),
  /**
   * Hotspot on the schematic site plan, as % of the plan's viewBox.
   * Omitted when no non-Wikipedia source states where the space is.
   */
  plan: z
    .object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100), factIds: z.array(z.string()).min(1) })
    .optional(),
  etiquetteIds: z.array(z.string()).default([]),
});
export type Space = z.infer<typeof spaceSchema>;

export const cultureFeatureSchema = z.object({
  id: z.string(),
  title: localized,
  kicker: localized,
  summary: localized,
  body: z.array(localized).min(2),
  factIds: z.array(z.string()).min(1),
  imageId: z.string().optional(),
  imageCaption: localized.optional(),
  aksaraId: z.string().optional(),
  /** Optional typographic data panel (e.g. stanza counts per metre). */
  figures: z.array(z.object({ label: z.string(), value: z.number() })).optional(),
});
export type CultureFeature = z.infer<typeof cultureFeatureSchema>;

export const etiquetteSchema = z.object({
  id: z.string(),
  icon: z.enum([
    "no-shorts",
    "modest-dress",
    "no-parang",
    "no-headwear",
    "no-sunglasses",
    "no-velvet",
    "no-flipflops",
    "camera-permission",
    "no-tripod",
    "no-food",
    "no-weapons",
    "no-smoking",
    "keep-off-grass",
    "litter",
    "guide",
    "arrive-early",
    "cashless",
    "children-free",
  ]),
  group: z.enum(["dress", "photo", "conduct", "tour"]),
  /** Label text lives in i18n (visit:rules.<id>) so it exists in all 12 locales. */
  factIds: z.array(z.string()).min(1),
});
export type Etiquette = z.infer<typeof etiquetteSchema>;

export const aksaraSchema = z.object({
  id: z.string(),
  latin: z.string(),
  javanese: z.string().regex(/^[ꦀ-꧟\s]+$/, "Javanese script only"),
  status: z.enum(["awaiting-review", "reviewed"]),
  note: z.string().optional(),
});
export type Aksara = z.infer<typeof aksaraSchema>;

export type ArticleInput = z.input<typeof articleSchema>;
export type SpaceInput = z.input<typeof spaceSchema>;
export type AssetInput = z.input<typeof assetSchema>;

/**
 * Validate a content collection when its module loads. Route loaders run at
 * build time (prerender), so an invalid entry fails the build.
 */
export function parseAll<S extends z.ZodType>(schema: S, items: readonly unknown[], collection: string): z.output<S>[] {
  return items.map((item, i) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      const id = (item as { id?: string })?.id ?? `#${i}`;
      throw new Error(`Invalid ${collection} entry "${id}":\n${z.prettifyError(result.error)}`);
    }
    return result.data;
  });
}

export const glossarySchema = z.object({
  id: z.string(),
  term: z.string(),
  definition: localized,
  factIds: z.array(z.string()).min(1),
});
export type GlossaryEntry = z.infer<typeof glossarySchema>;
