# Chapter audio

Generated from `src/content/chapter-audio.ts` and the scripts in `content/audio/` by `scripts/generate-docs.ts`.

Audio belongs to each History chapter (period), not to a separate documentary section. **No narration has been recorded.** Every chapter and language is *ready-for-recording*: the page shows “Not yet recorded”, no play button, no duration and no waveform, and the chapter text is complete without audio.

| chapter | language | status | script sections | audio file | duration | published |
|---|---|---|---|---|---|---|
| `foundation` | id | ready-for-recording | opening, foundation, pura | — | — | no |
| `foundation` | en | ready-for-recording | opening, foundation, pura | — | — | no |
| `court` | id | ready-for-recording | court | — | — | no |
| `court` | en | ready-for-recording | court | — | — | no |
| `modern` | id | ready-for-recording | modern | — | — | no |
| `modern` | en | ready-for-recording | modern | — | — | no |
| `republic` | id | ready-for-recording | republic, closing | — | — | no |
| `republic` | en | ready-for-recording | republic, closing | — | — | no |

## Narration scripts

- `content/audio/id/mangkunegaran-documentary.md` (id) — version 1.1, 1366 words of narration in 7 sections. Word counts are for planning only; no duration is shown on the site until a recording is measured.
- `content/audio/en/mangkunegaran-documentary.md` (en) — version 1.1, 1465 words of narration in 7 sections. Word counts are for planning only; no duration is shown on the site until a recording is measured.

## Recording and publishing one chapter

1. Record the sections listed for that chapter from the script. Read only the narration between the markers; blockquote lines (`> SOUND:`, `> PAUSE:`, `> SUARA:`, `> JEDA:`) are production notes.
2. Export a compressed file (for example AAC in M4A or Opus in WebM, mono, ~64 kbps) to `public/audio/`, e.g. `public/audio/foundation-id.m4a`.
3. In `src/content/chapter-audio.ts` set, for that chapter and language: `audioUrl`, the measured `durationSeconds`, `credits` (narrator, recording), `status` (`recorded` → `reviewed` → `published`) and `published: true`.
4. `npm run check:sources` verifies the file exists and that a duration is never set without a recording. The chapter then shows real controls: play/pause, seek, current time and duration, mute, loading and error states.
5. Another language is one more entry per chapter; no component changes are needed.

Chapters: `foundation` (1725–1795), `court` (1796–1915), `modern` (1916–1944), `republic` (1945–today).
