"use client";
import { useState } from "react";
import { site } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import { Pin } from "../Icons";

/** Google Map loads only after a click (no third-party cookies before consent). */
export function MapEmbed({ lang }: { lang: Lang }) {
  const [on, setOn] = useState(false);
  return (
    <div className="map-box">
      {on ? (
        <iframe title={lang === "bg" ? "Карта" : "Map"} src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" className="map-cover" onClick={() => setOn(true)}>
          <Pin />
          <b>{site.address[lang]}</b>
          <span>{lang === "bg" ? "Покажи картата (Google Maps)" : "Show the map (Google Maps)"}</span>
        </button>
      )}
    </div>
  );
}
