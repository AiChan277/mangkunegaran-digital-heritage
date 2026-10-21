# Chapter audio

Generated from `src/content/chapter-audio.ts` and the scripts in `content/audio/` by `scripts/generate-docs.ts`.

Audio belongs to each History chapter (period), not to a separate documentary section. 8 of 8 chapter narrations have a file; **8 use a synthetic (AI) voice**, made by `scripts/generate-voice-over.ts` with Microsoft Edge neural voices, and the player labels them “AI voice” in every language. No human narrator has recorded them. Files are mono MP3 and are not downloaded until the visitor presses play. A chapter without a file shows “Not yet recorded” and no play button.

| chapter | language | status | script sections | audio file | voice | duration | published |
|---|---|---|---|---|---|---|---|
| `foundation` | id | recorded | opening, foundation, pura | /audio/foundation-id.mp3 | Microsoft Edge · id-ID-ArdiNeural (synthetic, AI) | 308 s (measured) | yes |
| `foundation` | en | recorded | opening, foundation, pura | /audio/foundation-en.mp3 | Microsoft Edge · en-GB-RyanNeural (synthetic, AI) | 306 s (measured) | yes |
| `court` | id | recorded | court | /audio/court-id.mp3 | Microsoft Edge · id-ID-ArdiNeural (synthetic, AI) | 114 s (measured) | yes |
| `court` | en | recorded | court | /audio/court-en.mp3 | Microsoft Edge · en-GB-RyanNeural (synthetic, AI) | 106 s (measured) | yes |
| `modern` | id | recorded | modern | /audio/modern-id.mp3 | Microsoft Edge · id-ID-ArdiNeural (synthetic, AI) | 57 s (measured) | yes |
| `modern` | en | recorded | modern | /audio/modern-en.mp3 | Microsoft Edge · en-GB-RyanNeural (synthetic, AI) | 51 s (measured) | yes |
| `republic` | id | recorded | republic, closing | /audio/republic-id.mp3 | Microsoft Edge · id-ID-ArdiNeural (synthetic, AI) | 190 s (measured) | yes |
| `republic` | en | recorded | republic, closing | /audio/republic-en.mp3 | Microsoft Edge · en-GB-RyanNeural (synthetic, AI) | 178 s (measured) | yes |

## Narration scripts

- `content/audio/id/mangkunegaran-documentary.md` (id) — version 1.1, 1366 words of narration in 7 sections. Word counts are for planning only; no duration is shown on the site until a recording is measured.
- `content/audio/en/mangkunegaran-documentary.md` (en) — version 1.1, 1465 words of narration in 7 sections. Word counts are for planning only; no duration is shown on the site until a recording is measured.

## Regenerating the synthetic narration

1. `npm run voice-over:sample` writes about one minute per candidate voice to `sample-audio/` (git-ignored) for choosing a voice.
2. `npm run voice-over` reads the scripts through `parseScript` (only narration between the markers; headings and blockquote notes are never read), turns each `PAUSE`/`JEDA` into silence of the stated length, adds a 0.5 s breath between other paragraphs, calibrates the speaking rate per chapter to the script's words per minute, and writes `public/audio/<chapter>-<lang>.mp3` (mono, 48 kbps). It prints each file's measured duration.
3. Copy those durations into `RECORDINGS` in `src/content/chapter-audio.ts`, then run this generator.
4. Names the voice would misread are respelled for the voice only in `scripts/tts-lexicon.ts`; the scripts and the site keep the original spelling.

## Recording and publishing one chapter (human narrator)

1. Record the sections listed for that chapter from the script. Read only the narration between the markers; blockquote lines (`> SOUND:`, `> PAUSE:`, `> SUARA:`, `> JEDA:`) are production notes.
2. Export a compressed file (for example AAC in M4A or Opus in WebM, mono, ~64 kbps) to `public/audio/`, e.g. `public/audio/foundation-id.m4a`.
3. In `src/content/chapter-audio.ts` set, for that chapter and language: `audioUrl`, the measured `durationSeconds`, `credits` (narrator, recording), `status` (`recorded` → `reviewed` → `published`) and `published: true`.
4. `npm run check:sources` verifies the file exists and that a duration is never set without a recording. The chapter then shows real controls: play/pause, seek, current time and duration, mute, loading and error states.
5. Another language is one more entry per chapter; no component changes are needed.

Chapters: `foundation` (1725–1795), `court` (1796–1915), `modern` (1916–1944), `republic` (1945–today).
