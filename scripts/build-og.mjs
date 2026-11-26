// Social share images (1200×630) for BG and EN: venue photo + brand panel.
import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const photo = join(root, "..", "..", "brand-assets", "venue", "hall-bar-wide.jpg");
const T = {
  bg: { kick: "скрита", title: ["Бар-галерия", "в сърцето на София"], line: "Кафе денем · коктейли нощем · изкуство", rating: "4,8 · 545 отзива в Google", addr: "ул. „Петър Парчевич“ 36" },
  en: { kick: "a hidden", title: ["Bar-gallery", "in the heart of Sofia"], line: "Coffee by day · cocktails by night · art", rating: "4.8 · 545 Google reviews", addr: "36 Petar Parchevich St" },
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
for (const [lang, t] of Object.entries(T)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#121a3d" stop-opacity=".97"/><stop offset=".5" stop-color="#121a3d" stop-opacity=".86"/><stop offset=".78" stop-color="#121a3d" stop-opacity=".1"/><stop offset="1" stop-color="#121a3d" stop-opacity="0"/></linearGradient>
  <linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#e5482b"/><stop offset=".5" stop-color="#f08a24"/><stop offset="1" stop-color="#ecb330"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="598" width="1200" height="32" fill="url(#b)"/>
  <g transform="translate(72 70)">
    <rect x="0" y="0" width="112" height="50" fill="#fff" stroke="#1e1b2e" stroke-width="3"/>
    <text x="56" y="36" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="32" fill="#1e1b2e">kare</text>
    <text x="56" y="100" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="48" letter-spacing="4" fill="#ffd36e" transform="rotate(-3 56 90)">ARTE</text>
  </g>
  <text x="72" y="262" font-family="'Snell Roundhand', 'Brush Script MT', cursive" font-size="52" fill="#ffd36e">${esc(t.kick)}</text>
  <text x="72" y="350" font-family="Georgia, serif" font-weight="700" font-size="92" fill="#fff8ea">${esc(t.title[0])}</text>
  <text x="72" y="408" font-family="Georgia, serif" font-style="italic" font-size="46" fill="#f4eee2">${esc(t.title[1])}</text>
  <text x="72" y="470" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#d9d3c7">${esc(t.line)}</text>
  <g transform="translate(72 506)">
    <rect width="${lang === "bg" ? 430 : 400}" height="54" rx="27" fill="#fff"/>
    <text x="24" y="36" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#e9a91c">★★★★★</text>
    <text x="150" y="36" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="23" fill="#1e1b2e">${esc(t.rating)}</text>
  </g>
  <text x="${lang === "bg" ? 530 : 500}" y="541" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="#f4eee2">${esc(t.addr)}</text>
</svg>`;
  const out = join(root, "public", lang === "bg" ? "og.jpg" : "og-en.jpg");
  await sharp(photo).rotate().resize(1200, 630, { fit: "cover", position: "right" }).modulate({ saturation: 1.15 })
    .composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log("wrote", out);
}
