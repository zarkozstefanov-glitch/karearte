"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { ReservationFlow } from "./ReservationFlow";
import { BookingForm } from "./BookingForm";

export function ResTabs({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const [tab, setTab] = useState<"table" | "private">("table");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("type") === "private") setTab("private");
    const on = (e: Event) => setTab((e as CustomEvent).detail);
    window.addEventListener("ka-res-tab", on);
    return () => window.removeEventListener("ka-res-tab", on);
  }, []);
  return (
    <>
      <div className="seg res-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "table"} className={tab === "table" ? "is-on" : ""} onClick={() => setTab("table")}>
          {bg ? "Маса" : "Table"}
        </button>
        <button type="button" role="tab" aria-selected={tab === "private"} className={tab === "private" ? "is-on" : ""} onClick={() => setTab("private")}>
          {bg ? "Частно събитие / наем" : "Private event / hire"}
        </button>
      </div>
      {tab === "table" ? (
        <ReservationFlow lang={lang} />
      ) : (
        <div className="res-private">
          <div className="card">
            <BookingForm lang={lang} initial="private" lockKind />
          </div>
          <aside className="res-aside">
            <img src="/img/garden-day-960.webp" alt="" loading="lazy" />
            <h3>{bg ? "Цялото място е твое" : "The whole place is yours"}</h3>
            <ul className="ticks">
              <li>{bg ? "До 50 гости в залата, оранжевата стая и терасите." : "Up to 50 guests across the hall, orange room and terraces."}</li>
              <li>{bg ? "Малкото Каре — до 15 гости." : "Little Kare — up to 15 guests."}</li>
              <li>{bg ? "Наем на час, отстъпка над 3 часа, без минимална консумация." : "Hourly hire, discount over 3 hours, no minimum spend."}</li>
              <li>{bg ? "Отговаряме до 24 часа с оферта." : "We reply within 24 hours with an offer."}</li>
            </ul>
          </aside>
        </div>
      )}
    </>
  );
}
