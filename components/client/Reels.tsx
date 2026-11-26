"use client";
import { useEffect, useRef, useState } from "react";
import { Play, SoundOff, SoundOn, Instagram } from "../Icons";
import type { Lang } from "@/lib/i18n";

export type Reel = { src: string; title: string; href?: string };

/** Phone-shaped reels: autoplay muted while visible, tap to unmute one at a time. */
export function Reels({ reels, lang }: { reels: Reel[]; lang: Lang }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [sound, setSound] = useState<number | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !r) {
            if (!v.src) v.src = v.dataset.src!;
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.35 },
    );
    refs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, []);

  const toggle = (i: number) => {
    refs.current.forEach((v, j) => {
      if (!v) return;
      v.muted = j !== i || sound === i;
      if (j === i) {
        if (!v.src) v.src = v.dataset.src!;
        v.play().catch(() => {});
      }
    });
    setSound((s) => (s === i ? null : i));
  };

  return (
    <div className="reels" role="list">
      {reels.map((r, i) => (
        <figure className="reel" role="listitem" key={r.src} data-reveal="up" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
          <video
            ref={(el) => {
              refs.current[i] = el;
            }}
            muted
            loop
            playsInline
            preload="none"
            poster={`${r.src}.webp`}
            data-src={`${r.src}.mp4`}
          />
          <button type="button" className="reel-sound" onClick={() => toggle(i)} aria-pressed={sound === i} aria-label={sound === i ? (lang === "bg" ? "Спри звука" : "Mute") : lang === "bg" ? "Пусни със звук" : "Play with sound"}>
            {reduce && sound !== i ? <Play /> : sound === i ? <SoundOn /> : <SoundOff />}
          </button>
          <figcaption>
            <span>{r.title}</span>
            {r.href && (
              <a href={r.href} target="_blank" rel="noopener" aria-label="Instagram">
                <Instagram />
              </a>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
