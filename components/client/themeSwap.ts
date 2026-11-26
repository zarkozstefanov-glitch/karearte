import { setTheme, type Theme } from "@/lib/theme";

/**
 * Desktop theme switch as a sunset / moonset: the current sun (or moon) leaves the header and sets
 * along a parabola right into the bottom-right corner of the screen, while the other one rises from
 * the left along a mirrored arc and settles into the header. Behind the setting body a glowing
 * diagonal band sweeps the new theme in, top-left to bottom-right.
 * Phones (and reduced motion) get only the soft cross-fade.
 */
const SET_MS = 1600;
const RISE_DELAY = 820;
const RISE_MS = 1300;
const SWITCH_AT = 380;
const WIPE_MS = 1700;
const FADE_MS = 1000;
const BAND = 220;
const LAG = 240;
let busy = false;

type Pt = { x: number; y: number };
type Body = "sun" | "moon";

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Switch colours instantly (no CSS transitions), so the revealed page is already in its final state. */
function snap(next: Theme) {
  const html = document.documentElement;
  html.classList.add("theme-snap");
  setTheme(next);
  void getComputedStyle(html).color;
  requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("theme-snap")));
}

function crossFade(next: Theme) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!d.startViewTransition) return snap(next);
  const html = document.documentElement;
  html.classList.add("vt-theme");
  d.startViewTransition(() => snap(next));
  setTimeout(() => html.classList.remove("vt-theme"), FADE_MS + 100);
}

/**
 * Desktop: the new theme sweeps in diagonally behind the setting body, led by a glowing band.
 * The band's position is derived from the body's own path (`sumAt` = x + y of its centre at a time),
 * so it always trails LAG px behind it, then finishes the sweep past the corner once the body has set.
 */
function wipe(next: Theme, sky: HTMLElement, W: number, H: number, sumAt: (ms: number) => number, t0: number) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!d.startViewTransition) return snap(next);
  const html = document.documentElement;
  const endAt = SWITCH_AT + WIPE_MS;
  const goal = W + H + BAND;
  const L = (W + H) * 1.6;
  const cAt = (ms: number) => {
    if (ms <= SET_MS) return sumAt(ms) - LAG;
    const from = sumAt(SET_MS) - LAG;
    const k = Math.min(1, (ms - SET_MS) / (endAt - SET_MS));
    return from + (goal - from) * (1 - Math.pow(1 - k, 2));
  };
  const strip = document.createElement("span");
  strip.className = `orb-band orb-band-${next}`;
  strip.style.width = `${L}px`;
  strip.style.height = `${BAND}px`;
  strip.style.opacity = "0";
  sky.prepend(strip);
  html.classList.add("vt-wipe");
  const vt = d.startViewTransition(() => snap(next));
  vt.ready
    .then(() => {
      // start from wherever the body is now (the snapshot takes a frame or two)
      const start = Math.min(performance.now() - t0, endAt - 200);
      const dur = endAt - start;
      const n = 48;
      const clip: Keyframe[] = [];
      const band: Keyframe[] = [];
      for (let i = 0; i <= n; i++) {
        const c = cAt(start + (dur * i) / n);
        clip.push({ clipPath: `polygon(0 0, ${c.toFixed(1)}px 0, 0 ${c.toFixed(1)}px)` });
        band.push({
          transform: `translate3d(${(c / 2 - L / 2).toFixed(1)}px, ${(c / 2 - BAND / 2).toFixed(1)}px, 0) rotate(-45deg)`,
          opacity: `${Math.min(1, (i / n) * 8).toFixed(3)}`,
        });
      }
      html.animate(clip, { duration: dur, easing: "linear", fill: "both", pseudoElement: "::view-transition-new(root)" });
      strip.animate(band, { duration: dur, easing: "linear", fill: "both" });
    })
    .catch(() => snap(next));
  setTimeout(() => html.classList.remove("vt-wipe"), endAt + 150);
}

