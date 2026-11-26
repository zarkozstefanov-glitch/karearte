// Social share images (1200×630) for BG and EN, rendered with headless Chrome.
// Photos are inlined as data URIs so nothing can be blank because it was still loading.
// Usage: npm run og   (needs Google Chrome + playwright-core; set PLAYWRIGHT_CORE to override its path)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const pwPath = process.env.PLAYWRIGHT_CORE ?? join(root, "..", "..", "presentation", "build", "node_modules", "playwright-core");
const { chromium } = require(pwPath);
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const img = (name) => `data:image/webp;base64,${readFileSync(join(root, "public", "img", name)).toString("base64")}`;
const PHOTOS = {
  night: img("night-mural-guests-480.webp"),
  cocktail: img("blue-cocktail-480.webp"),
  orange: img("orange-room-sofas-960.webp"),
};

const T = {
  bg: {
    brand: "КаРе-АртЕ", addr: "ул. „Петър Парчевич“ 36 · София",
    kick: "скрит", title: "Арт кафе-бар", sub: "в сърцето на София",
    line: ["Кафе денем", "коктейли нощем", "изкуство по стените"],
    rating: "4,8", reviews: "545 отзива в Google", hours: "Всеки ден от 11:00",
    caps: ["спомени на свещ", "коктейл на сляпо", "оранжевата стая"],
    band: ["кафе", "коктейли", "изкуство", "куиз", "рисуване с вино", "градина", "книги", "свещи", "кафе", "коктейли"],
  },
  en: {
    brand: "KaRe-Arte", addr: "36 Petar Parchevich St · Sofia",
    kick: "a hidden", title: "Art café-bar", sub: "in the heart of Sofia",
    line: ["Coffee by day", "cocktails by night", "art on every wall"],
    rating: "4.8", reviews: "545 Google reviews", hours: "Open daily from 11:00",
    caps: ["by candlelight", "the blind cocktail", "the orange room"],
    band: ["coffee", "cocktails", "art", "quiz", "paint & wine", "garden", "books", "candles", "coffee", "cocktails"],
  },
};

const PIN = `<svg width="16" height="20" viewBox="0 0 18 22"><path d="M9 1a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" fill="#f08a24"/><circle cx="9" cy="9" r="3" fill="#0e1430"/></svg>`;
const CLOCK = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd36e" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/></svg>`;

