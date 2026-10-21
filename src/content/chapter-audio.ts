/**
 * Audio for each History chapter (= period), per language.
 *
 * No narration has been recorded. Every entry is "ready-for-recording" with
 * no audioUrl, so the page shows a "not yet recorded" state and no play
 * button. To publish a recording for one chapter and language: put the file
 * in public/audio/, then set audioUrl, the measured durationSeconds,
 * credits, status ("recorded" → "reviewed" → "published") and published.
 * Another language is one more entry here; no component changes.
 *
 * The narration text already exists in content/audio/<lang>/: each chapter
 * points at the script sections it covers.
 */
import { chapterAudioSchema, parseAll, type ChapterAudioInput } from "./schema";

/** Section ids used in the narration scripts, in reading order. */
export const SCRIPT_SECTIONS = ["opening", "foundation", "pura", "court", "modern", "republic", "closing"] as const;

export const SCRIPT_PATHS: Record<string, string> = {
  id: "content/audio/id/mangkunegaran-documentary.md",
  en: "content/audio/en/mangkunegaran-documentary.md",
};
const SCRIPT_VERSION = "1.1";

/** Which script sections each History chapter's narration covers. */
const SECTIONS_BY_CHAPTER: Record<string, string[]> = {
  foundation: ["opening", "foundation", "pura"],
  court: ["court"],
  modern: ["modern"],
  republic: ["republic", "closing"],
};

const RAW: ChapterAudioInput[] = Object.entries(SECTIONS_BY_CHAPTER).flatMap(([chapterId, sections]) =>
  Object.entries(SCRIPT_PATHS).map(([lang, scriptPath]) => ({
    chapterId,
    lang,
    status: "ready-for-recording" as const,
    transcript: { scriptPath, sections, scriptVersion: SCRIPT_VERSION },
    credits: [],
    published: false,
  })),
);

export const CHAPTER_AUDIO = parseAll(chapterAudioSchema, RAW, "chapter audio");

for (const a of CHAPTER_AUDIO) {
  const where = `chapter audio ${a.chapterId}/${a.lang}`;
  // Playable only once a real file exists and has at least been recorded.
  if (a.audioUrl && !["recorded", "reviewed", "published"].includes(a.status)) throw new Error(`${where}: audioUrl set but status is "${a.status}"`);
  if (a.published && !a.audioUrl) throw new Error(`${where}: published without audioUrl`);
  if (a.durationSeconds && !a.audioUrl) throw new Error(`${where}: duration without a recording`);
}
