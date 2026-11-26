"use client";
import { swapTheme } from "./themeSwap";
import { useTheme } from "./useTheme";
import { Moon, Sun } from "../Icons";
import { ui, type Lang } from "@/lib/i18n";

export function ThemeToggle({ lang }: { lang: Lang }) {
  const t = useTheme();
  const night = t === "night";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={ui.switchTheme[lang]}
      aria-pressed={night}
      onClick={() => swapTheme(night ? "day" : "night")}
    >
      <span className="tt-track" aria-hidden="true">
        <span className="tt-knob">{night ? <Moon /> : <Sun />}</span>
      </span>
      <span className="tt-label">{night ? ui.nightMode[lang] : ui.dayMode[lang]}</span>
    </button>
  );
}
