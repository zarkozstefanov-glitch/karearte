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
    const o = outer.current!, t = track.current!, sticky = o.firstElementChild as HTMLElement;
    // geometry is measured only on resize; scrolling just reads one rect and moves the track
    let dist = 0, stickyTop = 0, range = 1, active = false, raf = 0, last = -1;
    const measure = () => {
      t.style.transform = "";
      dist = t.scrollWidth - t.clientWidth;
      active = !reduce.matches && dist > 4;
      o.classList.toggle("is-active", active);
      if (!active) {
        o.style.height = "";
        return;
      }
      const stickyH = sticky.offsetHeight;
      o.style.height = `${stickyH + dist * 1.1}px`;
      stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      range = Math.max(1, o.offsetHeight - stickyH);
      last = -1;
      frame();
    };
    const frame = () => {
      raf = 0;
      if (!active) return;
      const p = Math.min(1, Math.max(0, (stickyTop - o.getBoundingClientRect().top) / range));
      if (p === last) return;
      last = p;
      t.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(measure, 120);
    };
    measure();
    // images/fonts can change widths after first paint
    const ro = new ResizeObserver(onResize);
    ro.observe(t);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
