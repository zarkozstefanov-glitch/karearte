// Reservation domain for the public site — FRONTEND ONLY for now.
// Every function that will talk to the backend (apps/api, see MASTER_PLAN §2/§3 `reservations`)
// lives here with its final signature; today they return mock data so the flow can be tested.
import { site } from "@/content/site";
import { tables, zoneOf, type Table } from "@/content/floorplan";
import type { Avail } from "@/components/client/FloorPlan";

export const API = process.env.NEXT_PUBLIC_API_URL;
export const MAX_ONLINE_GUESTS = 12;
export const SLOT_MIN = 30;
export const STAY_MIN = 120;

export type Slot = { time: string; state: "open" | "few" | "full" };
export type ReservationInput = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  guests: number;
  tableId: string | null; // null = "anywhere"
  zone: string | null;
  name: string;
  phone: string;
  email?: string;
  occasion?: string;
  note?: string;
  marketing: boolean;
  lang: "bg" | "en";
};
export type Reservation = ReservationInput & { ref: string; status: "pending" | "confirmed" | "cancelled"; createdAt: string };

/* ---------------- helpers ---------------- */
const pad = (n: number) => String(n).padStart(2, "0");
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISODate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toMin = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
const fromMin = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

/** Sofia "now" as local wall-clock parts, independent of the visitor's timezone. */
export function sofiaNow() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Sofia", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return { date: `${g("year")}-${g("month")}-${g("day")}`, mins: +g("hour") * 60 + +g("minute") };
}

function hoursFor(date: string) {
  const dow = parseISODate(date).getDay();
  return site.hours.find((h) => h.dow.includes(dow))!;
}

/** Bookable start times: from opening until 90 min before closing, every 30 min; past times hidden. */
export function slotTimes(date: string): string[] {
  const h = hoursFor(date);
  const open = toMin(h.open);
  const close = h.close === "24:00" ? 24 * 60 : toMin(h.close);
  const now = sofiaNow();
  const out: string[] = [];
  for (let m = open; m <= close - 90; m += SLOT_MIN) {
    if (date === now.date && m < now.mins + 30) continue;
    out.push(fromMin(m));
  }
  return out;
}

export function bookableDays(n = 30): string[] {
  const start = parseISODate(sofiaNow().date);
  return Array.from({ length: n }, (_, i) => toISODate(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))).filter((d) => slotTimes(d).length > 0);
}

/* ---------------- mock availability (deterministic per date+time) ---------------- */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  // murmur3 finaliser for a good avalanche
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
const BLOCK = 120;
const OPEN = 11 * 60;
function blockTaken(date: string, block: number, tableId: string) {
  const dow = parseISODate(date).getDay();
  const m = OPEN + block * BLOCK;
  const weekend = dow === 5 || dow === 6;
  const busy = m >= 18 * 60 ? (weekend ? 0.38 : 0.25) : m >= 14 * 60 ? 0.15 : 0.08;
  return hash(`${date}|${block}|${tableId}`) < busy;
}
function mockTaken(date: string, time: string, tableId: string) {
  return blockTaken(date, Math.floor((toMin(time) - OPEN) / BLOCK), tableId);
}
function closeMin(date: string) {
  const h = hoursFor(date);
  return h.close === "24:00" ? 24 * 60 : toMin(h.close);
}
/** When does the current state (free / taken) of a table end? */
function mockUntil(date: string, time: string, tableId: string): string {
  const close = closeMin(date);
  let b = Math.floor((toMin(time) - OPEN) / BLOCK);
  const taken = blockTaken(date, b, tableId);
  while (OPEN + (b + 1) * BLOCK < close && blockTaken(date, b + 1, tableId) === taken) b++;
  const end = Math.min(close, OPEN + (b + 1) * BLOCK);
  return end >= 24 * 60 ? "00:00" : fromMin(end);
}

/** GET /public/availability?date&time&guests → per-table state + until when it lasts. */
export async function getAvailability(date: string, time: string, guests: number): Promise<Record<string, Avail>> {
  if (API) {
    const r = await fetch(`${API}/public/availability?date=${date}&time=${time}&guests=${guests}`);
    if (r.ok) return r.json();
  }
  await new Promise((r) => setTimeout(r, 200));
  const out: Record<string, Avail> = {};
  for (const t of tables) {
    if (!t.reservable) out[t.id] = { s: "walkin" };
    else if (t.seats < guests) out[t.id] = { s: "small" };
    else if (mockTaken(date, time, t.id)) out[t.id] = { s: "taken", until: mockUntil(date, time, t.id) };
    else out[t.id] = { s: "free", until: mockUntil(date, time, t.id) };
  }
  return out;
}

/** GET /public/slots?date&guests → slot list with a fullness hint. */
export async function getSlots(date: string, guests: number): Promise<Slot[]> {
  if (API) {
    const r = await fetch(`${API}/public/slots?date=${date}&guests=${guests}`);
    if (r.ok) return r.json();
  }
  const times = slotTimes(date);
  return times.map((time) => {
    const fit = tables.filter((t) => t.reservable && t.seats >= guests);
    const free = fit.filter((t) => !mockTaken(date, time, t.id)).length;
    return { time, state: free === 0 ? "full" : free <= 2 ? "few" : "open" };
  });
}

/** POST /public/reservations */
export async function createReservation(input: ReservationInput): Promise<{ ok: true; reservation: Reservation } | { ok: false; error: string }> {
  if (API) {
    try {
      const r = await fetch(`${API}/public/reservations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
      if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
      return { ok: true, reservation: await r.json() };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  const reservation: Reservation = { ...input, ref: `KA-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, status: "pending", createdAt: new Date().toISOString() };
  saveLocal(reservation);
  return { ok: true, reservation };
}

/** POST /public/reservations/:ref/cancel */
export async function cancelReservation(ref: string) {
  if (API) await fetch(`${API}/public/reservations/${ref}/cancel`, { method: "POST" }).catch(() => {});
  const list = myReservations().map((r) => (r.ref === ref ? { ...r, status: "cancelled" as const } : r));
  writeLocal(list);
  return list;
}

/* ---------------- "my reservations" on this device ---------------- */
const KEY = "ka-my-reservations";
export function myReservations(): Reservation[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocal(list: Reservation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-20)));
  } catch {}
}
function saveLocal(r: Reservation) {
  writeLocal([...myReservations(), r]);
}

/* ---------------- calendar file ---------------- */
export function icsFor(r: Reservation) {
  const [y, m, d] = r.date.split("-").map(Number);
  const [hh, mm] = r.time.split(":").map(Number);
  const start = `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  const endMin = hh * 60 + mm + STAY_MIN;
  const end = `${y}${pad(m)}${pad(d)}T${pad(Math.floor(endMin / 60) % 24)}${pad(endMin % 60)}00`;
  const t = r.tableId ? tables.find((x) => x.id === r.tableId) : null;
  const where = t ? `${zoneOf(t.zone).name[r.lang]} · ${t.name[r.lang]}` : "";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KaRe-Arte//Reservations//BG",
    "BEGIN:VEVENT",
    `UID:${r.ref}@karearte.bg`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Europe/Sofia:${start}`,
    `DTEND;TZID=Europe/Sofia:${end}`,
    `SUMMARY:KaRe-Arte · ${r.guests} ${r.lang === "bg" ? "гости" : "guests"}`,
    `LOCATION:${site.address[r.lang]}`,
    `DESCRIPTION:${r.ref}${where ? " · " + where : ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export const tableById = (id: string | null): Table | undefined => (id ? tables.find((t) => t.id === id) : undefined);
