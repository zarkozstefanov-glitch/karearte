"use client";
import { useEffect } from "react";

/** Fallback for browsers without CSS scroll-driven animations (e.g. Firefox): moves the review rows
 *  with the scroll — odd rows left, even rows right — writing one transform per row, nothing else. */
export function ScrollRows() {
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.querySelector<HTMLElement>(".rv-mq");
    if (!box) return;
    const rows = Array.from(box.querySelectorAll<HTMLElement>(".rv-row"));
    const k = [-0.5, 0.5, -0.4, 0.42];
    let amp = 0, raf = 0;
    const measure = () => (amp = parseFloat(getComputedStyle(box).getPropertyValue("--amp")) || 600);
    const frame = () => {
      raf = 0;
      const r = box.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height))); // 0…1 like "cover"
      rows.forEach((row, i) => (row.style.transform = `translate3d(${((p - 0.5) * 2 * k[i % 4] * amp).toFixed(1)}px,0,0)`));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const rs = () => { measure(); on(); };
    measure(); frame();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", rs);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", on); removeEventListener("resize", rs); };
  }, []);
  return null;
}
