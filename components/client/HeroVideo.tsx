"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion, useTheme } from "./useTheme";

/** Tall “framed” video in the hero: garden spritz by day, candle-lit evening by night. */
export function HeroVideo({ label }: { label: string }) {
  const t = useTheme();
  const reduce = useReducedMotion();
  const day = useRef<HTMLVideoElement>(null);
  const night = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!t) return;
    const on = t === "day" ? day.current : night.current;
    const off = t === "day" ? night.current : day.current;
    off?.pause();
    if (on && !reduce) {
      if (!on.src) on.src = on.dataset.src!;
      on.play().catch(() => {});
    }
  }, [t, reduce]);

  return (
    <div className="hero-frame" aria-label={label} role="img">
      <video ref={day} className="hv hv-day" muted loop playsInline preload="none" poster="/video/hero-day.webp" data-src="/video/hero-day.mp4" aria-hidden="true" />
      <video ref={night} className="hv hv-night" muted loop playsInline preload="none" poster="/video/hero-night.webp" data-src="/video/hero-night.mp4" aria-hidden="true" />
    </div>
  );
}
