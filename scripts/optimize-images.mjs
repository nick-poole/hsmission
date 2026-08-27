#!/usr/bin/env node
/**
 * Image optimization pipeline (brief §9).
 *
 * Run where npm install works (not available in every remote environment):
 *   npm i -D sharp
 *   node scripts/optimize-images.mjs            # report + generate .webp siblings
 *   node scripts/optimize-images.mjs --resize   # also downscale oversized JPEGs in place
 *
 * - Generates a .webp sibling (quality 80) for every raster image referenced
 *   by the HTML/CSS, at the image's own dimensions. NEVER upscales.
 * - With --resize, JPEG/PNG sources wider than MAX_WIDTH are downscaled in
 *   place (originals backed up to dist/assets/images-original/). After a
 *   resize run, re-run scripts/update-image-dimensions.py so the width/height
 *   attributes in the HTML match the new intrinsic sizes.
 * - After .webp files exist you can switch markup to <picture> with a JPEG
 *   fallback; until then the .webp files simply sit unused (harmless).
 *
 * If the site is migrated to Cloudflare Pages, enabling Polish (Lossy WebP)
 * makes the .webp generation unnecessary — but the --resize pass is still
 * worth doing once: several sources are 5000-16000px wide.
 */
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const IMG_DIR = "dist/assets/images";
const BACKUP_DIR = "dist/assets/images-original";
const MAX_WIDTH = 2400; // hero sources; nothing on the site renders wider
const WEBP_QUALITY = 80;
const RESIZE = process.argv.includes("--resize");

const files = readdirSync(IMG_DIR).filter((f) =>
  [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase())
);

let saved = 0;
for (const file of files) {
  const path = join(IMG_DIR, file);
  const before = statSync(path).size;
  const meta = await sharp(path).metadata();

  if (RESIZE && meta.width > MAX_WIDTH) {
    mkdirSync(BACKUP_DIR, { recursive: true });
    const backup = join(BACKUP_DIR, file);
    if (!existsSync(backup)) copyFileSync(path, backup);
    const buf = await sharp(path)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .toBuffer();
    await sharp(buf).toFile(path);
    console.log(`resized ${file}: ${meta.width}px -> ${MAX_WIDTH}px, ${(before / 1024) | 0}KB -> ${(statSync(path).size / 1024) | 0}KB`);
  }

  const webpPath = join(IMG_DIR, basename(file, extname(file)) + ".webp");
  await sharp(path).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
  const webpSize = statSync(webpPath).size;
  saved += Math.max(0, statSync(path).size - webpSize);
  console.log(`webp ${file}: ${(statSync(path).size / 1024) | 0}KB -> ${(webpSize / 1024) | 0}KB`);
}
console.log(`\nDone. Potential savings if all clients get WebP: ${(saved / 1024 / 1024).toFixed(1)}MB`);
