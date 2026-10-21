/**
 * Synthetic (AI) voice-over for the History chapter audio, made with the
 * Microsoft Edge neural voices (msedge-tts: no API key) and ffmpeg-static.
 *
 * The narration comes from content/audio/<lang>/ through parseScript, so the
 * same rules decide what is read: only text between the narration markers,
 * never headings or blockquote production notes. Each marked PAUSE/JEDA
 * becomes silence of the stated length; no music or effects are added.
 * Names are respelled for the voice only (scripts/tts-lexicon.ts).
 *
 *   npx tsx scripts/generate-voice-over.ts --sample
 *     about one minute from the start of the opening, for each candidate
 *     voice, written to sample-audio/ (git-ignored, never published)
 *   npx tsx scripts/generate-voice-over.ts
 *     one file per History chapter and language in public/audio/, using the
 *     chosen voice; prints the measured durations for chapter-audio.ts
 *
 * Synthesised paragraphs are cached in .cache/voice-over/ so a rerun only
 * requests text that changed.
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { countWords, parseScript, type ParsedScript, type ScriptPart } from "../src/content/audio-script";
import { SCRIPT_PATHS, SECTIONS_BY_CHAPTER } from "../src/content/chapter-audio";
import { respell } from "./tts-lexicon";

/** Voices offered in the sample; `chosen` is used for the full narration. */
const VOICES: Record<string, { candidates: string[]; chosen?: string }> = {
  id: { candidates: ["id-ID-ArdiNeural", "id-ID-GadisNeural"], chosen: "id-ID-ArdiNeural" },
  en: { candidates: ["en-GB-RyanNeural", "en-GB-SoniaNeural"], chosen: "en-GB-RyanNeural" },
};

/** Short breath between paragraphs that have no marked pause. */
const PARAGRAPH_GAP = 0.5;
const SAMPLE_RATE = 24000;
const BITRATE = "48k";
const CACHE = ".cache/voice-over";

if (!ffmpegPath) throw new Error("ffmpeg-static has no binary for this platform");
const FFMPEG = ffmpegPath as unknown as string;

/** Run ffmpeg with `input` on stdin; resolves with stdout. */
function ffmpeg(args: string[], input?: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn(FFMPEG, ["-hide_banner", "-loglevel", "error", ...args]);
    const out: Buffer[] = [];
    const err: Buffer[] = [];
    child.stdout.on("data", (d: Buffer) => out.push(d));
    child.stderr.on("data", (d: Buffer) => err.push(d));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(Buffer.concat(out)) : reject(new Error(`ffmpeg: ${Buffer.concat(err).toString()}`))));
    child.stdin.end(input);
  });
}

/** Decode any audio to mono 16-bit PCM at SAMPLE_RATE. */
const toPcm = (audio: Buffer) => ffmpeg(["-i", "pipe:0", "-f", "s16le", "-ac", "1", "-ar", String(SAMPLE_RATE), "pipe:1"], audio);
const silence = (seconds: number) => Buffer.alloc(Math.round(seconds * SAMPLE_RATE) * 2);
const seconds = (pcm: Buffer) => pcm.length / 2 / SAMPLE_RATE;

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rateText = (rate: number) => `${rate >= 0 ? "+" : ""}${rate}%`;

const engines = new Map<string, MsEdgeTTS>();
async function engine(voice: string) {
  let tts = engines.get(voice);
  if (!tts) {
    tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    engines.set(voice, tts);
  }
  return tts;
}

