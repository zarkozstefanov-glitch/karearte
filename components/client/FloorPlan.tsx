"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PLAN_H, PLAN_W, photoSpots, tables, zones, zoneOf, type ChairStyle, type PhotoSpot, type Table, type TopStyle, type ZoneId } from "@/content/floorplan";
import { to, type Lang } from "@/lib/i18n";

export type TableStatus = "free" | "taken" | "small" | "walkin";
export type Avail = { s: TableStatus; until?: string };
type Sel = { kind: "table"; t: Table } | { kind: "zone"; z: ZoneId } | { kind: "spot"; s: PhotoSpot };

type Props = {
  lang: Lang;
  mode?: "explore" | "pick";
  status?: Record<string, Avail>;
  picked?: string | null;
  onPick?: (t: Table | null) => void;
  guests?: number;
  time?: string;
  onTime?: (time: string) => void;
  /** booking wizard: no zone/table descriptions, just the plan and a one-line status */
  minimal?: boolean;
};

const FULL: [number, number, number, number] = [0, 0, PLAN_W, PLAN_H];

export function FloorPlan({ lang, mode = "explore", status, picked, onPick, guests = 2, time, onTime, minimal = false }: Props) {
  const bg = lang === "bg";
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const [sel, setSel] = useState<Sel>(() => (mode === "explore" ? { kind: "table", t: tables.find((t) => t.id === "2")! } : { kind: "zone", z: "hall" }));
  const vb = useViewBox(zone === "all" ? FULL : zoneOf(zone).view);

  useEffect(() => {
    if (mode === "pick" && picked) {
      const t = tables.find((x) => x.id === picked);
      if (t) setSel({ kind: "table", t });
    }
  }, [picked, mode]);
  useEffect(() => {
    if (window.innerWidth >= 700) return;
    const t = picked ? tables.find((x) => x.id === picked) : null;
    setZone(t ? t.zone : sel.kind === "table" ? sel.t.zone : "hall");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  const selZone = sel.kind === "table" ? sel.t.zone : sel.kind === "spot" ? sel.s.zone : sel.z;

  const choose = (t: Table) => {
    setSel({ kind: "table", t });
    if (mode === "pick" && status?.[t.id]?.s === "free") onPick?.(picked === t.id ? null : t);
  };

  return (
    <div className={`fp fp-${mode} ${minimal ? "fp-min" : ""}`}>
      <div className="fp-tabs" role="tablist" aria-label={bg ? "Зони" : "Zones"}>
        <button role="tab" type="button" aria-selected={zone === "all"} className={`chip ${zone === "all" ? "is-on" : ""}`} onClick={() => setZone("all")}>
          {bg ? "Цялото място" : "Whole venue"}
        </button>
        {zones.map((z) => (
          <button
            key={z.id}
            role="tab"
            type="button"
            aria-selected={zone === z.id}
            className={`chip ${zone === z.id ? "is-on" : ""}`}
            onClick={() => {
              setZone(z.id);
              if (mode === "explore" || !picked) setSel({ kind: "zone", z: z.id });
            }}
          >
            {z.short[lang]}
          </button>
        ))}
      </div>

      <div className="fp-body">
        <div className="fp-map">
          <svg viewBox={vb.join(" ")} role="group" aria-label={bg ? "План на заведението" : "Floor plan"} className="fp-svg" preserveAspectRatio="xMidYMid meet">
            <PlanDefs />
            <rect x="-400" y="-400" width="2000" height="1700" className="fp-paper" />
            <Rooms onZone={(z) => setSel({ kind: "zone", z })} activeZone={selZone} />
            <Decor lang={lang} />
            {tables.map((t) => (
              <TableArt
                key={t.id}
                t={t}
                lang={lang}
                selected={mode === "pick" ? picked === t.id : sel.kind === "table" && sel.t.id === t.id}
                focused={sel.kind === "table" && sel.t.id === t.id}
                avail={mode === "pick" ? status?.[t.id] ?? { s: t.reservable ? "free" : "walkin" } : undefined}
                onClick={() => choose(t)}
              />
            ))}
            <Labels lang={lang} />
            {mode === "explore" &&
              photoSpots.map((s) => (
                <g
                  key={s.id}
                  className={`fp-cam ${sel.kind === "spot" && sel.s.id === s.id ? "is-on" : ""}`}
                  transform={`translate(${s.x} ${s.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={s.name[lang]}
                  onClick={() => setSel({ kind: "spot", s })}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel({ kind: "spot", s }))}
                >
                  <circle r="15" />
                  <path d="M-7 -3h3l2-3h4l2 3h3v9h-14z" />
                  <circle r="2.6" cy="1.5" className="fp-cam-lens" />
                </g>
              ))}
          </svg>
          <div className="fp-legend">
            {mode === "pick" ? (
              <>
                <span><i className="lg lg-free" /> {bg ? "Свободна" : "Free"}</span>
                <span><i className="lg lg-taken" /> {bg ? "Заета" : "Taken"}</span>
                <span><i className="lg lg-small" /> {bg ? `Не става за ${guests}` : `Not for ${guests}`}</span>
                <span><i className="lg lg-sel" /> {bg ? "Твоят избор" : "Your pick"}</span>
              </>
            ) : (
              <>
                <span><i className="lg lg-num" /> {bg ? "Натисни маса за подробности" : "Tap a table for details"}</span>
              </>
            )}
          </div>
        </div>

        <aside className="fp-panel fp-panel-text-only" aria-live="polite">
          {minimal ? <MiniPanel sel={sel} lang={lang} status={status} picked={picked} onPick={onPick} onTime={onTime} /> : <Panel sel={sel} lang={lang} mode={mode} status={status} picked={picked} onPick={onPick} guests={guests} onTime={onTime} />}
        </aside>
      </div>
    </div>
  );
}

/** one line: which table, how many seats, free/taken — and the action */
function MiniPanel({ sel, lang, status, picked, onPick, onTime }: { sel: Sel; lang: Lang; status?: Record<string, Avail>; picked?: string | null; onPick?: (t: Table | null) => void; onTime?: (t: string) => void }) {
  const bg = lang === "bg";
  if (sel.kind !== "table") return <p className="fp-mini-hint">{bg ? "Натисни зелена маса на плана" : "Tap a green table on the plan"}</p>;
  const t = sel.t;
  const a = status?.[t.id];
  const state =
    a?.s === "free" ? (bg ? `свободна до ${a.until}` : `free until ${a.until}`) : a?.s === "taken" ? (bg ? `заета до ${a.until}` : `taken until ${a.until}`) : a?.s === "small" ? (bg ? `до ${t.seats} души` : `up to ${t.seats}`) : bg ? "без резервация" : "walk-in only";
  return (
    <div className="fp-mini">
      <div>
        <b>{t.name[lang].split(" · ")[0]}</b>
        <span>
          {t.seats} {bg ? "места" : "seats"} · <i className={`fp-mini-s s-${a?.s ?? "walkin"}`}>{state}</i>
        </span>
      </div>
      {a?.s === "free" && (
        <button type="button" className={`btn btn-sm ${picked === t.id ? "btn-line" : "btn-accent"}`} onClick={() => onPick?.(picked === t.id ? null : t)}>
          {picked === t.id ? (bg ? "Избрана ✓" : "Picked ✓") : bg ? "Избери" : "Pick"}
        </button>
      )}
      {a?.s === "taken" && a.until && a.until !== "00:00" && (
        <button type="button" className="btn btn-sm btn-line" onClick={() => onTime?.(a.until!)}>
          {bg ? `Смени на ${a.until}` : `Switch to ${a.until}`}
        </button>
      )}
    </div>
  );
}

function Panel({ sel, lang, mode, status, picked, onPick, guests, onTime }: { sel: Sel; lang: Lang; mode: string; status?: Record<string, Avail>; picked?: string | null; onPick?: (t: Table | null) => void; guests: number; onTime?: (t: string) => void }) {
  const bg = lang === "bg";
  if (sel.kind !== "table") {
    const z = zoneOf(sel.kind === "zone" ? sel.z : sel.s.zone);
    return (
      <div className="fp-text">
        <p className="kicker">{z.name[lang]}</p>
        {sel.kind === "spot" && <h3>{sel.s.name[lang]}</h3>}
        <p>{z.desc[lang]}</p>
        {mode === "pick" && <p className="fp-hint">{bg ? "Натисни зелена маса на плана." : "Tap a green table on the plan."}</p>}
      </div>
    );
  }
  const t = sel.t;
  const a = status?.[t.id];
  const kind = t.type === "high" ? (bg ? "висока маса" : "high table") : t.type === "lounge" ? (bg ? "лаундж" : "lounge") : t.type === "bar" ? (bg ? "на бара" : "at the bar") : bg ? "ниска маса" : "low table";
  return (
    <div className="fp-text">
      <p className="kicker">{zoneOf(t.zone).name[lang]}</p>
      <h3>{t.name[lang]}</h3>
      <p className="fp-seats">
        {t.seats} {bg ? "места" : "seats"} · {kind}
      </p>
      {mode === "pick" && a && (
        <p className={`fp-state fp-state-${a.s}`}>
          {a.s === "free" && (bg ? `Свободна до ${a.until}` : `Free until ${a.until}`)}
          {a.s === "taken" && (bg ? `Заета до ${a.until}` : `Taken until ${a.until}`)}
          {a.s === "small" && (bg ? `За до ${t.seats} души` : `For up to ${t.seats}`)}
          {a.s === "walkin" && (bg ? "Без резервация — сядаш, ако е свободно" : "Walk-in only")}
        </p>
      )}
      {mode === "explore" && <p>{t.features[lang]}</p>}
      {mode === "explore" && t.reservable && (
        <Link className="btn btn-accent" href={`${to(lang, "reservations")}?table=${encodeURIComponent(t.id)}`}>
          {bg ? "Резервирай тази маса" : "Book this table"}
        </Link>
      )}
      {mode === "pick" && a?.s === "free" && (
        <button type="button" className={`btn ${picked === t.id ? "btn-line" : "btn-accent"}`} onClick={() => onPick?.(picked === t.id ? null : t)}>
          {picked === t.id ? (bg ? "Избрана ✓" : "Picked ✓") : bg ? "Избери тази маса" : "Pick this table"}
        </button>
      )}
      {mode === "pick" && a?.s === "taken" && a.until && a.until !== "00:00" && (
        <button type="button" className="btn btn-line" onClick={() => onTime?.(a.until!)}>
          {bg ? `Смени часа на ${a.until}` : `Switch to ${a.until}`}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ view box */
function useViewBox(target: [number, number, number, number]) {
  const [vb, setVb] = useState(target);
  const cur = useRef(target);
  const key = target.join(",");
  useEffect(() => {
    const from = cur.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur.current = target;
      setVb(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 650);
      const e = 1 - Math.pow(1 - p, 3);
      const v = from.map((f, i) => f + (target[i] - f) * e) as [number, number, number, number];
      cur.current = v;
      setVb(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return vb;
}

/* ------------------------------------------------------------------ art */
function PlanDefs() {
  return (
    <defs>
      <filter id="fp-sh" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity=".35" />
      </filter>
      <filter id="fp-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="g-floor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3a3944" />
        <stop offset=".45" stopColor="#2c2b34" />
        <stop offset=".5" stopColor="#3d3c48" />
        <stop offset=".55" stopColor="#2c2b34" />
        <stop offset="1" stopColor="#25242c" />
      </linearGradient>
      <pattern id="p-plank" width="160" height="22" patternUnits="userSpaceOnUse">
        <rect width="160" height="22" fill="url(#g-floor)" />
        <path d="M0 22H160M80 0V22" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
      </pattern>
      <pattern id="p-stone" width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="#d9d3c7" />
        <path d="M44 0H0V44" fill="none" stroke="#bfb8ab" strokeWidth="1.2" />
        <circle cx="12" cy="30" r=".8" fill="#b5ad9f" />
        <circle cx="31" cy="11" r=".7" fill="#b5ad9f" />
      </pattern>
      <pattern id="p-stone2" width="32" height="32" patternUnits="userSpaceOnUse">
        <rect width="32" height="32" fill="#e4ddd1" />
        <path d="M32 0H0V32" fill="none" stroke="#cbc3b5" strokeWidth="1" />
      </pattern>
      <pattern id="p-deck" width="36" height="36" patternUnits="userSpaceOnUse">
        <rect width="36" height="36" fill="#d4ccbd" />
        <path d="M36 0H0V36" fill="none" stroke="#b9b09f" strokeWidth="1" />
      </pattern>
      <pattern id="p-gabion" width="14" height="12" patternUnits="userSpaceOnUse">
        <rect width="14" height="12" fill="#efe9dc" />
        <ellipse cx="4" cy="4" rx="3.6" ry="2.8" fill="#fff" stroke="#c9c0ad" strokeWidth=".6" />
        <ellipse cx="11" cy="9" rx="3.2" ry="2.5" fill="#fbf7ee" stroke="#c9c0ad" strokeWidth=".6" />
      </pattern>
      <pattern id="p-lattice" width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M0 0L12 12M12 0L0 12" stroke="#8a6a45" strokeWidth="1.6" />
      </pattern>
      <pattern id="p-weave" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#cfa86f" />
        <path d="M0 3H6M3 0V6" stroke="#a9834d" strokeWidth=".8" />
      </pattern>
      <pattern id="p-geo" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#f4f1ea" />
        <path d="M8 1L15 8 8 15 1 8Z" fill="none" stroke="#1d1b22" strokeWidth="2" />
      </pattern>
      <pattern id="p-rug" width="18" height="18" patternUnits="userSpaceOnUse">
        <rect width="18" height="18" fill="#9b2f27" />
        <path d="M9 2L16 9 9 16 2 9Z" fill="#b8452f" />
        <circle cx="9" cy="9" r="2" fill="#e0b25a" />
      </pattern>
      <pattern id="p-orange-rug" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#5f7193" />
        <circle cx="5" cy="5" r=".9" fill="#7d8fb2" />
      </pattern>
      <pattern id="p-marble" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#f6f5f2" />
        <path d="M0 12C10 8 18 20 40 14M6 34C16 28 24 36 40 30" fill="none" stroke="#c9c7c2" strokeWidth="1" />
      </pattern>
      <pattern id="p-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="8" height="8" fill="rgba(40,40,50,.35)" />
        <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,.5)" strokeWidth="2" />
      </pattern>
      <radialGradient id="g-wood">
        <stop offset="0" stopColor="#caa06a" />
        <stop offset=".7" stopColor="#a8763e" />
        <stop offset="1" stopColor="#7d5228" />
      </radialGradient>
      <radialGradient id="g-wood-dark">
        <stop offset="0" stopColor="#8a6542" />
        <stop offset="1" stopColor="#5b3d24" />
      </radialGradient>
      <radialGradient id="g-glass">
        <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
        <stop offset="1" stopColor="#bfe1e6" stopOpacity=".9" />
      </radialGradient>
      <radialGradient id="g-lamp">
        <stop offset="0" stopColor="#ffd36e" stopOpacity=".55" />
        <stop offset="1" stopColor="#ffd36e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="g-vangogh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2a5c" />
        <stop offset=".4" stopColor="#2f56b0" />
        <stop offset=".55" stopColor="#f0c33c" />
        <stop offset="1" stopColor="#e8742a" />
      </linearGradient>
    </defs>
  );
}

function Rooms({ onZone, activeZone }: { onZone: (z: ZoneId) => void; activeZone: ZoneId }) {
  const z = (id: ZoneId) => ({ className: `fp-room ${activeZone === id ? "is-active" : ""}`, onClick: () => onZone(id) });
  return (
    <g>
      <g {...z("terrace")}>
        <rect x="30" y="60" width="350" height="730" fill="url(#p-stone)" />
      </g>
      <g {...z("patio")}>
        <rect x="760" y="30" width="420" height="210" fill="url(#p-stone2)" />
        <rect x="840" y="240" width="340" height="240" fill="url(#p-deck)" />
      </g>
      <g {...z("hall")}>
        <rect x="380" y="240" width="460" height="520" fill="url(#p-plank)" />
      </g>
      <g {...z("orange")}>
        <rect x="840" y="480" width="340" height="340" fill="url(#p-plank)" />
      </g>
    </g>
  );
}

const PAINTINGS: [number, number, number, number, string][] = [
  // x, y, w, h, colour (thin frames on walls)
  [389, 280, 6, 26, "#e5482b"],
  [389, 640, 6, 30, "#2f56b0"],
  [430, 748, 34, 6, "#f0c33c"],
  [520, 748, 24, 6, "#225f68"],
  [870, 488, 30, 6, "#2f56b0"],
  [930, 488, 22, 6, "#f0c33c"],
  [1050, 488, 34, 6, "#d23a8c"],
  [1166, 640, 6, 30, "#225f68"],
  [1166, 720, 6, 22, "#f0c33c"],
  [960, 806, 40, 6, "#2f56b0"],
];

function Decor({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const W = "#2a2433";
  return (
    <g pointerEvents="none">
      {/* warm lamp glow */}
      {[
        [528, 408],
        [652, 408],
        [452, 600],
        [635, 620],
        [430, 355],
        [1000, 640],
      ].map(([x, y]) => (
        <circle key={`l${x}`} cx={x} cy={y} r="70" fill="url(#g-lamp)" />
      ))}

      {/* wall paint */}
      <rect x="386" y="246" width="448" height="508" fill="none" stroke="#1f2d63" strokeWidth="8" />
      <path d="M760 246H834V330" fill="none" stroke="#2f6b55" strokeWidth="8" />
      <rect x="846" y="486" width="328" height="328" fill="none" stroke="#e8742a" strokeWidth="12" />
      <rect x="36" y="66" width="338" height="718" fill="none" stroke="#9b958d" strokeWidth="6" />

      {/* rugs */}
      <rect x="474" y="352" width="232" height="114" rx="3" fill="url(#p-rug)" filter="url(#fp-sh)" />
      <rect x="474" y="352" width="232" height="114" rx="3" fill="none" stroke="#e0b25a" strokeWidth="3" strokeDasharray="1 5" />
      <rect x="480" y="358" width="220" height="102" rx="2" fill="none" stroke="#6e1f1b" strokeWidth="4" />
      <rect x="930" y="540" width="150" height="120" rx="4" fill="url(#p-orange-rug)" />
      <rect x="790" y="118" width="80" height="64" fill="url(#p-geo)" />

      {/* string-light curtain, shelf, bottles */}
      {Array.from({ length: 34 }, (_, i) => (
        <circle key={`f${i}`} cx={398 + i * 11} cy={250} r="1.8" fill="#ffe7a3" filter="url(#fp-glow)" />
      ))}
      <rect x="470" y="252" width="290" height="8" fill="#6b4a2b" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={`b${i}`} cx={478 + i * 13} cy="256" r="2.6" fill={["#ffd36e", "#5fb0a0", "#e5482b", "#7aa2ff", "#f2f2f2"][i % 5]} />
      ))}
      {/* gabion bar */}
      <rect x="480" y="262" width="260" height="44" rx="6" fill="url(#p-gabion)" filter="url(#fp-sh)" />
      <rect x="480" y="262" width="260" height="44" rx="6" fill="none" stroke="#ffd36e" strokeWidth="2.5" filter="url(#fp-glow)" />
      <rect x="480" y="262" width="260" height="8" rx="3" fill="#8a5a2e" />
      <rect x="490" y="272" width="26" height="18" rx="3" fill="#2c2c33" />
      <circle cx="503" cy="281" r="4" fill="#c9c9cf" />

      {/* curtains */}
      <path d="M387 420q5 5 0 10t0 10M387 520q5 5 0 10t0 10" stroke="#f0c33c" strokeWidth="10" fill="none" />
      <path d="M833 315q-5 5 0 10t0 10M833 476q-5 5 0 10t0 10" stroke="#e8742a" strokeWidth="9" fill="none" />
      {PAINTINGS.map(([x, y, w, h, c], i) => (
        <rect key={`pt${i}`} x={x} y={y} width={w} height={h} fill={c} rx="1" />
      ))}
      {/* Van Gogh mural */}
      <rect x="829" y="500" width="9" height="110" fill="url(#g-vangogh)" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={`st${i}`} cx={833} cy={510 + i * 12} r="1.6" fill="#fff6c0" />
      ))}

      {/* marble platform + steps up to the orange room */}
      <rect x="730" y="600" width="110" height="120" fill="#e9e3d8" filter="url(#fp-sh)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={`s${i}`} x={756 + i * 21} y="610" width="18" height="100" fill={`rgb(${236 - i * 6},${230 - i * 6},${220 - i * 6})`} stroke="#c5bdae" strokeWidth="1" />
      ))}
      <path d="M752 660H834M822 650l12 10-12 10" stroke="#e5482b" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* steps from the small terrace up to the deck */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`ps${i}`} x="1100" y={196 + i * 16} width="72" height="14" fill={`rgb(${226 - i * 5},${219 - i * 5},${207 - i * 5})`} stroke="#b9b09f" strokeWidth="1" />
      ))}
      <path d="M1136 200V272M1126 260l10 12 10-12" stroke="#e5482b" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* deck railing */}
      <path d="M840 240H1100" stroke="#1d1b22" strokeWidth="3" />
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={`r${i}`} cx={846 + i * 25} cy="240" r="2.6" fill="#1d1b22" />
      ))}

      {/* lattice + poster */}
      <rect x="60" y="62" width="140" height="10" fill="url(#p-lattice)" />
      <rect x="770" y="32" width="120" height="10" fill="url(#p-lattice)" />
      <rect x="1166" y="70" width="10" height="90" fill="url(#p-lattice)" />
      <rect x="980" y="34" width="44" height="8" fill="#1d1b22" />
      {/* heaters */}
      {[
        [220, 495],
        [70, 290],
        [350, 130],
        [70, 690],
        [1150, 330],
      ].map(([x, y]) => (
        <g key={`h${x}${y}`} transform={`translate(${x} ${y})`} filter="url(#fp-sh)">
          <circle r="13" fill="#8e8a86" />
          <circle r="9" fill="#4a4744" />
          <circle r="4" fill="#e5482b" filter="url(#fp-glow)" />
        </g>
      ))}
      {/* plants */}
      {[
        [50, 80],
        [360, 770],
        [780, 220],
        [1160, 225],
        [1160, 50],
        [862, 800],
        [1160, 800],
        [360, 80],
        [404, 735],
        [820, 735],
      ].map(([x, y]) => (
        <g key={`p${x}-${y}`} transform={`translate(${x} ${y})`} filter="url(#fp-sh)">
          <circle r="12" fill="#3f7d4f" />
          <circle r="7" cx="4" cy="-4" fill="#5fae6c" />
          <circle r="5" cx="-5" cy="3" fill="#78c486" />
        </g>
      ))}

      {/* WALLS (gaps = doors / openings) */}
      <g stroke={W} strokeWidth="14" fill="none" strokeLinecap="square">
        <path d="M380 240H770M830 240H840" />
        <path d="M380 240V440M380 520V760" />
        <path d="M380 760H580M650 760H840" />
        <path d="M840 240V610M840 710V760" />
        <path d="M380 240V60H30V790H380V760" />
        <path d="M840 480H1180V820H840V760" />
        <path d="M760 240V30H1180V480" />
      </g>
      <path d="M840 336V474" stroke="#bfe6ff" strokeWidth="6" />
      <g fill="none" stroke={W} strokeWidth="2" strokeDasharray="5 4" opacity=".7">
        <path d="M380 440A40 40 0 0 0 340 480M380 520A40 40 0 0 1 340 480" />
        <path d="M770 240A60 60 0 0 1 830 180" />
      </g>
      <path d="M380 442V518" stroke="#bfe6ff" strokeWidth="4" opacity=".7" />
      <path d="M580 760V895M650 760V895" stroke={W} strokeWidth="4" strokeDasharray="10 7" opacity=".45" />
      <path d="M615 885V785M600 800l15-15 15 15" stroke="#e5482b" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="640" y="860" className="fp-entry-text">
        {bg ? "ВХОД" : "ENTRY"}
      </text>
      <text x="610" y="232" textAnchor="middle" className="fp-neon">
        KaReArte
      </text>
    </g>
  );
}

function Labels({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const pill = (x: number, y: number, text: string, w: number) => (
    <g transform={`translate(${x} ${y})`} className="fp-pill" pointerEvents="none">
      <rect x={-w / 2} y="-15" width={w} height="30" rx="15" />
      <text textAnchor="middle" y="7">
        {text}
      </text>
    </g>
  );
  return (
    <g>
      {pill(205, 762, bg ? "Голямата тераса" : "Big terrace", 190)}
      {pill(500, 730, bg ? "Основната зала" : "Main hall", 170)}
      {pill(1010, 790, bg ? "Оранжевата стая" : "Orange room", 190)}
      {pill(950, 208, bg ? "Малката тераса" : "Small terrace", 180)}
      {pill(990, 455, bg ? "Горна площадка" : "Upper deck", 180)}
    </g>
  );
}

/* ---------- furniture ---------- */
const TOP_FILL: Record<TopStyle, string> = {
  wood: "url(#g-wood)",
  "wood-dark": "url(#g-wood-dark)",
  marble: "url(#p-marble)",
  glass: "url(#g-glass)",
  iron: "#2f5d50",
  blue: "#2c56c8",
  metal: "#3a3a40",
  bar: "transparent",
};

function chairPositions(t: Table): { x: number; y: number; a: number }[] {
  const { n, layout } = t.chairs;
  const s = t.shape;
  if (s.kind === "round") {
    const d = s.r + (t.chair.startsWith("wire") || t.chair.startsWith("armchair") || t.chair === "rattan" ? 16 : 12);
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + (n === 2 ? Math.PI / 2 : 0);
      return { x: s.cx + Math.cos(a) * d, y: s.cy + Math.sin(a) * d, a: (a * 180) / Math.PI + 90 };
    });
  }
  const { x, y, w, h } = s;
  const along = (k: number, len: number) => Array.from({ length: k }, (_, i) => ((i + 0.5) / k) * len);
  switch (layout) {
    case "bottom":
      return along(n, w).map((dx) => ({ x: x + dx, y: y + h + 15, a: 0 }));
    case "left":
      return along(n, h).map((dy) => ({ x: x - 14, y: y + dy, a: -90 }));
    case "leftright":
      return [...along(n / 2, h).map((dy) => ({ x: x - 16, y: y + dy, a: -90 })), ...along(n / 2, h).map((dy) => ({ x: x + w + 16, y: y + dy, a: 90 }))];
    case "topbottom":
      return [...along(n / 2, w).map((dx) => ({ x: x + dx, y: y - 13, a: 0 })), ...along(n / 2, w).map((dx) => ({ x: x + dx, y: y + h + 13, a: 180 }))];
    case "around":
      return [
        { x: x + w / 2, y: y - 13, a: 0 },
        { x: x + w + 13, y: y + h / 2, a: 90 },
        { x: x + w / 2, y: y + h + 13, a: 180 },
        { x: x - 13, y: y + h / 2, a: -90 },
      ].slice(0, n);
    default:
      return [];
  }
}

function Chair({ x, y, a, style }: { x: number; y: number; a: number; style: ChairStyle }) {
  switch (style) {
    case "stool-leather":
      return (
        <g>
          <circle cx={x} cy={y} r="9" fill="#b5652e" stroke="#5a2e12" strokeWidth="1.5" />
          <circle cx={x - 2} cy={y - 2} r="3" fill="#d98a4f" />
        </g>
      );
    case "stool-black":
      return (
        <g>
          <circle cx={x} cy={y} r="8.5" fill="#26262c" />
          <circle cx={x} cy={y} r="4.5" fill="#a8763e" />
        </g>
      );
    case "stool-burgundy":
      return <circle cx={x} cy={y} r="8.5" fill="#7a2638" stroke="#3e0f1b" strokeWidth="1.5" />;
    case "wire-white":
    case "wire-yellow": {
      const c = style === "wire-white" ? "#f6f6f2" : "#f2c230";
      const s = style === "wire-white" ? "#9a9a96" : "#a37b10";
      return (
        <g>
          <circle cx={x} cy={y} r="13" fill={c} stroke={s} strokeWidth="1.5" />
          {[0, 30, 60, 90, 120, 150].map((d) => (
            <line key={d} x1={x + Math.cos((d * Math.PI) / 180) * 12} y1={y + Math.sin((d * Math.PI) / 180) * 12} x2={x - Math.cos((d * Math.PI) / 180) * 12} y2={y - Math.sin((d * Math.PI) / 180) * 12} stroke={s} strokeWidth=".8" />
          ))}
        </g>
      );
    }
    case "bistro":
      return <circle cx={x} cy={y} r="8" fill="#2a2a2e" stroke="#55555c" strokeWidth="2" />;
    case "armchair-orange":
      return (
        <g transform={`rotate(${a} ${x} ${y})`}>
          <rect x={x - 12} y={y - 11} width="24" height="22" rx="7" fill="#e8742a" stroke="#9c4512" strokeWidth="1.5" />
          <rect x={x - 12} y={y - 11} width="24" height="7" rx="3.5" fill="#c55d1d" />
        </g>
      );
    case "rattan":
      return (
        <g transform={`rotate(${a} ${x} ${y})`}>
          <rect x={x - 11} y={y - 10} width="22" height="20" rx="6" fill="url(#p-weave)" stroke="#8a6a3c" strokeWidth="1.5" />
        </g>
      );
    case "wood":
      return (
        <g transform={`rotate(${a} ${x} ${y})`}>
          <rect x={x - 8} y={y - 7} width="16" height="14" rx="3" fill="#8a5a2e" />
          <rect x={x - 8} y={y - 7} width="16" height="4" rx="2" fill="#5e3b1c" />
        </g>
      );
    default:
      return null;
  }
}

function TableArt({ t, lang, selected, focused, avail, onClick }: { t: Table; lang: Lang; selected: boolean; focused: boolean; avail?: Avail; onClick: () => void }) {
  const status = avail?.s;
  const chairs = useMemo(() => chairPositions(t), [t]);
  const s = t.shape;
  const cx = s.kind === "round" ? s.cx : s.x + s.w / 2;
  const cy = s.kind === "round" ? s.cy : s.y + s.h / 2;
  const bx = s.kind === "round" ? s.cx + s.r * 0.8 : s.x + s.w;
  const by = s.kind === "round" ? s.cy - s.r * 0.8 : s.y;
  const cls = ["fp-t", selected && "is-sel", focused && "is-focus", status && `st-${status}`].filter(Boolean).join(" ");
  const label = `${t.name[lang]}, ${t.seats} ${lang === "bg" ? "места" : "seats"}${status === "taken" ? (lang === "bg" ? ", заета" : ", taken") : ""}`;
  const pad = 10;
  return (
    <g className={cls} role="button" tabIndex={0} aria-label={label} aria-pressed={selected} onClick={onClick} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}>
      {s.kind === "round" ? <circle cx={cx} cy={cy} r={s.r + 26} className="fp-halo" /> : <rect x={s.x - 26} y={s.y - 26} width={s.w + 52} height={s.h + 52} rx="20" className="fp-halo" />}
      <g className="fp-furn" filter="url(#fp-sh)">
        {t.chairs.layout === "sofas" && s.kind === "rect" && (
          <>
            <rect x={s.x - 14} y={s.y - 30} width={s.w + 28} height="22" rx="9" fill="#f3efe6" stroke="#b9b2a4" strokeWidth="1.5" />
            <rect x={s.x - 14} y={s.y + s.h + 8} width={s.w + 28} height="22" rx="9" fill="#f3efe6" stroke="#b9b2a4" strokeWidth="1.5" />
          </>
        )}
        {t.chairs.layout === "sofa-top" && s.kind === "rect" && <rect x={s.x - 18} y={s.y - 34} width={s.w + 36} height="26" rx="9" fill="url(#p-weave)" stroke="#8a6a3c" strokeWidth="1.5" />}
        {chairs.map((c, i) => (
          <Chair key={i} x={c.x} y={c.y} a={c.a} style={t.chair} />
        ))}
        {t.top !== "bar" &&
          (s.kind === "round" ? (
            <circle cx={cx} cy={cy} r={s.r} fill={TOP_FILL[t.top]} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
          ) : (
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={TOP_FILL[t.top]} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
          ))}
        {t.top === "iron" && s.kind === "round" && <circle cx={cx} cy={cy} r={s.r - 6} fill="none" stroke="#5c8f80" strokeWidth="2" strokeDasharray="3 3" />}
        {t.top === "glass" && s.kind === "round" && <ellipse cx={cx - s.r * 0.3} cy={cy - s.r * 0.3} rx={s.r * 0.35} ry={s.r * 0.18} fill="#fff" opacity=".7" />}
        {t.top === "wood" && s.kind === "round" && <circle cx={cx} cy={cy} r={s.r * 0.6} fill="none" stroke="rgba(90,50,20,.25)" strokeWidth="1" />}
      </g>
      {(status === "taken" || status === "small" || status === "walkin") && (s.kind === "round" ? <circle cx={cx} cy={cy} r={s.r + pad} className={`fp-veil fp-veil-${status}`} /> : <rect x={s.x - pad} y={s.y - pad} width={s.w + pad * 2} height={s.h + pad * 2} rx="10" className={`fp-veil fp-veil-${status}`} />)}
      {avail?.until && (status === "free" || status === "taken") && (
        <g className={`fp-until fp-until-${status}`} transform={`translate(${cx} ${(s.kind === "round" ? s.cy + s.r : s.y + s.h) + (t.chairs.layout === "sofas" ? 44 : 26)})`} pointerEvents="none">
          <rect x="-30" y="-10" width="60" height="20" rx="10" />
          <text y="4.5" textAnchor="middle">
            {(lang === "bg" ? "до " : "til ") + avail.until}
          </text>
        </g>
      )}
      {t.type === "bar" ? (
        <g className="fp-badge fp-badge-bar" transform={`translate(${cx} ${s.kind === "rect" ? s.y + s.h + 36 : cy})`}>
          <rect x="-26" y="-11" width="52" height="22" rx="11" />
          <text y="5" textAnchor="middle">
            {lang === "bg" ? "БАР" : "BAR"}
          </text>
        </g>
      ) : (
        <g className="fp-badge" transform={`translate(${bx} ${by})`}>
          <circle r="13" />
          <text y="5" textAnchor="middle">
            {t.label}
          </text>
        </g>
      )}
    </g>
  );
}
