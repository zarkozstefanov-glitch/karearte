"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FloorPlan, type Avail } from "./FloorPlan";
import {
  MAX_ONLINE_GUESTS,
  bookableDays,
  cancelReservation,
  createReservation,
  getAvailability,
  getSlots,
  icsFor,
  myReservations,
  parseISODate,
  tableById,
  toISODate,
  type Reservation,
  type Slot,
} from "@/lib/reservations";
import { zoneOf, zones, type Table } from "@/content/floorplan";
import { site } from "@/content/site";
import { to, type Lang } from "@/lib/i18n";
import { ArrowLeft, Arrow, Calendar, Clock, Pin } from "../Icons";

const T = {
  bg: {
    steps: ["Кога", "Къде", "Данни", "Готово"],
    guests: "Гости",
    guestsN: (n: number) => `${n} ${n === 1 ? "гост" : "гости"}`,
    more: "Повече от 12? Това е частно събитие —",
    moreLink: "пиши ни",
    date: "Ден",
    time: "Час",
    groups: ["Обяд", "Следобед", "Вечер"],
    few: "малко",
    noSlots: "За този ден няма свободни часове онлайн. Звънни — често се намира място:",
    next: "Избери маса",
    back: "Назад",
    where: "Избери маса",
    change: "Промени",
    anywhere: "Без значение — настанете ни, където има място",
    zonePref: "Предпочитана зона:",
    toDetails: "Напред",
    details: "Твоите данни",
    name: "Име и фамилия",
    phone: "Телефон",
    email: "Имейл (за потвърждение)",
    occasion: "Повод",
    occ: ["", "Рожден ден", "Среща", "Годишнина", "Работна среща", "Друго"],
    note: "Нещо, което да знаем?",
    notePh: "алергии, бебешка количка, изненада…",
    consent: "Съгласен/на съм данните ми да се ползват само за тази резервация.",
    marketing: "Искам новини за събития (по желание).",
    privacy: "Поверителност",
    send: "Потвърди резервацията",
    sending: "Изпращаме…",
    summary: "Резервацията",
    doneTitle: "Готово! Пазим ти място.",
    doneText: "Ще получиш потвърждение по телефона или имейла. Номер:",
    ics: "Добави в календара",
    newRes: "Нова резервация",
    mine: "Моите резервации на това устройство",
    cancel: "Откажи",
    cancelled: "отказана",
    pending: "чака потвърждение",
    hold: "Пазим масата 15 минути след часа. Закъсняваш? Звънни.",
    err: "Нещо се обърка. Опитай пак или звънни на",
    anyTable: "където има място",
    loading: "Проверяваме свободните маси…",
    wd: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
  },
  en: {
    steps: ["When", "Where", "Details", "Done"],
    guests: "Guests",
    guestsN: (n: number) => `${n} ${n === 1 ? "guest" : "guests"}`,
    more: "More than 12? That's a private event —",
    moreLink: "write to us",
    date: "Day",
    time: "Time",
    groups: ["Lunch", "Afternoon", "Evening"],
    few: "few",
    noSlots: "No online slots left for this day. Call us — we often find room:",
    next: "Pick a table",
    back: "Back",
    where: "Pick a table",
    change: "Change",
    anywhere: "No preference — seat us wherever there's room",
    zonePref: "Preferred area:",
    toDetails: "Next",
    details: "Your details",
    name: "Full name",
    phone: "Phone",
    email: "Email (for the confirmation)",
    occasion: "Occasion",
    occ: ["", "Birthday", "Date", "Anniversary", "Work meeting", "Other"],
    note: "Anything we should know?",
    notePh: "allergies, a pram, a surprise…",
    consent: "I agree my details are used only for this booking.",
    marketing: "I'd like event news (optional).",
    privacy: "Privacy",
    send: "Confirm booking",
    sending: "Sending…",
    summary: "Your booking",
    doneTitle: "Done! Your seat is saved.",
    doneText: "We'll confirm by phone or email. Reference:",
    ics: "Add to calendar",
    newRes: "New booking",
    mine: "My bookings on this device",
    cancel: "Cancel",
    cancelled: "cancelled",
    pending: "awaiting confirmation",
    hold: "We hold the table for 15 minutes. Running late? Call us.",
    err: "Something went wrong. Try again or call",
    anyTable: "wherever there's room",
    loading: "Checking free tables…",
    wd: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
};

export function ReservationFlow({ lang }: { lang: Lang }) {
  const t = T[lang];
  const loc = lang === "bg" ? "bg-BG" : "en-GB";
  const days = useMemo(() => bookableDays(60), []);
  const daySet = useMemo(() => new Set(days), [days]);
  const [step, setStep] = useState(0);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [month, setMonth] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [status, setStatus] = useState<Record<string, Avail> | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState<Reservation | null>(null);
  const [mine, setMine] = useState<Reservation[]>([]);
  const [wantTable, setWantTable] = useState<string | null>(null);

  useEffect(() => {
    if (!days[0]) return;
    setDate(days[0]);
    const d0 = parseISODate(days[0]);
    setMonth(new Date(d0.getFullYear(), d0.getMonth(), 1));
    setMine(myReservations());
    const tb = new URLSearchParams(window.location.search).get("table");
    if (tb && tableById(tb)) setWantTable(tb);
  }, [days]);

  useEffect(() => {
    if (!date) return;
    setSlots(null);
    getSlots(date, guests).then((s) => {
      setSlots(s);
      setTime((cur) => (s.some((x) => x.time === cur && x.state !== "full") ? cur : s.find((x) => x.state !== "full" && x.time >= "19:00")?.time ?? s.find((x) => x.state !== "full")?.time ?? ""));
    });
  }, [date, guests]);

  useEffect(() => {
    if (step !== 1 || !date || !time) return;
    setStatus(null);
    getAvailability(date, time, guests).then((st) => {
      setStatus(st);
      if (wantTable && st[wantTable]?.s === "free") setTableId(wantTable);
      else if (tableId && st[tableId]?.s !== "free") setTableId(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, date, time, guests]);

  const table = tableById(tableId);
  const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(loc, o).format(parseISODate(d));
  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      const el = document.getElementById("res-top");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
    });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.reportValidity()) return;
    const d = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
    setSending(true);
    setError(false);
    const r = await createReservation({
      date,
      time,
      guests,
      tableId,
      zone: table ? table.zone : zone,
      name: d.name.trim(),
      phone: d.phone.trim(),
      email: d.email?.trim() || undefined,
      occasion: d.occasion || undefined,
      note: d.note?.trim() || undefined,
      marketing: d.marketing === "yes",
      lang,
    });
    setSending(false);
    if (r.ok) {
      setDone(r.reservation);
      setMine(myReservations());
      go(3);
    } else setError(true);
  }

  const downloadIcs = (r: Reservation) => {
    const url = URL.createObjectURL(new Blob([icsFor(r)], { type: "text/calendar" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `karearte-${r.ref}.ics` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const where = table ? `${zoneOf(table.zone).short[lang]} · ${table.name[lang]}` : zone ? zoneOf(zone as never).short[lang] : t.anyTable;
  const SummaryLine = ({ edit }: { edit?: boolean }) => (
    <div className="res-line">
      <span>
        <Calendar /> {date ? fmt(date, { weekday: "short", day: "numeric", month: "long" }) : "—"}
      </span>
      <span>
        <Clock /> {time || "—"}
      </span>
      <span>
        <b>{guests}</b> {lang === "bg" ? (guests === 1 ? "гост" : "гости") : guests === 1 ? "guest" : "guests"}
      </span>
      {step > 0 && (
        <span>
          <Pin /> {where}
        </span>
      )}
      {edit && (
        <button type="button" className="res-edit" onClick={() => go(0)}>
          {t.change}
        </button>
      )}
    </div>
  );

  /* ---------- calendar ---------- */
  const cal = useMemo(() => {
    if (!month) return [];
    const first = new Date(month);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const daysIn = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: daysIn }, (_, i) => toISODate(new Date(month.getFullYear(), month.getMonth(), i + 1)))];
  }, [month]);
  const canPrev = month && days[0] && month > new Date(parseISODate(days[0]).getFullYear(), parseISODate(days[0]).getMonth(), 1);
  const lastDay = days[days.length - 1];
  const canNext = month && lastDay && new Date(month.getFullYear(), month.getMonth() + 1, 1) <= parseISODate(lastDay);

  const groups = useMemo(() => {
    if (!slots) return [];
    const g: Slot[][] = [[], [], []];
    slots.forEach((s) => g[s.time < "14:00" ? 0 : s.time < "18:00" ? 1 : 2].push(s));
    return g;
  }, [slots]);

  return (
    <div className="res-flow" id="res-top">
      <ol className="res-steps" aria-label={lang === "bg" ? "Стъпки" : "Steps"}>
        {t.steps.map((s, i) => (
          <li key={s} className={i === step ? "is-cur" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>
            <span>{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="res-card res-when">
          <div className="rw-col rw-guests">
            <h3>{t.guests}</h3>
            <div className="stepper">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="−">
                −
              </button>
              <output aria-live="polite">
                <b>{guests}</b>
                <small>{lang === "bg" ? (guests === 1 ? "гост" : "гости") : guests === 1 ? "guest" : "guests"}</small>
              </output>
              <button type="button" onClick={() => setGuests((g) => Math.min(MAX_ONLINE_GUESTS, g + 1))} disabled={guests >= MAX_ONLINE_GUESTS} aria-label="+">
                +
              </button>
            </div>
            <div className="g-quick">
              {[2, 4, 6, 8].map((n) => (
                <button key={n} type="button" className={guests === n ? "is-on" : ""} onClick={() => setGuests(n)}>
                  {n}
                </button>
              ))}
            </div>
            <p className="res-hint">
              {t.more}{" "}
              <a
                href="?type=private"
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("ka-res-tab", { detail: "private" }));
                }}
              >
                {t.moreLink}
              </a>
              .
            </p>
          </div>

          <div className="rw-col rw-cal">
            <div className="cal-head">
              <h3>{month ? new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" }).format(month) : t.date}</h3>
              <div>
                <button type="button" disabled={!canPrev} onClick={() => month && setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="prev">
                  <ArrowLeft />
                </button>
                <button type="button" disabled={!canNext} onClick={() => month && setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="next">
                  <Arrow />
                </button>
              </div>
            </div>
            <div className="cal" role="grid">
              {t.wd.map((w) => (
                <span key={w} className="cal-wd">
                  {w}
                </span>
              ))}
              {cal.map((d, i) =>
                d ? (
                  <button key={d} type="button" disabled={!daySet.has(d)} className={`cal-d ${d === date ? "is-on" : ""} ${d === days[0] ? "is-today" : ""}`} onClick={() => setDate(d)} aria-pressed={d === date}>
                    {parseISODate(d).getDate()}
                  </button>
                ) : (
                  <span key={`e${i}`} />
                ),
              )}
            </div>
          </div>

          <div className="rw-col rw-time">
            <h3>{date ? fmt(date, { weekday: "long", day: "numeric", month: "long" }) : t.time}</h3>
            {!slots ? (
              <div className="slots is-loading" aria-busy="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className="slot sk" />
                ))}
              </div>
            ) : slots.every((s) => s.state === "full") ? (
              <p className="res-hint">
                {t.noSlots} <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              </p>
            ) : (
              <div className="slot-groups">
                {groups.map((g, gi) =>
                  g.length ? (
                    <div key={gi}>
                      <small className="sg-label">{t.groups[gi]}</small>
                      <div className="slots">
                        {g.map((s) => (
                          <button key={s.time} type="button" disabled={s.state === "full"} className={`slot st-${s.state} ${time === s.time ? "is-on" : ""}`} onClick={() => setTime(s.time)} aria-pressed={time === s.time}>
                            {s.time}
                            {s.state === "few" && <i title={t.few} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </div>

          <div className="res-bar">
            <SummaryLine />
            <button type="button" className="btn btn-accent btn-lg" disabled={!date || !time} onClick={() => go(1)}>
              {t.next} <Arrow />
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="res-card res-where">
          <div className="res-bar res-bar-top">
            <SummaryLine edit />
            {status && (
              <span className="res-free">
                <i />
                {lang === "bg" ? `${Object.values(status).filter((a) => a.s === "free").length} свободни маси в ${time}` : `${Object.values(status).filter((a) => a.s === "free").length} free tables at ${time}`}
              </span>
            )}
          </div>
          {!status ? (
            <p className="res-loading">{t.loading}</p>
          ) : (
            <FloorPlan
              lang={lang}
              mode="pick"
              status={status}
              picked={tableId}
              guests={guests}
              time={time}
              onPick={(tb: Table | null) => setTableId(tb ? tb.id : null)}
              onTime={(x) => {
                setWantTable(null);
                setTime(x);
              }}
            />
          )}
          <div className="res-bar">
            <div className="res-any">
              {!tableId ? (
                <>
                  <span className="res-hint">{t.zonePref}</span>
                  {zones.map((z) => (
                    <button key={z.id} type="button" className={`chip ${zone === z.id ? "is-on" : ""}`} aria-pressed={zone === z.id} onClick={() => setZone(zone === z.id ? null : z.id)}>
                      {z.short[lang]}
                    </button>
                  ))}
                </>
              ) : (
                <button type="button" className="chip" onClick={() => setTableId(null)}>
                  {t.anywhere}
                </button>
              )}
            </div>
            <div className="res-nav-inline">
              <button type="button" className="btn btn-line" onClick={() => go(0)}>
                <ArrowLeft /> {t.back}
              </button>
              <button type="button" className="btn btn-accent btn-lg" onClick={() => go(2)}>
                {t.toDetails} <Arrow />
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="res-card res-details">
          <form onSubmit={submit} className="booking">
            <h3>{t.details}</h3>
            <div className="f-grid">
              <label className="f f-wide">
                <span>{t.name}</span>
                <input name="name" required autoComplete="name" minLength={2} maxLength={80} />
              </label>
              <label className="f">
                <span>{t.phone}</span>
                <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern={"[0-9 +\\(\\)\\-]{6,}"} />
              </label>
              <label className="f">
                <span>{t.email}</span>
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label className="f">
                <span>{t.occasion}</span>
                <select name="occasion">
                  {t.occ.map((o) => (
                    <option key={o} value={o}>
                      {o || "—"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="f">
                <span>{t.note}</span>
                <input name="note" maxLength={500} placeholder={t.notePh} />
              </label>
            </div>
            <label className="f-check">
              <input type="checkbox" name="consent" value="yes" required />
              <span>
                {t.consent} <Link href={to(lang, "privacy")}>{t.privacy}</Link>
              </span>
            </label>
            <label className="f-check">
              <input type="checkbox" name="marketing" value="yes" />
              <span>{t.marketing}</span>
            </label>
            {error && (
              <p className="form-err" role="alert">
                {t.err} <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              </p>
            )}
            <div className="res-nav-inline">
              <button type="button" className="btn btn-line" onClick={() => go(1)}>
                <ArrowLeft /> {t.back}
              </button>
              <button className="btn btn-accent btn-lg" disabled={sending}>
                {sending ? t.sending : t.send}
              </button>
            </div>
          </form>
          <aside className="res-side">
            {table && <img className="res-side-ph" src={`/img/${table.photos[0]}-960.webp`} alt="" />}
            <div className="res-summary">
              <p className="kicker">{t.summary}</p>
              <SummaryLine edit />
            </div>
            <p className="res-hint">{t.hold}</p>
          </aside>
        </section>
      )}

      {step === 3 && done && (
        <section className="res-card res-done" role="status">
          <div className="done-mark" aria-hidden="true">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l7 7 15-16" />
            </svg>
          </div>
          <h3>{t.doneTitle}</h3>
          <p>
            {t.doneText} <b className="ref">{done.ref}</b>
          </p>
          <div className="res-summary">
            <SummaryLine />
          </div>
          <p className="res-hint">{t.hold}</p>
          <div className="res-nav-inline is-center">
            <button type="button" className="btn btn-line" onClick={() => downloadIcs(done)}>
              <Calendar /> {t.ics}
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => {
                setDone(null);
                setTableId(null);
                go(0);
              }}
            >
              {t.newRes}
            </button>
          </div>
        </section>
      )}

      {mine.filter((r) => r.date >= (days[0] ?? "")).length > 0 && (
        <section className="my-res">
          <h4>{t.mine}</h4>
          <ul>
            {mine
              .filter((r) => r.date >= (days[0] ?? ""))
              .map((r) => {
                const tb = tableById(r.tableId);
                return (
                  <li key={r.ref} className={r.status === "cancelled" ? "is-cancelled" : ""}>
                    <div>
                      <b>
                        {fmt(r.date, { weekday: "short", day: "numeric", month: "long" })} · {r.time}
                      </b>
                      <span>
                        {t.guestsN(r.guests)} · {tb ? tb.name[lang] : t.anyTable} · {r.ref} · {r.status === "cancelled" ? t.cancelled : t.pending}
                      </span>
                    </div>
                    {r.status !== "cancelled" && (
                      <button type="button" className="btn btn-line btn-sm" onClick={async () => setMine(await cancelReservation(r.ref))}>
                        {t.cancel}
                      </button>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </div>
  );
}
