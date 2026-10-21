/**
 * Minimal static server for the production build, mimicking Cloudflare
 * Workers static assets with html_handling "drop-trailing-slash" and
 * not_found_handling "404-page" (nearest 404.html up the tree).
 * Usage: npx tsx scripts/serve-static.ts [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { brotliCompressSync, gzipSync } from "node:zlib";
import path from "node:path";

const ROOT = path.resolve("build/client");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4173);

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".data": "text/x-script",
  ".mp3": "audio/mpeg",
};

const COMPRESSIBLE = [".html", ".js", ".css", ".json", ".svg", ".data", ".txt", ".xml", ".webmanifest"];

/**
 * Compressed bodies, by file and encoding. Brotli at its default (maximum)
 * quality is slow and synchronous; compressing each file once keeps the
 * server responsive when several browsers load pages in parallel (tests).
 */
const compressed = new Map<string, Buffer>();
function compress(file: string, body: Buffer, encoding: "br" | "gzip"): Buffer {
  const key = `${encoding}:${file}`;
  let out = compressed.get(key);
  if (!out) {
    out = encoding === "br" ? brotliCompressSync(body) : gzipSync(body);
    compressed.set(key, out);
  }
  return out;
}

async function isFile(p: string) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function resolve(urlPath: string): Promise<{ file: string; status: number } | { redirect: string }> {
  const clean = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  if (clean.length > 1 && clean.endsWith("/")) return { redirect: clean.replace(/\/+$/, "") };
  const target = path.join(ROOT, clean);
  if (!target.startsWith(ROOT)) return { file: path.join(ROOT, "404.html"), status: 404 };
  if (await isFile(target)) return { file: target, status: 200 };
  if (await isFile(`${target}.html`)) return { file: `${target}.html`, status: 200 };
  if (await isFile(path.join(target, "index.html"))) return { file: path.join(target, "index.html"), status: 200 };
  // nearest 404.html walking up the tree
  let dir = path.dirname(target);
  while (dir.startsWith(ROOT)) {
    const candidate = path.join(dir, "404.html");
    if (await isFile(candidate)) return { file: candidate, status: 404 };
    if (dir === ROOT) break;
    dir = path.dirname(dir);
  }
  return { file: path.join(ROOT, "404.html"), status: 404 };
}

createServer(async (req, res) => {
  const r = await resolve(req.url ?? "/");
  if ("redirect" in r) {
    res.writeHead(307, { Location: r.redirect });
    res.end();
    return;
  }
  try {
    let body: Buffer = await readFile(r.file);
    const ext = path.extname(r.file);
    const headers: Record<string, string> = { "Content-Type": TYPES[ext] ?? "application/octet-stream", Vary: "Accept-Encoding" };
    // Compress text like Cloudflare does, so local Lighthouse runs are realistic.
    const accept = String(req.headers["accept-encoding"] ?? "");
    if (COMPRESSIBLE.includes(ext)) {
      if (accept.includes("br")) {
        body = compress(r.file, body, "br");
        headers["Content-Encoding"] = "br";
      } else if (accept.includes("gzip")) {
        body = compress(r.file, body, "gzip");
        headers["Content-Encoding"] = "gzip";
      }
    } else {
      // Byte ranges, as Cloudflare serves them: browsers need them to seek in audio.
      headers["Accept-Ranges"] = "bytes";
      const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ""));
      if (range && r.status === 200 && (range[1] || range[2])) {
        const size = body.length;
        const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
        if (start >= size || start > end) {
          res.writeHead(416, { "Content-Range": `bytes */${size}` });
          res.end();
          return;
        }
        headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
        res.writeHead(206, headers);
        res.end(body.subarray(start, end + 1));
        return;
      }
    }
    if (req.url?.startsWith("/assets/")) headers["Cache-Control"] = "public, max-age=31536000, immutable";
    res.writeHead(r.status, headers);
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
