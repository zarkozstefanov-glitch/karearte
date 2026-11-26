"use client";
import { useRef, useState } from "react";
import { Img } from "../Img";
import { Moon, Sun } from "../Icons";
import type { Lang } from "@/lib/i18n";

/** Drag the brush-line to wipe from day to night (keyboard: arrows). */
export function DayNight({ lang, day, night }: { lang: Lang; day: string; night: string }) {
  const [p, setP] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const move = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    setP(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="daynight"
      style={{ "--p": `${p}%` } as React.CSSProperties}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
    >
      <Img id={night} lang={lang} sizes="(min-width: 1000px) 60vw, 100vw" className="dn-img dn-night" />
      <div className="dn-day-wrap">
        <Img id={day} lang={lang} sizes="(min-width: 1000px) 60vw, 100vw" className="dn-img dn-day" />
      </div>
      <span className="dn-tag dn-tag-day">
        <Sun /> {lang === "bg" ? "Ден" : "Day"}
      </span>
      <span className="dn-tag dn-tag-night">
        <Moon /> {lang === "bg" ? "Нощ" : "Night"}
      </span>
      <div
        className="dn-handle"
        role="slider"
        tabIndex={0}
        aria-label={lang === "bg" ? "Ден или нощ" : "Day or night"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(p)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setP((v) => Math.max(0, v - 5));
          if (e.key === "ArrowRight") setP((v) => Math.min(100, v + 5));
        }}
      >
        <span />
      </div>
    </div>
  );
}
