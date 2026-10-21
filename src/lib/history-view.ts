/**
 * Builds serialisable History page data for one locale.
 *
 * Every text field carries the language it is actually written in, so the
 * page can set `lang` on anything shown in a fallback language:
 *  - id / en: editorial text
 *  - jv: period texts in draft Javanese where written; titles, dates and
 *    summaries from history-translations/jv; extended text in Indonesian
 *  - Tier 3: titles, dates and summaries from history-translations/<lang>
 *    (AI drafts); extended text, archive captions and the documentary in
 *    English
 */
import { type ContentLang, type Locale } from "~/i18n/config";
import { ENTRIES, PERIODS, RULERS } from "~/content/history";
import { HISTORY_TRANSLATIONS } from "~/content/history-translations";
import { ARCHIVE, ARCHIVE_BY_ID } from "~/content/archive";
import { ARTICLES } from "~/content/articles";
import { CHAPTER_AUDIO } from "~/content/chapter-audio";
import { image, type ImageView } from "~/content/resolve";
import type { ArchiveItem, Localized } from "~/content/schema";
import type { ParsedScript } from "~/content/audio-script";
import type { ChapterAudioView } from "~/components/ChapterAudioPlayer";
import { localePath } from "./paths";

export type Text = { text: string; lang: string };

/** Text in the requested content language, with the language it is really in. */
export function field(text: Localized, lang: ContentLang): Text {
  if (lang === "jv") return text.jv ? { text: text.jv, lang: "jv" } : { text: text.id, lang: "id" };
  return { text: text[lang], lang };
}

export type ArchiveView = {
  id: string;
  kind: ArchiveItem["kind"];
  verification: ArchiveItem["verification"];
  periodId: string;
  originalTitle: string;
  title: Text;
  description: Text;
  dateLabel: Text;
  creator: string;
  institution: string;
  recordUrl: string;
  mediaPageUrl?: string;
  license: string;
  licenseUrl?: string;
  attribution: string;
  note?: Text;
  image?: ImageView;
};

export function archiveView(item: ArchiveItem, lang: ContentLang): ArchiveView {
  // Archive texts exist in id + en; Javanese readers get Indonesian.
  const l: ContentLang = lang === "jv" ? "id" : lang;
  return {
    id: item.id,
    kind: item.kind,
    verification: item.verification,
    periodId: item.periodId,
    originalTitle: item.originalTitle,
    title: field(item.title, l),
    description: field(item.description, l),
    dateLabel: field(item.dateLabel, l),
    creator: item.creator,
    institution: item.institution,
    recordUrl: item.recordUrl,
    mediaPageUrl: item.mediaPageUrl,
    license: item.license,
    licenseUrl: item.licenseUrl,
    attribution: item.attributionText,
    note: item.note ? field(item.note, l) : undefined,
    image: item.imageId ? image(item.imageId, l) : undefined,
  };
}

export type EntryView = {
  id: string;
  periodId: string;
  year: number;
  precision: "exact" | "range" | "approximate";
  milestone: boolean;
  date: Text;
  title: Text;
  summary: Text;
  /** True when title/summary are an unreviewed AI translation. */
  draft: boolean;
  context?: Text;
  happened: Text;
  significance: Text;
  uncertainty?: Text;
  people: string[];
  factIds: string[];
  archive: ArchiveView[];
  articles: { href: string; title: Text }[];
};

export type PeriodView = {
  id: string;
  numeral: string;
  range: string;
  title: Text;
  intro: Text[];
  sideNote?: Text;
  factIds: string[];
  lead?: ArchiveView;
  entries: EntryView[];
};

export function historyView(locale: Locale, lang: ContentLang) {
  const tr = HISTORY_TRANSLATIONS[locale];
  const articleLang: ContentLang = lang === "jv" ? "id" : lang;

  const entries: EntryView[] = ENTRIES.map((e) => {
    const t = tr?.entries[e.id];
    return {
      id: e.id,
      periodId: e.periodId,
      year: e.year,
      precision: e.precision,
      milestone: e.milestone,
      date: t?.date ? { text: t.date, lang: locale } : field(e.date, lang),
      title: t ? { text: t.title, lang: locale } : field(e.title, lang),
      summary: t ? { text: t.summary, lang: locale } : field(e.summary, lang),
      draft: !!t && tr!.status !== "reviewed",
      context: e.details.context ? field(e.details.context, lang) : undefined,
      happened: field(e.details.happened, lang),
      significance: field(e.details.significance, lang),
      uncertainty: e.details.uncertainty ? field(e.details.uncertainty, lang) : undefined,
      people: e.people,
      factIds: e.factIds,
      archive: e.archiveIds.map((id) => archiveView(ARCHIVE_BY_ID.get(id)!, lang)),
      articles: e.relatedArticles.map((slug) => {
        const a = ARTICLES[slug]![articleLang] ?? ARTICLES[slug]!.en!;
        return { href: localePath(locale, `stories/${slug}`), title: { text: a.title, lang: a.lang } };
      }),
    };
  });

  const periods: PeriodView[] = PERIODS.map((p) => {
    const t = tr?.periods[p.id];
    return {
      id: p.id,
      numeral: p.numeral,
      range: p.range,
      title: t ? { text: t.title, lang: locale } : field(p.title, lang),
      intro: t?.intro ? [{ text: t.intro, lang: locale }] : p.intro.map((x) => field(x, lang)),
      sideNote: p.sideNote ? field(p.sideNote, lang) : undefined,
      factIds: p.factIds,
      lead: p.leadArchiveId ? archiveView(ARCHIVE_BY_ID.get(p.leadArchiveId)!, lang) : undefined,
      entries: entries.filter((e) => e.periodId === p.id),
    };
  });

  const rulers = RULERS.map((r) => ({ ...r, disputed: r.disputed ? field(r.disputed, lang) : undefined }));

  const confirmed = ARCHIVE.filter((a) => a.verification === "confirmed")
    .sort((a, b) => a.year - b.year)
    .map((a) => archiveView(a, lang));
  const candidates = ARCHIVE.filter((a) => a.verification === "candidate").map((a) => archiveView(a, lang));

  return { periods, entries, rulers, archive: { confirmed, candidates }, translation: tr ?? null };
}

/**
 * Audio for each chapter, keyed by chapter id. Narration text comes from the
 * parsed scripts (`scripts` maps a language to its parsed file). Durations
 * are only ever the measured `durationSeconds` of a real recording.
 */
export function chapterAudioViews(scripts: Record<string, ParsedScript>) {
  const byChapter: Record<string, ChapterAudioView[]> = {};
  for (const a of CHAPTER_AUDIO) {
    const script = scripts[a.lang];
    const transcript = a.transcript && script
      ? a.transcript.sections.flatMap((id) => {
          const c = script.chapters.find((x) => x.id === id);
          return c ? [{ title: c.title, paragraphs: c.paragraphs }] : [];
        })
      : [];
    (byChapter[a.chapterId] ??= []).push({
      lang: a.lang,
      status: a.status,
      audioUrl: a.audioUrl,
      durationSeconds: a.durationSeconds,
      credits: a.credits,
      synthetic: a.synthetic,
      transcript,
    });
  }
  return byChapter;
}