const html = (t) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,500;1,600&family=Caveat:wght@700&family=Manrope:wght@600;700;800&family=Permanent+Marker&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#0e1430;font-family:Manrope,sans-serif;position:relative;color:#fff8ea}
.bg{position:absolute;inset:0;background:
  radial-gradient(45% 60% at 80% 42%,rgba(240,138,36,.24),transparent 70%),
  radial-gradient(70% 95% at 8% 10%,#2a4596 0,#17214d 52%,#0d1330 100%)}
.grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:soft-light;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.stars i{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffe7a3;box-shadow:0 0 10px 3px rgba(255,211,110,.55)}

.copy{position:absolute;left:64px;top:36px;width:600px}
.top{display:flex;align-items:center;gap:18px}
.orb{flex:none;width:92px;height:92px;border-radius:50%;display:grid;place-items:center;
  background:radial-gradient(circle at 38% 35%,#fff,#e3ebff 55%,#9fb3e6);
  box-shadow:0 0 0 9px rgba(201,216,255,.08),0 0 40px rgba(150,180,255,.6)}
.mark{display:flex;flex-direction:column;align-items:center;color:#1d1b2e;line-height:1}
.mark b{font-family:'Playfair Display';font-style:italic;font-weight:500;font-size:16px;border:1.5px solid #1d1b2e;background:#fff;padding:0 6px 2px}
.mark span{font-family:'Permanent Marker';font-size:22px;transform:rotate(-3deg);margin-top:1px}
.brand b{display:block;font-family:'Playfair Display';font-weight:700;font-size:32px;line-height:1.05;letter-spacing:.2px}
.brand span{display:flex;align-items:center;gap:7px;margin-top:6px;font-size:17px;font-weight:700;color:#c9cff0;white-space:nowrap}

.kick{margin-top:40px;font-family:Caveat;font-size:50px;color:#ffd36e;line-height:1;transform:rotate(-4deg);transform-origin:left bottom}
h1{margin-top:2px;white-space:nowrap;font-family:"Playfair Display";font-weight:800;font-size:84px;line-height:1;letter-spacing:-1.5px;display:inline-block;position:relative;z-index:0}
h1::after{content:"";position:absolute;z-index:-1;left:-10px;right:-8px;bottom:10px;height:28px;
  background:linear-gradient(90deg,#e5482b,#f08a24 55%,#ecb330);opacity:.92;transform:skew(-8deg) rotate(-1deg);border-radius:3px}
h2{margin-top:8px;font-family:'Playfair Display';font-style:italic;font-weight:500;font-size:44px;line-height:1.1;color:#f4eee2}
.line{margin-top:22px;display:flex;gap:12px;align-items:center;font-size:20px;font-weight:700;color:#c9cff0;white-space:nowrap}
.line s{text-decoration:none;width:5px;height:5px;border-radius:50%;background:#f08a24}
.meta{margin-top:28px;display:flex;align-items:center;gap:18px;white-space:nowrap}
.pill{background:#fff8ea;border-radius:999px;padding:9px 20px 9px 16px;display:flex;gap:11px;align-items:center;color:#1e1b2e;box-shadow:0 12px 26px -12px rgba(0,0,0,.6)}
.pill em{font-style:normal;color:#e9a91c;letter-spacing:1px;font-size:19px}
.pill b{font-weight:800;font-size:21px}
.pill span{font-weight:700;font-size:17px;color:#4a4660}
.hours{display:flex;gap:8px;align-items:center;font-size:18px;font-weight:700;color:#fff3d6}

.pol{position:absolute;background:#fffdf7;padding:11px 11px 42px;box-shadow:0 28px 46px -16px rgba(0,0,0,.7),0 2px 0 rgba(0,0,0,.08)}
.pol img{display:block;object-fit:cover}
.tape{position:absolute;top:-14px;left:50%;width:92px;height:28px;margin-left:-46px;background:rgba(255,236,170,.8);transform:rotate(-4deg);
  clip-path:polygon(3% 0,97% 4%,100% 50%,96% 100%,2% 96%,0 50%)}
.pol figcaption{position:absolute;bottom:8px;left:0;right:0;text-align:center;font-family:Caveat;font-size:25px;line-height:1;color:#1e1b2e;white-space:nowrap}
.p1{left:704px;top:30px;transform:rotate(-5deg)}.p1 img{width:236px;height:232px;object-position:50% 45%}
.p2{left:948px;top:44px;transform:rotate(4.5deg)}.p2 img{width:196px;height:236px;object-position:50% 45%}
.p3{left:722px;top:356px;transform:rotate(-1.8deg)}.p3 img{width:410px;height:128px;object-position:50% 55%}

.band{position:absolute;left:-30px;right:-30px;bottom:6px;height:58px;transform:rotate(-1.6deg);
  background:linear-gradient(90deg,#e5482b,#f08a24 50%,#ecb330);display:flex;align-items:center;gap:22px;padding-left:46px;white-space:nowrap;
  box-shadow:0 -10px 30px -16px rgba(0,0,0,.6)}
.band span{font-family:'Playfair Display';font-style:italic;font-weight:600;font-size:27px;color:#2a1608}
.band i{font-style:normal;color:#fff3d6;font-size:18px}
</style></head><body>
<div class="bg"></div><div class="grain"></div>
<div class="stars"><i style="left:655px;top:300px;transform:scale(.6)"></i><i style="left:1160px;top:26px"></i><i style="left:1166px;top:330px;transform:scale(.7)"></i><i style="left:610px;top:52px;transform:scale(.8)"></i></div>
<figure class="pol p1"><span class="tape"></span><img src="${PHOTOS.night}"><figcaption>${t.caps[0]}</figcaption></figure>
<figure class="pol p2"><span class="tape"></span><img src="${PHOTOS.cocktail}"><figcaption>${t.caps[1]}</figcaption></figure>
<figure class="pol p3"><span class="tape"></span><img src="${PHOTOS.orange}"><figcaption>${t.caps[2]}</figcaption></figure>
<div class="copy">
  <div class="top">
    <div class="orb"><div class="mark"><b>kare</b><span>ARTE</span></div></div>
    <div class="brand"><b>${t.brand}</b><span>${PIN}${t.addr}</span></div>
  </div>
  <div class="kick">${t.kick}</div>
  <h1>${t.title}</h1>
  <h2>${t.sub}</h2>
  <p class="line">${t.line.join("<s></s>")}</p>
  <div class="meta">
    <div class="pill"><em>★★★★★</em><b>${t.rating}</b><span>${t.reviews}</span></div>
    <div class="hours">${CLOCK}${t.hours}</div>
  </div>
</div>
<div class="band">${t.band.map((w) => `<span>${w}</span>`).join("<i>✦</i>")}</div>
</body></html>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const lang of ["bg", "en"]) {
  await page.setContent(html(T[lang]), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode()));
  });
  const overflow = await page.evaluate(() => {
    const c = document.querySelector(".copy").getBoundingClientRect();
    const p = Math.min(...[...document.querySelectorAll(".pol")].map((e) => e.getBoundingClientRect().left));
    const widest = Math.max(...[...document.querySelectorAll(".copy > *, .meta > *, .top > *")].map((e) => e.getBoundingClientRect().right));
    const copyBottom = document.querySelector(".meta").getBoundingClientRect().bottom;
    const polBottom = Math.max(...[...document.querySelectorAll(".pol")].map((e) => e.getBoundingClientRect().bottom));
    const bandTop = document.querySelector(".band").getBoundingClientRect().top;
    return { widest: Math.round(widest), polLeft: Math.round(p), copyBottom: Math.round(copyBottom), polBottom: Math.round(polBottom), bandTop: Math.round(bandTop), fonts: [...document.fonts].filter((f) => f.status === "loaded").length };
  });
  const out = join(root, "public", lang === "bg" ? "og.jpg" : "og-en.jpg");
  await page.screenshot({ path: out, type: "jpeg", quality: 88 });
  console.log("wrote", out, overflow);
}
await browser.close();
