"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mediaList, srcSet } from "@/lib/media";
import type { Lang } from "@/lib/i18n";
import { ArrowLeft, Arrow, Close, Play } from "../Icons";

type Item = { kind: "img"; id: string; cat: string; mood: string; alt: string; w: number; h: number; color: string } | { kind: "video"; src: string; cat: "video"; mood: string; alt: string; w: number; h: number; color: string };

const CATS: Record<string, { bg: string; en: string }> = {
  all: { bg: "Всичко", en: "All" },
  interior: { bg: "Интериор", en: "Interior" },
  drinks: { bg: "Напитки", en: "Drinks" },
  garden: { bg: "Тераси", en: "Terraces" },
  events: { bg: "Събития", en: "Events" },
  video: { bg: "Видео", en: "Video" },
};

export function Gallery({ lang, videos }: { lang: Lang; videos: { src: string; title: string; mood: string }[] }) {
  const items: Item[] = useMemo(
    () => [
      ...mediaList.map((m) => ({ kind: "img" as const, id: m.id, cat: m.cat === "team" ? "events" : m.cat, mood: m.mood, alt: m[lang], w: m.w, h: m.h, color: m.color })),
      ...videos.map((v) => ({ kind: "video" as const, src: v.src, cat: "video" as const, mood: v.mood, alt: v.title, w: 540, h: 960, color: "#222" })),
    ],
    [lang, videos],
  );
  const [cat, setCat] = useState("all");
  const [mood, setMood] = useState<"all" | "day" | "night">("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = items.filter((i) => (cat === "all" || i.cat === cat) && (mood === "all" || i.mood === mood));

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)), [list.length]);
  const dlg = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    document.documentElement.classList.add("lb-open");
    dlg.current?.focus();
    return () => {
      window.removeEventListener("keydown", k);
      document.documentElement.classList.remove("lb-open");
    };
  }, [open, close, go]);

  const cur = open !== null ? list[open] : null;

  return (
    <>
      <div className="gal-filters" role="toolbar" aria-label={lang === "bg" ? "Филтри" : "Filters"}>
        <div className="chips">
          {Object.entries(CATS).map(([k, v]) => (
            <button key={k} type="button" className={`chip ${cat === k ? "is-on" : ""}`} aria-pressed={cat === k} onClick={() => setCat(k)}>
              {v[lang]}
            </button>
          ))}
        </div>
        <div className="chips chips-mood">
          {(["all", "day", "night"] as const).map((m) => (
            <button key={m} type="button" className={`chip ${mood === m ? "is-on" : ""}`} aria-pressed={mood === m} onClick={() => setMood(m)}>
              {m === "all" ? (lang === "bg" ? "Ден и нощ" : "Day & night") : m === "day" ? (lang === "bg" ? "Ден" : "Day") : lang === "bg" ? "Нощ" : "Night"}
            </button>
          ))}
        </div>
      </div>

      <ul className="masonry">
        {list.map((it, i) => (
          <li key={it.kind === "img" ? it.id : it.src} className="m-item">
            <button type="button" onClick={() => setOpen(i)} aria-label={it.alt} style={{ aspectRatio: `${it.w}/${it.h}`, background: it.color }}>
              {it.kind === "img" ? (
                <img {...srcSet(it.id)} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw" alt={it.alt} width={it.w} height={it.h} loading="lazy" decoding="async" />
              ) : (
                <>
                  <img src={`${it.src}.webp`} alt={it.alt} width={540} height={960} loading="lazy" decoding="async" />
                  <span className="m-play" aria-hidden="true">
                    <Play />
                  </span>
                </>
              )}
            </button>
          </li>
        ))}
      </ul>

      {cur && (
        <div
          ref={dlg}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={cur.alt}
          tabIndex={-1}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <figure>
            {cur.kind === "img" ? (
              <img {...srcSet(cur.id)} sizes="90vw" alt={cur.alt} />
            ) : (
              <video src={`${cur.src}.mp4`} poster={`${cur.src}.webp`} controls autoPlay playsInline />
            )}
            <figcaption>
              {cur.alt} <span>{(open ?? 0) + 1} / {list.length}</span>
            </figcaption>
          </figure>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label={lang === "bg" ? "Затвори" : "Close"}>
            <Close />
          </button>
          <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label={lang === "bg" ? "Предишна" : "Previous"}>
            <ArrowLeft />
          </button>
          <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label={lang === "bg" ? "Следваща" : "Next"}>
            <Arrow />
          </button>
        </div>
      )}
    </>
  );
}
