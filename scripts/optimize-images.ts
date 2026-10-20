/**
 * Image pipeline: images-raw/*.jpg → public/images/<id>-<width>.{avif,webp}
 * Writes src/content/images.generated.json with sizes and a dominant colour
 * used as the loading placeholder.
 *
 * Crops are declared here so they are reproducible and documented.
 */
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAW = "images-raw";
const OUT = "public/images";
const GENERATED = "src/content/images.generated.json";
const WIDTHS = [480, 800, 1200, 1600, 2400];

type Crop = { left: number; top: number; width: number; height: number }; // fractions 0..1
type Job = { id: string; src: string; crop?: Crop; quality?: number };

/** Derived variants (crops) on top of 1:1 conversions of every raw file. */
const DERIVED: Job[] = [
  // Removes the crest above the Pringgitan entrance (no official emblem on the site).
  { id: "pringgitan", src: "pringgitan.jpg", crop: { left: 0, top: 0.24, width: 1, height: 0.76 } },
  // Portrait crop of the wide Pendhapa Ageng view for the mobile hero
  // (taken from a distance, so no ornament dominates the frame).
  { id: "pendhapa-grand-portrait", src: "pendhapa-grand.jpg", crop: { left: 0.36, top: 0, width: 0.31, height: 1 } },
];

/** Raw files that are only used through a derived crop. */
const SKIP_DIRECT = new Set(["pringgitan.jpg"]);

async function run() {
  await mkdir(OUT, { recursive: true });
  const files = (await readdir(RAW)).filter((f) => f.endsWith(".jpg"));
  const jobs: Job[] = [
    ...files.filter((f) => !SKIP_DIRECT.has(f)).map((f) => ({ id: path.basename(f, ".jpg"), src: f })),
    ...DERIVED,
  ];

  const manifest: Record<string, { width: number; height: number; color: string; widths: number[] }> = {};

  for (const job of jobs) {
    const input = sharp(path.join(RAW, job.src), { failOn: "none" }).rotate();
    const meta = await input.metadata();
    let width = meta.width ?? 0;
    let height = meta.height ?? 0;
    let pipeline = input;
    if (job.crop) {
      const region = {
        left: Math.round(job.crop.left * width),
        top: Math.round(job.crop.top * height),
        width: Math.round(job.crop.width * width),
        height: Math.round(job.crop.height * height),
      };
      pipeline = input.extract(region);
      width = region.width;
      height = region.height;
    }
    const base = await pipeline.toBuffer();
    const stats = await sharp(base).stats();
    const { r, g, b } = stats.dominant;
    const color = `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;

    const widths = WIDTHS.filter((w) => w < width);
    widths.push(Math.min(width, 2400));
    const unique = [...new Set(widths)].sort((a, b2) => a - b2);

    for (const w of unique) {
      const avif = path.join(OUT, `${job.id}-${w}.avif`);
      const webp = path.join(OUT, `${job.id}-${w}.webp`);
      if (!existsSync(avif)) await sharp(base).resize({ width: w }).avif({ quality: job.quality ?? 52, effort: 6 }).toFile(avif);
      if (!existsSync(webp)) await sharp(base).resize({ width: w }).webp({ quality: job.quality ?? 72 }).toFile(webp);
    }
    manifest[job.id] = { width, height, color, widths: unique };
    console.log(`✓ ${job.id} ${width}×${height} → ${unique.join(", ")}`);
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(GENERATED, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Wrote ${GENERATED}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
