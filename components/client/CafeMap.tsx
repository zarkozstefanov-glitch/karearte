"use client";
import { useState } from "react";
import { PLAN_H, PLAN_W, tables, zones, zoneOf, type Table, type ZoneId } from "@/content/floorplan";
import type { Lang } from "@/lib/i18n";
import type { Avail } from "./FloorPlan";

/** A friendly, drawn map of the café for the booking wizard: warm wood hall, orange room, green terraces,
 *  tables with their chairs. Free tables glow and are tappable; taken / too-small ones are faded. */
type Props = { lang: Lang; status: Record<string, Avail>; picked: string | null; onSelect: (t: Table) => void };

const ROOMS: { id: ZoneId; d: string; fill: string; label: [number, number] }[] = [
  { id: "terrace", d: "M30 60H380V790H30Z", fill: "url(#cm-garden)", label: [70, 110] },
  { id: "patio", d: "M760 30H1180V480H840V240H760Z", fill: "url(#cm-deck)", label: [880, 80] },
  { id: "hall", d: "M380 240H840V760H380Z", fill: "url(#cm-wood)", label: [405, 735] },
  { id: "orange", d: "M840 480H1180V820H840Z", fill: "url(#cm-orange)", label: [870, 530] },
];

export function CafeMap({ lang, status, picked, onSelect }: Props) {
  const bg = lang === "bg";
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const vb = zone === "all" ? [0, 0, PLAN_W, PLAN_H] : zoneOf(zone).view;

  return (
    <div className="cm">
      <div className="cm-tabs" role="tablist">
        <button type="button" className={`chip ${zone === "all" ? "is-on" : ""}`} onClick={() => setZone("all")}>
          {bg ? "Всичко" : "All"}
        </button>
        {zones.map((z) => (
          <button key={z.id} type="button" className={`chip ${zone === z.id ? "is-on" : ""}`} onClick={() => setZone(z.id)}>
            {z.short[lang]}
          </button>
        ))}
      </div>
      <svg className="cm-svg" viewBox={vb.join(" ")} preserveAspectRatio="xMidYMid meet" role="group" aria-label={bg ? "Карта на кафенето" : "Café map"}>
        <defs>
          <linearGradient id="cm-wood" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2b77e" />
            <stop offset="1" stopColor="#c8955a" />
          </linearGradient>
          <linearGradient id="cm-orange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7b26a" />
            <stop offset="1" stopColor="#ec8e43" />
          </linearGradient>
          <linearGradient id="cm-garden" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9d9a4" />
            <stop offset="1" stopColor="#97c486" />
          </linearGradient>
          <pattern id="cm-deck" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#d9e8c6" />
            <path d="M0 20H40M0 0H40" stroke="#c3d8ab" strokeWidth="2" />
          </pattern>
          <pattern id="cm-planks" width="120" height="26" patternUnits="userSpaceOnUse">
            <path d="M0 26H120M60 0V26" stroke="rgba(120,70,25,.18)" strokeWidth="2" />
          </pattern>
        </defs>

        <rect x="-300" y="-300" width="1800" height="1500" className="cm-paper" />
        {ROOMS.map((r) => (
          <g key={r.id} className={`cm-room ${zone !== "all" && zone !== r.id ? "is-dim" : ""}`}>
            <path d={r.d} fill={r.fill} />
            {r.id === "hall" && <path d={r.d} fill="url(#cm-planks)" />}
            <path d={r.d} className="cm-wall" />
          </g>
        ))}

        {/* garden greenery */}
        {[[60, 760], [350, 90], [60, 420], [350, 760], [1150, 60], [1150, 450], [790, 60]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} className="cm-plant">
            <circle r="26" fill="#5f9d5c" />
            <circle r="17" cx="12" cy="-8" fill="#78b46f" />
            <circle r="12" cx="-10" cy="6" fill="#8ac57f" />
          </g>
        ))}

        {/* entrance */}
        <g className="cm-entry">
          <path d="M615 880V790M597 808l18-18 18 18" />
          <text x="645" y="870">{bg ? "Вход" : "Entrance"}</text>
        </g>

        {ROOMS.map((r) => (
          <text key={r.id} x={r.label[0]} y={r.label[1]} className="cm-label">
            {zoneOf(r.id).short[lang]}
          </text>
        ))}

        {tables.map((t) => (
          <TableToken key={t.id} t={t} a={status[t.id] ?? { s: t.reservable ? "free" : "walkin" }} picked={picked === t.id} onClick={() => onSelect(t)} />
        ))}
      </svg>
      <div className="cm-legend">
        <span><i className="cm-dot free" /> {bg ? "Свободна" : "Free"}</span>
        <span><i className="cm-dot taken" /> {bg ? "Заета / не става" : "Taken / too small"}</span>
        <span><i className="cm-dot picked" /> {bg ? "Твоята" : "Yours"}</span>
      </div>
    </div>
  );
}

function chairs(t: Table): [number, number][] {
  const n = Math.max(1, t.chairs.n);
  if (t.shape.kind === "round") {
    const { cx, cy, r } = t.shape;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return [cx + Math.cos(a) * (r + 15), cy + Math.sin(a) * (r + 15)];
    });
  }
  const { x, y, w, h } = t.shape;
  const top = Math.ceil(n / 2), bot = n - top, out: [number, number][] = [];
  const vertical = h > w * 1.3;
  if (vertical) {
    for (let i = 0; i < top; i++) out.push([x - 15, y + (h * (i + 1)) / (top + 1)]);
    for (let i = 0; i < bot; i++) out.push([x + w + 15, y + (h * (i + 1)) / (bot + 1)]);
  } else {
    for (let i = 0; i < top; i++) out.push([x + (w * (i + 1)) / (top + 1), y - 15]);
    for (let i = 0; i < bot; i++) out.push([x + (w * (i + 1)) / (bot + 1), y + h + 15]);
  }
  return out;
}

function TableToken({ t, a, picked, onClick }: { t: Table; a: Avail; picked: boolean; onClick: () => void }) {
  const cls = `cm-table s-${a.s} ${picked ? "is-picked" : ""}`;
  const s = t.shape;
  const [lx, ly] = s.kind === "round" ? [s.cx, s.cy] : [s.x + s.w / 2, s.y + s.h / 2];
  return (
    <g className={cls} role="button" tabIndex={0} aria-label={t.name.bg} onClick={onClick} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}>
      {chairs(t).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9" className="cm-chair" />
      ))}
      {s.kind === "round" ? <circle cx={s.cx} cy={s.cy} r={s.r} className="cm-top" /> : <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={Math.min(14, s.rx ?? 10)} className="cm-top" />}
      <text x={lx} y={ly} className="cm-num">
        {t.label}
      </text>
      {picked && <circle cx={lx + (s.kind === "round" ? s.r : s.w / 2) - 4} cy={ly - (s.kind === "round" ? s.r : s.h / 2) + 4} r="13" className="cm-check" />}
    </g>
  );
}
