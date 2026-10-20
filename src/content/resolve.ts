/**
 * Helpers used by route loaders to turn content records into plain,
 * serialisable view data for one content language.
 */
import type { ContentLang } from "~/i18n/config";
import { ASSET_BY_ID } from "./assets";
import { AKSARA_BY_ID } from "./aksara";
import { GLOSSARY } from "./glossary";
import { FACT_BY_ID, sourcesForFacts } from "./sources";
import type { Localized } from "./schema";
import generated from "./images.generated.json";

type Generated = Record<string, { width: number; height: number; color: string; widths: number[] }>;
const IMAGES = generated as Generated;

/** Pick text for a content language; Javanese falls back to Indonesian. */
export function pick(text: Localized, lang: ContentLang): string {
  if (lang === "jv") return text.jv ?? text.id;
  return text[lang];
}

export type ImageView = {
  id: string;
  alt: string;
  width: number;
  height: number;
  color: string;
  widths: number[];
  focalPoint: string;
  attribution: string;
  license: string;
  licenseUrl?: string;
  sourcePageUrl: string;
  author: string;
  archival: boolean;
  dated?: string;
  subject: string;
};

export function image(id: string, lang: ContentLang): ImageView {
  const asset = ASSET_BY_ID.get(id);
  const gen = IMAGES[id];
  if (!asset || !gen) throw new Error(`Unknown image id: ${id}`);
  return {
    id,
    alt: pick(asset.alt, lang),
    width: gen.width,
    height: gen.height,
    color: gen.color,
    widths: gen.widths,
    focalPoint: asset.focalPoint,
    attribution: asset.attributionText,
    license: asset.license,
    licenseUrl: asset.licenseUrl,
    sourcePageUrl: asset.sourcePageUrl,
    author: asset.author,
    archival: asset.archival,
    dated: asset.dated,
    subject: asset.subject,
  };
}

export type AksaraView = { latin: string; javanese: string; reviewed: boolean };

export function aksara(id: string | undefined): AksaraView | undefined {
  if (!id) return undefined;
  const a = AKSARA_BY_ID.get(id);
  if (!a) throw new Error(`Unknown aksara id: ${id}`);
  return { latin: a.latin, javanese: a.javanese, reviewed: a.status === "reviewed" };
}

export type SourceView = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  published?: string;
  accessed: string;
  archived?: boolean;
};

export function sources(factIds: readonly string[]): SourceView[] {
  return sourcesForFacts(factIds).map(({ id, title, publisher, url, published, accessed, archived }) => ({
    id,
    title,
    publisher,
    url,
    published,
    accessed,
    archived,
  }));
}

export type DisputeView = { factId: string; claim: string; notes?: string };

/** Disputed facts among a set, so pages can say "sources differ". */
export function disputes(factIds: readonly string[]): DisputeView[] {
  return factIds
    .map((id) => FACT_BY_ID.get(id))
    .filter((f): f is NonNullable<typeof f> => !!f && f.confidence === "disputed")
    .map((f) => ({ factId: f.id, claim: f.claim, notes: f.notes }));
}

export type GlossaryView = Record<string, { term: string; definition: string }>;

export function glossary(lang: ContentLang): GlossaryView {
  return Object.fromEntries(GLOSSARY.map((g) => [g.id, { term: g.term, definition: pick(g.definition, lang) }]));
}
