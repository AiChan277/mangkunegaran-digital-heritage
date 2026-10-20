/**
 * Generates app icons and Open Graph cards (1200×630) with sharp.
 * Cards are original typographic designs: wordmark + section title on ivory,
 * beside a licensed photograph (credited on the card). No official emblem.
 * Text uses system serif fonts available to librsvg.
 * Usage: npx tsx scripts/generate-og.ts
 */
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ASSET_BY_ID } from "../src/content/assets";
import { ARTICLES } from "../src/content/articles";

const OUT = "public/og";
const SERIF = "Georgia, 'Times New Roman', 'DejaVu Serif', serif";
const SANS = "Arial, 'Helvetica Neue', 'DejaVu Sans', sans-serif";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Naive word wrap by character count, good enough for short titles. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > max) {
      lines.push(line.trim());
      line = word;
    } else line += " " + word;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

async function card(file: string, title: string, kicker: string, imageId: string) {
  const asset = ASSET_BY_ID.get(imageId);
  if (!asset) throw new Error(`Unknown image ${imageId}`);
  const photo = await sharp(path.join("images-raw", `${asset.derivedFrom ?? imageId}.jpg`))
    .rotate()
    .resize(520, 630, { fit: "cover", position: "attention" })
    .toBuffer();
  const lines = wrap(title, 18);
  const titleSvg = lines
    .map((l, i) => `<text x="64" y="${300 + i * 72}" font-family="${SERIF}" font-size="64" fill="#1c1a17">${esc(l)}</text>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#f5efe2"/>
    <text x="64" y="96" font-family="${SERIF}" font-size="34" fill="#1c1a17">Mangkunegaran</text>
    <text x="64" y="128" font-family="${SANS}" font-size="16" letter-spacing="2" fill="#574d42">A LIVING HERITAGE · CONCEPT</text>
    <path d="M64 196h80" stroke="#a8833a" stroke-width="2"/>
    <text x="64" y="232" font-family="${SANS}" font-size="20" letter-spacing="2" fill="#9a4529">${esc(kicker.toUpperCase())}</text>
    ${titleSvg}
    <text x="64" y="566" font-family="${SANS}" font-size="16" fill="#574d42">Independent concept by Kelompok 7 · not affiliated with Pura Mangkunegaran</text>
    <rect x="680" y="0" width="520" height="630" fill="#ebe2cf"/>
    <rect x="680" y="590" width="520" height="40" fill="rgba(28,26,23,0.72)"/>
    <text x="696" y="615" font-family="${SANS}" font-size="13" fill="#f5efe2">Photo: ${esc(asset.author.split(",")[0]!)} · ${esc(asset.license)}</text>
  </svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  // Photo first, then the caption strip from the SVG on top of it.
  const strip = await sharp(Buffer.from(svg)).extract({ left: 680, top: 590, width: 520, height: 40 }).png().toBuffer();
  await sharp(base)
    .composite([
      { input: photo, left: 680, top: 0 },
      { input: strip, left: 680, top: 590 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, `${file}.jpg`));
  console.log(`✓ og/${file}.jpg`);
}

async function icons() {
  const svg = await readFile("public/favicon.svg");
  await sharp(svg, { density: 600 }).resize(32, 32).png().toFile("public/favicon-32.png");
  await sharp(svg, { density: 600 }).resize(180, 180).png().toFile("public/apple-touch-icon.png");
  await sharp(svg, { density: 600 }).resize(192, 192).png().toFile("public/icon-192.png");
  await sharp(svg, { density: 600 }).resize(512, 512).png().toFile("public/icon-512.png");
  console.log("✓ icons");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await icons();
  await card("default", "Mangkunegaran — a living heritage", "Surakarta, Central Java", "pendhapa-grand-portrait");
  await card("home", "A living heritage, in twelve languages", "Surakarta, Central Java", "pendhapa-grand-portrait");
  await card("history", "History", "From 1757 to today", "pendhapa-archival");
  await card("architecture", "Architecture", "From the field to the house", "pendhapa-floor");
  await card("culture", "Culture", "Batik, dance, verse, gamelan", "dancers-female");
  await card("stories", "Stories", "From the archive", "wayang-archival");
  await card("gallery", "Gallery", "Openly licensed photographs", "kumudawati");
  await card("visit", "Visit", "Guidance in pictures and words", "gate");
  await card("about", "About this project", "A case study", "stained-glass");
  for (const [slug, rec] of Object.entries(ARTICLES)) {
    const a = rec.en!;
    await card(`story-${slug}`, a.title, "Story", a.heroImageId);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
