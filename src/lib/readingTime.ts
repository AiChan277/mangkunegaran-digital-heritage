/** Rough reading time in minutes (≈200 words per minute, minimum 1). */
export function readingMinutes(texts: string[]): number {
  const words = texts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
