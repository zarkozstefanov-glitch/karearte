"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One observer for every [data-reveal] element; also runs [data-count] number tickers. */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);
  return null;
}

function count(el: HTMLElement) {
  const target = el.dataset.count!;
  const num = parseFloat(target.replace(",", "."));
  if (Number.isNaN(num)) return;
  const dec = target.includes(",") ? target.split(",")[1].length : 0;
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / 1200);
    const v = num * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toFixed(dec).replace(".", ",");
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
