"use client";
import { useEffect, useRef } from "react";

/** Sticky section whose inner track moves sideways while the page scrolls down (all screen sizes).
 *  Only becomes sticky when the content is wider than the screen. Shows a progress bar. */
export function Praised({ children, count }: { children: React.ReactNode; count: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const o = outer.current, t = track.current;
        if (!o || !t) return;
        const dist = t.scrollWidth - t.clientWidth;
        if (reduce.matches || dist <= 4) {
          o.classList.remove("is-active");
          o.style.height = "";
          t.style.transform = "";
          return;
        }
        o.classList.add("is-active");
        const stickyH = (o.firstElementChild as HTMLElement).offsetHeight;
        o.style.height = `${stickyH + dist * 1.1}px`;
        const r = o.getBoundingClientRect();
        const top = parseFloat(getComputedStyle(o.firstElementChild as HTMLElement).top) || 0;
        const p = Math.min(1, Math.max(0, (top - r.top) / (o.offsetHeight - stickyH)));
        t.style.transform = `translate3d(${-p * dist}px,0,0)`;
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div ref={outer} className="praised-outer" style={{ "--n": count } as React.CSSProperties}>
      <div className="praised-sticky">
        <div ref={track} className="praised-track">
          {children}
        </div>
        <span className="hs-progress" aria-hidden="true">
          <span ref={bar} />
        </span>
      </div>
    </div>
  );
}
