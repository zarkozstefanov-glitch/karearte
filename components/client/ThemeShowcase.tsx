"use client";
import { setTheme } from "@/lib/theme";
import { useTheme } from "./useTheme";
import { Img } from "../Img";
import { Moon, Sun } from "../Icons";
import type { Lang } from "@/lib/i18n";

/** One big switch: shows the current mood of the venue and flips the whole site day ↔ night. */
export function ThemeShowcase({ lang }: { lang: Lang }) {
  const t = useTheme();
  const night = t === "night";
  const bg = lang === "bg";
  const flip = () => {
    const next = night ? "day" : "night";
    const d = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (d.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("vt-theme");
      d.startViewTransition(() => setTheme(next));
      setTimeout(() => document.documentElement.classList.remove("vt-theme"), 900);
    } else setTheme(next);
  };
  return (
    <div className={`ts ${night ? "is-night" : "is-day"}`}>
      <Img id="hall-bar-wide" lang={lang} sizes="(min-width: 1000px) 60vw, 100vw" className="ts-img ts-day" />
      <Img id="night-mural-guests" lang={lang} sizes="(min-width: 1000px) 60vw, 100vw" className="ts-img ts-night" />
      <div className="ts-label">
        <span>{night ? (bg ? "Сега гледаш: нощ" : "You're seeing: night") : bg ? "Сега гледаш: ден" : "You're seeing: day"}</span>
      </div>
      <button type="button" className="ts-btn" onClick={flip} aria-label={bg ? "Смени целия сайт ден / нощ" : "Switch the whole site day / night"}>
        <span className="ts-orb">{night ? <Sun /> : <Moon />}</span>
        <span className="ts-txt">{night ? (bg ? "Покажи ми деня" : "Show me the day") : bg ? "Покажи ми нощта" : "Show me the night"}</span>
      </button>
    </div>
  );
}
