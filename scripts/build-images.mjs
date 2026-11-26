// Builds responsive WebP variants into public/img from brand-assets (see content/media.json).
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const assets = join(root, "..", "..", "brand-assets");
const out = join(root, "public", "img");
mkdirSync(out, { recursive: true });
const media = JSON.parse(readFileSync(join(root, "content", "media.json"), "utf8"));
const widths = [480, 960, 1600];
for (const m of media) {
  const { data, info } = await sharp(join(assets, m.src)).rotate().toBuffer({ resolveWithObject: true });
  const img = sharp(data);
  const meta = { width: info.width, height: info.height };
  m.w = info.width;
  m.h = info.height;
  for (const w of widths) {
    if (w > meta.width && w !== widths[0]) continue;
    await img.clone().resize({ width: Math.min(w, meta.width) }).webp({ quality: 74 }).toFile(join(out, `${m.id}-${w}.webp`));
  }
  // tiny blurred placeholder colour
  const { dominant } = await img.stats();
  m.color = `rgb(${dominant.r},${dominant.g},${dominant.b})`;
  m.max = widths.filter((w) => w <= meta.width || w === widths[0]).pop();
  process.stdout.write(".");
}
// OG image
await sharp(join(assets, "raw/wanderlog_bar_blue-wall_neon-logo.jpg")).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80 }).toFile(join(root, "public", "og.jpg"));
const { writeFileSync } = await import("node:fs");
writeFileSync(join(root, "content", "media.generated.json"), JSON.stringify(Object.fromEntries(media.map((m) => [m.id, { w: m.w, h: m.h, color: m.color, max: m.max }])), null, 1));
console.log("\nimages:", media.length);
