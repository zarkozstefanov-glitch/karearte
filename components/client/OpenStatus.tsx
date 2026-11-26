"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import type { Lang } from "@/lib/i18n";

function sofiaNow() {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Sofia", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.find((x) => x.type === "weekday")!.value);
  const h = +p.find((x) => x.type === "hour")!.value;
  const m = +p.find((x) => x.type === "minute")!.value;
  return { wd, mins: h * 60 + m };
}
const toMin = (s: string) => +s.split(":")[0] * 60 + +s.split(":")[1];

export function OpenStatus({ lang, compact }: { lang: Lang; compact?: boolean }) {
  const [s, setS] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const calc = () => {
      const { wd, mins } = sofiaNow();
      const today = site.hours.find((h) => h.dow.includes(wd))!;
      const o = toMin(today.open), c = toMin(today.close);
      const open = mins >= o && mins < c;
      const text = open
        ? lang === "bg" ? `Отворено до ${today.close === "24:00" ? "00:00" : today.close}` : `Open until ${today.close === "24:00" ? "midnight" : today.close}`
        : mins < o
          ? lang === "bg" ? `Отваряме в ${today.open}` : `Opens at ${today.open}`
          : lang === "bg" ? "Затворено · утре от 11:00" : "Closed · tomorrow from 11:00";
      setS({ open, text });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [lang]);
  if (!s) return <span className="open-status is-pending">{lang === "bg" ? "Всеки ден до 00:00" : "Every day till midnight"}</span>;
  return (
    <span className={`open-status ${s.open ? "is-open" : "is-closed"} ${compact ? "is-compact" : ""}`}>
      <i aria-hidden="true" />
      {s.text}
    </span>
  );
}
