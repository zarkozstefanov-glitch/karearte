"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { to, ui, type Lang } from "@/lib/i18n";
import { Calendar, Phone, Pin } from "../Icons";

export function MobileBar({ lang }: { lang: Lang }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let acc = 0;
    const on = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      acc = Math.sign(d) === Math.sign(acc) ? acc + d : d;
      if (y < 400) setShown(false);
      else if (acc < -40) setShown(true);
      else if (acc > 40) setShown(false);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`mobile-bar ${shown ? "is-shown" : ""}`} aria-label={lang === "bg" ? "Бързи действия" : "Quick actions"}>
      <Link href={to(lang, "reservations")} className="mb-main">
        <Calendar />
        {ui.reserve[lang]}
      </Link>
      <a href={`tel:${site.phone}`}>
        <Phone />
        {ui.call[lang]}
      </a>
      <Link href={to(lang, "findUs")}>
        <Pin />
        {ui.directions[lang]}
      </Link>
    </nav>
  );
}