/** One paragraph as PCM, from the cache or the Edge service. */
async function speak(text: string, lang: string, voice: string, rate: number): Promise<Buffer> {
  const spoken = respell(text, lang);
  const key = createHash("sha256").update(`${voice}|${rate}|${spoken}`).digest("hex").slice(0, 32);
  const file = path.join(CACHE, `${key}.mp3`);
  if (existsSync(file)) return toPcm(await readFile(file));

  for (let attempt = 1; ; attempt++) {
    try {
      const { audioStream } = (await engine(voice)).toStream(xml(spoken), { rate: rateText(rate) });
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) chunks.push(chunk as Buffer);
      const mp3 = Buffer.concat(chunks);
      if (!mp3.length) throw new Error("empty audio");
      await mkdir(CACHE, { recursive: true });
      await writeFile(file, mp3);
      return toPcm(mp3);
    } catch (err) {
      engines.get(voice)?.close();
      engines.delete(voice);
      if (attempt === 3) throw new Error(`${voice}: "${text.slice(0, 50)}…": ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

type Rendered = { pcm: Buffer; words: number; pauseSeconds: number };

/** Paragraphs joined by a short gap; marked pauses become silence of their stated length. */
async function render(parts: ScriptPart[], lang: string, voice: string, rate: number): Promise<Rendered> {
  const pieces: Buffer[] = [];
  let words = 0;
  let pauseSeconds = 0;
  let previous: ScriptPart["kind"] | undefined;
  for (const part of parts) {
    if (part.kind === "pause") {
      pieces.push(silence(part.seconds));
      pauseSeconds += part.seconds;
    } else {
      if (previous === "text") pieces.push(silence(PARAGRAPH_GAP));
      pieces.push(await speak(part.text, lang, voice, rate));
      words += countWords(part.text);
    }
    previous = part.kind;
  }
  return { pcm: Buffer.concat(pieces), words, pauseSeconds };
}

/**
 * Words per minute as the scripts estimate it: narration time excludes only
 * the marked pauses (paragraph breaths count as narration).
 */
const wpm = (r: Rendered) => r.words / ((seconds(r.pcm) - r.pauseSeconds) / 60);

async function encode(pcm: Buffer, file: string, meta: Record<string, string>) {
  await mkdir(path.dirname(file), { recursive: true });
  const tags = Object.entries(meta).flatMap(([k, v]) => ["-metadata", `${k}=${v}`]);
  const mp3 = await ffmpeg(["-f", "s16le", "-ac", "1", "-ar", String(SAMPLE_RATE), "-i", "pipe:0", "-c:a", "libmp3lame", "-b:a", BITRATE, ...tags, "-f", "mp3", "pipe:1"], pcm);
  await writeFile(file, mp3);
  // Measured from the encoded file itself, not from the input.
  const measured = seconds(await toPcm(mp3));
  return { bytes: mp3.length, seconds: measured };
}

const parts = (script: ParsedScript, sections: string[]) => sections.flatMap((id) => script.chapters.find((c) => c.id === id)?.parts ?? []);

/** Opening parts in reading order, up to about one minute at the script's own rate. */
function sampleParts(script: ParsedScript): ScriptPart[] {
  const all = parts(script, script.chapters.map((c) => c.id));
  const out: ScriptPart[] = [];
  let words = 0;
  for (const p of all) {
    if (words >= script.wordsPerMinute) break;
    out.push(p);
    if (p.kind === "text") words += countWords(p.text);
  }
  return out;
}

/** Rate (percent) that brings `voice` close to the script's words per minute. */
async function calibrate(sample: ScriptPart[], lang: string, voice: string, target: number) {
  let rate = 0;
  let result = await render(sample, lang, voice, rate);
  for (let i = 0; i < 2 && Math.abs(wpm(result) - target) > target * 0.02; i++) {
    rate = Math.round(((100 + rate) * target) / wpm(result) - 100);
    result = await render(sample, lang, voice, rate);
  }
  return { rate, result };
}

const credit = (voice: string) => ({
  artist: `Synthetic AI voice: Microsoft Edge ${voice}`,
  comment: "AI-generated narration (synthetic voice, not a human narrator). Script: Kelompok 7.",
});

async function run() {
  const sampleMode = process.argv.includes("--sample");
  const scripts = Object.fromEntries(
    await Promise.all(Object.entries(SCRIPT_PATHS).map(async ([lang, p]) => [lang, parseScript(await readFile(p, "utf8"))] as const)),
  );

  for (const [lang, script] of Object.entries(scripts)) {
    const target = script.wordsPerMinute;
    const sample = sampleParts(script);
    const voices = sampleMode ? VOICES[lang]!.candidates : [VOICES[lang]!.chosen ?? ""];
    for (const voice of voices) {
      if (!voice) throw new Error(`No chosen voice for ${lang}: set VOICES.${lang}.chosen after listening to the samples`);
      if (sampleMode) {
        const { rate, result } = await calibrate(sample, lang, voice, target);
        const file = `sample-audio/${voice}.mp3`;
        const out = await encode(result.pcm, file, { title: `${script.meta.title} (sample)`, ...credit(voice) });
        console.log(`${file}: ${out.seconds.toFixed(1)} s, ${(out.bytes / 1024).toFixed(0)} KB, rate ${rateText(rate)}, ${wpm(result).toFixed(0)} wpm (script: ${target})`);
        continue;
      }
      // Each chapter is calibrated on its own text: dense passages (long
      // spelled-out years) are read faster than the opening at the same rate.
      for (const [chapterId, sections] of Object.entries(SECTIONS_BY_CHAPTER)) {
        const { rate, result: chapter } = await calibrate(parts(script, sections), lang, voice, target);
        const file = `public/audio/${chapterId}-${lang}.mp3`;
        const out = await encode(chapter.pcm, file, { title: `${script.meta.title} — ${sections.join(", ")}`, ...credit(voice) });
        console.log(`${file}: ${out.seconds.toFixed(1)} s (durationSeconds ${Math.round(out.seconds)}), ${(out.bytes / 1024 / 1024).toFixed(2)} MB, ${voice} ${rateText(rate)}, ${wpm(chapter).toFixed(0)} wpm`);
      }
    }
  }
  for (const tts of engines.values()) tts.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
