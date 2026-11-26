"use client";
import { useEffect, useRef } from "react";

/** Sticky section whose inner track scrolls horizontally as the page scrolls vertically. */
export function Praised({ children, count }: { children: React.ReactNode; count: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const o = outer.current, t = track.current;
        if (!o || !t) return;
        if (!mq.matches) {
          t.style.transform = "";
          o.style.height = "";
          return;
        }
        const dist = t.scrollWidth - t.clientWidth;
        o.style.height = `${window.innerHeight + dist}px`;
        const r = o.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / (o.offsetHeight - window.innerHeight)));
        t.style.transform = `translate3d(${-p * dist}px,0,0)`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    mq.addEventListener("change", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      mq.removeEventListener("change", on);
    };
  }, []);
  return (
    <div ref={outer} className="praised-outer" style={{ "--n": count } as React.CSSProperties}>
      <div className="praised-sticky">
        <div ref={track} className="praised-track">
          {children}
        </div>
      </div>
    </div>
  );
}