function flyer(orb: HTMLElement, which: Body, size: number) {
  const el = document.createElement("span");
  el.className = "orb-fly";
  el.style.width = el.style.height = `${size}px`;
  const src = orb.querySelector<SVGElement>(`.orb-${which}`)!;
  const svg = src.cloneNode(true) as SVGElement;
  svg.setAttribute("class", `orb-fly-${which}`);
  // continue exactly where the header one is: same glow, same ray angle
  const glow = getComputedStyle(src).filter;
  if (glow && glow !== "none") svg.style.filter = glow;
  const rays = src.querySelector(".orb-rays")?.getAnimations()[0];
  const cr = svg.querySelector<SVGElement>(".orb-rays");
  if (rays && cr && typeof rays.currentTime === "number") cr.style.animationDelay = `-${rays.currentTime % 40000}ms`;
  el.append(svg, orb.querySelector(".orb-mark")!.cloneNode(true));
  return el;
}

/** Keyframes along a parabola. "set": flat start, steep dive. "rise": steep climb, flat arrival. */
function arc(from: Pt, to: Pt, kind: "set" | "rise", warp: (t: number) => number, extra: (t: number) => Keyframe, n = 60) {
  const k: Keyframe[] = [];
  for (let i = 0; i <= n; i++) {
    const t = warp(i / n);
    const x = from.x + (to.x - from.x) * t;
    const s = kind === "set" ? t * t : 1 - (1 - t) * (1 - t);
    const y = from.y + (to.y - from.y) * s;
    k.push({ transform: `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`, ...extra(t) });
  }
  return k;
}

export function swapTheme(next: Theme) {
  if (busy) return;
  const orb = document.querySelector<HTMLElement>(".header-logo .logo-orb");
  const desktop = window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return setTheme(next);
  if (!orb || !desktop) return crossFade(next);
  busy = true;

  const r = orb.getBoundingClientRect();
  const size = r.width;
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;
  const home: Pt = { x: r.left, y: r.top };
  // the centre of the setting body lands exactly on the bottom-right corner
  const corner: Pt = { x: W - size / 2, y: H - size / 2 };
  const outgoing: Body = next === "night" ? "sun" : "moon";
  const incoming: Body = next === "night" ? "moon" : "sun";

  const sky = document.createElement("div");
  sky.className = "orb-sky";
  const setting = flyer(orb, outgoing, size);
  const rising = flyer(orb, incoming, size);
  rising.style.opacity = "0";
  sky.append(setting, rising);
  document.body.append(sky);
  orb.classList.add("is-away");

  setting.animate(
    arc(home, corner, "set", easeInOut, (t) => ({
      scale: `${1 + t * 0.5}`,
      filter:
        outgoing === "sun"
          ? `saturate(${(1 + t * 0.9).toFixed(3)}) hue-rotate(${(-t * 24).toFixed(1)}deg)`
          : `brightness(${(1 - t * 0.2).toFixed(3)})`,
      opacity: `${t < 0.9 ? 1 : ((1 - t) / 0.1).toFixed(3)}`,
    })),
    { duration: SET_MS, easing: "linear", fill: "forwards" },
  );

  rising.animate(
    arc({ x: -size * 0.5, y: H * 0.6 }, home, "rise", easeOut, (t) => ({
      scale: `${(1.4 - t * 0.4).toFixed(3)}`,
      opacity: `${Math.min(1, t * 4).toFixed(3)}`,
      filter:
        incoming === "sun"
          ? `saturate(${(1.7 - t * 0.7).toFixed(3)}) hue-rotate(${(-(1 - t) * 20).toFixed(1)}deg)`
          : `brightness(${(0.8 + t * 0.2).toFixed(3)})`,
    })),
    { duration: RISE_MS, delay: RISE_DELAY, easing: "linear", fill: "forwards" },
  );

  const t0 = performance.now();
  // x + y of the setting body's centre at a given time (same maths as its keyframes)
  const sumAt = (ms: number) => {
    const t = easeInOut(Math.min(1, Math.max(0, ms / SET_MS)));
    return home.x + (corner.x - home.x) * t + home.y + (corner.y - home.y) * t * t + size;
  };
  setTimeout(() => wipe(next, sky, W, H, sumAt, t0), SWITCH_AT);

  setTimeout(() => {
    orb.classList.remove("is-away");
    sky.remove();
    busy = false;
  }, Math.max(SET_MS, RISE_DELAY + RISE_MS, SWITCH_AT + WIPE_MS) + 60);
}
