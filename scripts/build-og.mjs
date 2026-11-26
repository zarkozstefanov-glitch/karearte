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
    kick: "скрита", title: "Бар-галерия", sub: "в сърцето на София",
    line: ["Кафе денем", "коктейли нощем", "изкуство по стените"],
    rating: "4,8", reviews: "545 отзива в Google", addr: "ул. „Петър Парчевич“ 36, София",
    caps: ["спомени на свещ", "коктейл на сляпо", "оранжевата стая"],
  },
  en: {
    kick: "a hidden", title: "Bar-gallery", sub: "in the heart of Sofia",
    line: ["Coffee by day", "cocktails by night", "art on every wall"],
    rating: "4.8", reviews: "545 Google reviews", addr: "36 Petar Parchevich St, Sofia",
    caps: ["by candlelight", "the blind cocktail", "the orange room"],
  },
};

const html = (t) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,500&family=Caveat:wght@700&family=Manrope:wght@600;700;800&family=Permanent+Marker&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#0e1430;font-family:Manrope,sans-serif;position:relative;color:#fff8ea}
.bg{position:absolute;inset:0;background:
  radial-gradient(40% 55% at 82% 45%,rgba(240,138,36,.22),transparent 70%),
  radial-gradient(70% 95% at 10% 15%,#2a4596 0,#17214d 52%,#0d1330 100%)}
.grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:soft-light;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.stars i{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffe7a3;box-shadow:0 0 10px 3px rgba(255,211,110,.55)}

.copy{position:absolute;left:68px;top:58px;width:600px}
.orb{width:92px;height:92px;border-radius:50%;display:grid;place-items:center;
  background:radial-gradient(circle at 38% 35%,#fff,#e3ebff 55%,#9fb3e6);
  box-shadow:0 0 0 10px rgba(201,216,255,.08),0 0 44px rgba(150,180,255,.6)}
.mark{display:flex;flex-direction:column;align-items:center;color:#1d1b2e;line-height:1}
.mark b{font-family:'Playfair Display';font-style:italic;font-weight:500;font-size:16px;border:1.5px solid #1d1b2e;background:#fff;padding:0 6px 2px}
.mark span{font-family:'Permanent Marker';font-size:22px;transform:rotate(-3deg);margin-top:1px}

.kick{margin-top:34px;font-family:Caveat;font-size:50px;color:#ffd36e;line-height:1;transform:rotate(-4deg);transform-origin:left bottom}
h1{margin-top:2px;white-space:nowrap;font-family:"Playfair Display";font-weight:800;font-size:92px;line-height:1;letter-spacing:-1.5px;display:inline-block;position:relative;z-index:0}
h1::after{content:"";position:absolute;z-index:-1;left:-10px;right:-14px;bottom:10px;height:30px;
  background:linear-gradient(90deg,#e5482b,#f08a24 55%,#ecb330);opacity:.92;transform:skew(-8deg) rotate(-1deg);border-radius:3px}
h2{margin-top:4px;font-family:'Playfair Display';font-style:italic;font-weight:500;font-size:44px;line-height:1.1;color:#f4eee2}
.line{margin-top:20px;display:flex;gap:12px;align-items:center;font-size:20px;font-weight:700;color:#c9cff0;white-space:nowrap}
.line s{text-decoration:none;width:5px;height:5px;border-radius:50%;background:#f08a24}

.meta{margin-top:26px;display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.pill{white-space:nowrap;background:#fff8ea;border-radius:999px;padding:9px 20px 9px 16px;display:flex;gap:12px;align-items:center;color:#1e1b2e;box-shadow:0 12px 26px -12px rgba(0,0,0,.6)}
.pill em{font-style:normal;color:#e9a91c;letter-spacing:1px;font-size:20px}
.pill b{font-weight:800;font-size:22px}
.pill span{font-weight:700;font-size:18px;color:#4a4660}
.addr{white-space:nowrap;display:flex;gap:8px;align-items:center;font-size:18px;font-weight:600;color:#e9e3d6;padding-left:6px}
.addr svg{flex:none}

.pol{position:absolute;background:#fffdf7;padding:12px 12px 44px;box-shadow:0 30px 50px -16px rgba(0,0,0,.7),0 2px 0 rgba(0,0,0,.08)}
.pol img{display:block;object-fit:cover}
.tape{position:absolute;top:-15px;left:50%;width:96px;height:30px;margin-left:-48px;background:rgba(255,236,170,.78);transform:rotate(-4deg);
  clip-path:polygon(3% 0,97% 4%,100% 50%,96% 100%,2% 96%,0 50%)}
.pol figcaption{position:absolute;bottom:9px;left:0;right:0;text-align:center;font-family:Caveat;font-size:26px;line-height:1;color:#1e1b2e;white-space:nowrap}
.p1{left:706px;top:40px;transform:rotate(-6deg)}.p1 img{width:226px;height:236px;object-position:50% 45%}
.p2{left:956px;top:62px;transform:rotate(5deg)}.p2 img{width:184px;height:222px;object-position:50% 45%}
.p3{left:830px;top:352px;transform:rotate(2.5deg)}.p3 img{width:250px;height:160px}

.brush{position:absolute;left:-20px;right:-20px;bottom:-4px;height:30px;background:linear-gradient(90deg,#e5482b,#f08a24 50%,#ecb330);
  clip-path:polygon(0 45%,6% 22%,14% 48%,25% 18%,37% 46%,50% 20%,63% 50%,75% 16%,87% 46%,100% 24%,100% 100%,0 100%)}
</style></head><body>
<div class="bg"></div><div class="grain"></div>
<div class="stars"><i style="left:640px;top:54px"></i><i style="left:548px;top:136px;transform:scale(.6)"></i><i style="left:1152px;top:38px"></i><i style="left:1120px;top:560px;transform:scale(.7)"></i><i style="left:690px;top:300px;transform:scale(.5)"></i></div>
<figure class="pol p1"><span class="tape"></span><img src="${PHOTOS.night}"><figcaption>${t.caps[0]}</figcaption></figure>
<figure class="pol p2"><span class="tape"></span><img src="${PHOTOS.cocktail}"><figcaption>${t.caps[1]}</figcaption></figure>
<figure class="pol p3"><span class="tape"></span><img src="${PHOTOS.orange}"><figcaption>${t.caps[2]}</figcaption></figure>
<div class="copy">
  <div class="orb"><div class="mark"><b>kare</b><span>ARTE</span></div></div>
  <div class="kick">${t.kick}</div>
  <h1>${t.title}</h1>
  <h2>${t.sub}</h2>
  <p class="line">${t.line.join("<s></s>")}</p>
  <div class="meta">
    <div class="pill"><em>★★★★★</em><b>${t.rating}</b><span>${t.reviews}</span></div>
    <div class="addr"><svg width="18" height="22" viewBox="0 0 18 22"><path d="M9 1a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" fill="#f08a24"/><circle cx="9" cy="9" r="3" fill="#0e1430"/></svg>${t.addr}</div>
  </div>
</div>
<div class="brush"></div>
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
    const widest = Math.max(...[...document.querySelectorAll(".copy > *, .meta > *")].map((e) => e.getBoundingClientRect().right));
    return { widest: Math.round(widest), polLeft: Math.round(p), fonts: [...document.fonts].filter((f) => f.status === "loaded").length };
  });
  const out = join(root, "public", lang === "bg" ? "og.jpg" : "og-en.jpg");
  await page.screenshot({ path: out, type: "jpeg", quality: 88 });
  console.log("wrote", out, overflow);
}
await browser.close();
