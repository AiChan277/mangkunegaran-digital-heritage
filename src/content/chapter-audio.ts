/**
 * Audio for each History chapter (= period), per language.
 *
 * Every chapter has a synthetic (AI) narration in Indonesian and English,
 * made by scripts/generate-voice-over.ts with Microsoft Edge neural voices.
 * No human narrator has recorded it. Status stays "recorded" until someone
 * has listened through and approved it ("reviewed"). A chapter without an
 * entry in RECORDINGS shows a "not yet recorded" state and no play button.
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
export const SECTIONS_BY_CHAPTER: Record<string, string[]> = {
  foundation: ["opening", "foundation", "pura"],
  court: ["court"],
  modern: ["modern"],
  republic: ["republic", "closing"],
};

/** Synthetic voice per language (see scripts/generate-voice-over.ts). */
const VOICE: Record<string, string> = {
  id: "Microsoft Edge · id-ID-ArdiNeural",
  en: "Microsoft Edge · en-GB-RyanNeural",
};

/** Measured durations (seconds) of the files in public/audio/, as printed by the generator. */
const RECORDINGS: Record<string, number> = {
  "foundation-id": 308,
  "court-id": 114,
  "modern-id": 57,
  "republic-id": 190,
  "foundation-en": 306,
  "court-en": 106,
  "modern-en": 51,
  "republic-en": 178,
};

const RAW: ChapterAudioInput[] = Object.entries(SECTIONS_BY_CHAPTER).flatMap(([chapterId, sections]) =>
  Object.entries(SCRIPT_PATHS).map(([lang, scriptPath]) => {
    const transcript = { scriptPath, sections, scriptVersion: SCRIPT_VERSION };
    const durationSeconds = RECORDINGS[`${chapterId}-${lang}`];
    if (!durationSeconds) return { chapterId, lang, status: "ready-for-recording" as const, transcript, credits: [], published: false };
    return {
      chapterId,
      lang,
      status: "recorded" as const,
      audioUrl: `/audio/${chapterId}-${lang}.mp3`,
      durationSeconds,
      transcript,
      credits: [
        { role: "voice", name: VOICE[lang]! },
        { role: "script", name: "Kelompok 7" },
      ],
      synthetic: true,
      published: true,
    };
  }),
);

export const CHAPTER_AUDIO = parseAll(chapterAudioSchema, RAW, "chapter audio");

for (const a of CHAPTER_AUDIO) {
  const where = `chapter audio ${a.chapterId}/${a.lang}`;
  // Playable only once a real file exists and has at least been recorded.
  if (a.audioUrl && !["recorded", "reviewed", "published"].includes(a.status)) throw new Error(`${where}: audioUrl set but status is "${a.status}"`);
  if (a.published && !a.audioUrl) throw new Error(`${where}: published without audioUrl`);
  if (a.durationSeconds && !a.audioUrl) throw new Error(`${where}: duration without a recording`);
}
