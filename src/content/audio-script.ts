/**
 * Parser for the documentary narration scripts in content/audio/<lang>/.
 *
 * Format (see content/audio/en/mangkunegaran-documentary.md):
 *  - YAML-style front matter of simple `key: value` lines between `---`
 *  - narration between <!-- narration:start --> and <!-- narration:end -->
 *  - chapters as `## Title {#chapter-id}`
 *  - production notes as blockquote lines (`> SOUND:`, `> PAUSE: 2 seconds`,
 *    `> SUARA:`, `> JEDA: 2 detik`); they are never part of the transcript
 *
 * The parser is a pure function so that loaders (via `?raw` imports) and
 * Node scripts (via fs) share it.
 */

/** Narration in reading order: paragraphs and the marked pauses between them. */
export type ScriptPart = { kind: "text"; text: string } | { kind: "pause"; seconds: number };

export type ScriptChapter = {
  id: string;
  title: string;
  paragraphs: string[];
  /** The same paragraphs, with each marked pause where it occurs. */
  parts: ScriptPart[];
  words: number;
};

export type ParsedScript = {
  meta: Record<string, string>;
  chapters: ScriptChapter[];
  wordCount: number;
  /** Sum of the marked pauses, in seconds. */
  pauseSeconds: number;
  /** Narration rate stated in the front matter (words per minute). */
  wordsPerMinute: number;
  /** Estimate from word count and pauses — not a measured duration. */
  estimatedSeconds: number;
};

const START = "<!-- narration:start -->";
const END = "<!-- narration:end -->";

function frontMatter(source: string): Record<string, string> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  const meta: Record<string, string> = {};
  if (!match) return meta;
  for (const line of match[1]!.split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i < 1) continue;
    meta[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }
  return meta;
}

/** Strip inline Markdown emphasis; the transcript is plain text. */
function plain(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`(.+?)`/g, "$1").trim();
}

export const countWords = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

export function parseScript(source: string): ParsedScript {
  const meta = frontMatter(source);
  const start = source.indexOf(START);
  const end = source.indexOf(END);
  if (start < 0 || end < start) throw new Error("Script is missing its narration markers");
  const body = source.slice(start + START.length, end);

  const chapters: ScriptChapter[] = [];
  let current: ScriptChapter | null = null;
  let paragraph: string[] = [];
  let pauseSeconds = 0;

  const flush = () => {
    if (current && paragraph.length) {
      const text = plain(paragraph.join(" "));
      current.paragraphs.push(text);
      current.parts.push({ kind: "text", text });
    }
    paragraph = [];
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    const heading = /^##\s+(.+?)\s*\{#([a-z0-9-]+)\}\s*$/.exec(line);
    if (heading) {
      flush();
      current = { id: heading[2]!, title: heading[1]!, paragraphs: [], parts: [], words: 0 };
      chapters.push(current);
      continue;
    }
    if (line.startsWith(">")) {
      flush();
      const pause = /^>\s*(?:PAUSE|JEDA):\s*(\d+(?:\.\d+)?)/i.exec(line);
      if (pause) {
        pauseSeconds += Number(pause[1]);
        current?.parts.push({ kind: "pause", seconds: Number(pause[1]) });
      }
      continue;
    }
    if (!line) {
      flush();
      continue;
    }
    if (!current) throw new Error(`Narration text before the first chapter heading: "${line.slice(0, 40)}"`);
    paragraph.push(line);
  }
  flush();

  for (const c of chapters) c.words = c.paragraphs.reduce((n, p) => n + countWords(p), 0);
  const wordCount = chapters.reduce((n, c) => n + c.words, 0);
  const wordsPerMinute = Number(/(\d+)/.exec(meta.narration_rate ?? "")?.[1] ?? 130);
  const estimatedSeconds = Math.round((wordCount / wordsPerMinute) * 60 + pauseSeconds);

  return { meta, chapters, wordCount, pauseSeconds, wordsPerMinute, estimatedSeconds };
}
