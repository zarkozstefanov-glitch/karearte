import type { Lang } from "./i18n";

const loc = (l: Lang) => (l === "bg" ? "bg-BG" : "en-GB");
const TZ = "Europe/Sofia";

export const fmtDay = (iso: string, l: Lang) => new Intl.DateTimeFormat(loc(l), { day: "numeric", timeZone: TZ }).format(new Date(iso));
const MON = {
  bg: ["яну", "фев", "мар", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const monthIdx = (iso: string) => +new Intl.DateTimeFormat("en-GB", { month: "numeric", timeZone: TZ }).format(new Date(iso)) - 1;
export const fmtMon = (iso: string, l: Lang) => MON[l][monthIdx(iso)];
export const monShort = (monthIndex: number, l: Lang) => MON[l][monthIndex];
export const fmtWeekday = (iso: string, l: Lang) => new Intl.DateTimeFormat(loc(l), { weekday: "long", timeZone: TZ }).format(new Date(iso));
export const fmtTime = (iso: string, l: Lang) => new Intl.DateTimeFormat(loc(l), { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ }).format(new Date(iso));
export const fmtDate = (iso: string, l: Lang) => new Intl.DateTimeFormat(loc(l), { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(new Date(iso));
export const fmtMonthYear = (ym: string, l: Lang) => new Intl.DateTimeFormat(loc(l), { month: "long", year: "numeric", timeZone: TZ }).format(new Date(ym + "-15"));
