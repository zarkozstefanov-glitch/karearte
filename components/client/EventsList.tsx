"use client";
import { useMemo, useState } from "react";
import { eventTypes, type EventType, type KAEvent } from "@/content/events";
import type { Lang } from "@/lib/i18n";
import { EventCard } from "../EventCard";

export function EventsList({ lang, events }: { lang: Lang; events: KAEvent[] }) {
  const [type, setType] = useState<EventType | "all">("all");
  const types = useMemo(() => Array.from(new Set(events.map((e) => e.type))), [events]);
  const list = events.filter((e) => type === "all" || e.type === type);
  return (
    <>
      <div className="chips" role="toolbar" aria-label={lang === "bg" ? "Вид събитие" : "Event type"}>
        <button type="button" className={`chip ${type === "all" ? "is-on" : ""}`} aria-pressed={type === "all"} onClick={() => setType("all")}>
          {lang === "bg" ? "Всички" : "All"}
        </button>
        {types.map((t) => (
          <button key={t} type="button" className={`chip ${type === t ? "is-on" : ""}`} aria-pressed={type === t} onClick={() => setType(t)}>
            {eventTypes[t][lang]}
          </button>
        ))}
      </div>
      <ul className="ev-grid">
        {list.map((e) => (
          <li key={e.slug}>
            <EventCard e={e} lang={lang} />
          </li>
        ))}
      </ul>
    </>
  );
}
