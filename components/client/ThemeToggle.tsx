"use client";
import { setTheme } from "@/lib/theme";
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
      onClick={() => {
        const next = night ? "day" : "night";
        const go = () => setTheme(next);
        const d = document as Document & { startViewTransition?: (cb: () => void) => void };
        if (d.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          document.documentElement.classList.add("vt-theme");
          d.startViewTransition(go);
          setTimeout(() => document.documentElement.classList.remove("vt-theme"), 900);
        } else go();
      }}
    >
      <span className="tt-track" aria-hidden="true">
        <span className="tt-knob">{night ? <Moon /> : <Sun />}</span>
      </span>
      <span className="tt-label">{night ? ui.nightMode[lang] : ui.dayMode[lang]}</span>
    </button>
  );
}
