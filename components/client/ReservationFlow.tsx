"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Avail } from "./FloorPlan";
import { CafeMap } from "./CafeMap";
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
    steps: ["Колко души?", "Кой ден?", "Колко часа?", "Коя маса?", "Твоите данни", "Готово"],
    chips: ["гости", "ден", "час", "маса"],
    today: "Днес",
    tomorrow: "Утре",
    any: "Без значение",
    later: "Повече дни",
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
    steps: ["How many?", "Which day?", "What time?", "Which table?", "Your details", "Done"],
    chips: ["guests", "day", "time", "table"],
    today: "Today",
    tomorrow: "Tomorrow",
    any: "No preference",
    later: "More days",
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
  const [focus, setFocus] = useState<Table | null>(null);

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
    if (step !== 3 || !date || !time) return;
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
      if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90), behavior: "smooth" });
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
      go(5);
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
      <span>
        <Pin /> {where}
      </span>
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

  const guestsWord = (n: number) => (lang === "bg" ? (n === 1 ? "гост" : "гости") : n === 1 ? "guest" : "guests");
  const pickedLabel = table ? table.name[lang].split(" · ")[0] : t.any;
  const chipVals = [`${guests} ${guestsWord(guests)}`, date ? fmt(date, { weekday: "short", day: "numeric", month: "short" }) : "—", time || "—", pickedLabel];
  const quickDays = days.slice(0, 2);

  return (
    <div className="res-flow res-wiz" id="res-top" data-step={step}>
      {step < 5 && (
        <nav className="wz-bar" aria-label={lang === "bg" ? "Твоят избор" : "Your choices"}>
          {chipVals.map((v, i) => (
            <button key={i} type="button" className={`wz-chip ${i === step ? "is-cur" : ""} ${i < step ? "is-done" : ""}`} disabled={i > step} onClick={() => go(i)}>
              <small>{t.chips[i]}</small>
              <b>{i <= step || i < 3 ? v : "—"}</b>
            </button>
          ))}
          <span className="wz-progress" style={{ "--p": `${(step / 4) * 100}%` } as React.CSSProperties} />
        </nav>
      )}

      {step < 5 && (
        <div className="wz-head">
          {step > 0 && (
            <button type="button" className="wz-back" onClick={() => go(step - 1)} aria-label={t.back}>
              <ArrowLeft />
            </button>
          )}
          <h2>{t.steps[step]}</h2>
          <span className="wz-count">
            {step + 1}/5
          </span>
        </div>
      )}

      {step === 0 && (
        <section className="wz-step wz-guests">
          <div className="wz-grid12">
            {Array.from({ length: MAX_ONLINE_GUESTS }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={guests === n ? "is-on" : ""} onClick={() => { setGuests(n); go(1); }}>
                {n}
              </button>
            ))}
          </div>
          <p className="res-hint">
            {t.more}{" "}
            <a href="?type=private" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("ka-res-tab", { detail: "private" })); }}>
              {t.moreLink}
            </a>
            .
          </p>
        </section>
      )}

      {step === 1 && (
        <section className="wz-step wz-day">
          <div className="wz-quick">
            {quickDays.map((d, i) => (
              <button key={d} type="button" className={d === date ? "is-on" : ""} onClick={() => { setDate(d); go(2); }}>
                <b>{i === 0 ? t.today : t.tomorrow}</b>
                <small>{fmt(d, { weekday: "short", day: "numeric", month: "short" })}</small>
              </button>
            ))}
          </div>
          <div className="wz-cal">
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
                <span key={w} className="cal-wd">{w}</span>
              ))}
              {cal.map((d, i) =>
                d ? (
                  <button key={d} type="button" disabled={!daySet.has(d)} className={`cal-d ${d === date ? "is-on" : ""} ${d === days[0] ? "is-today" : ""}`} onClick={() => { setDate(d); go(2); }} aria-pressed={d === date}>
                    {parseISODate(d).getDate()}
                  </button>
                ) : (
                  <span key={`e${i}`} />
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="wz-step wz-time">
          {!slots ? (
            <div className="slots is-loading" aria-busy="true">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="slot sk" />
              ))}
            </div>
          ) : slots.every((x) => x.state === "full") ? (
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
                      {g.map((x) => (
                        <button key={x.time} type="button" disabled={x.state === "full"} className={`slot st-${x.state} ${time === x.time ? "is-on" : ""}`} onClick={() => { setTime(x.time); go(3); }} aria-pressed={time === x.time}>
                          {x.time}
                          {x.state === "few" && <i title={t.few} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="wz-step wz-table">
          {!status ? (
            <p className="res-loading">{t.loading}</p>
          ) : (
            <>
              <CafeMap
                lang={lang}
                status={status}
                picked={tableId}
                onSelect={(tb: Table) => {
                  setFocus(tb);
                  if (status[tb.id]?.s === "free") {
                    setTableId(tb.id);
                    window.setTimeout(() => go(4), 450);
                  }
                }}
              />
              {focus && status[focus.id]?.s !== "free" ? (
                <div className="fp-mini">
                  <div>
                    <b>{focus.name[lang].split(" · ")[0]}</b>
                    <span>
                      {focus.seats} {lang === "bg" ? "места" : "seats"} ·{" "}
                      <i className={`fp-mini-s s-${status[focus.id]?.s ?? "walkin"}`}>
                        {status[focus.id]?.s === "taken"
                          ? (lang === "bg" ? `заета до ${status[focus.id]?.until}` : `taken until ${status[focus.id]?.until}`)
                          : status[focus.id]?.s === "small"
                            ? (lang === "bg" ? `до ${focus.seats} души` : `up to ${focus.seats}`)
                            : lang === "bg" ? "без резервация" : "walk-in only"}
                      </i>
                    </span>
                  </div>
                  {status[focus.id]?.s === "taken" && status[focus.id]?.until && status[focus.id]?.until !== "00:00" && (
                    <button type="button" className="btn btn-sm btn-line" onClick={() => { setWantTable(focus.id); setTime(status[focus.id]!.until!); }}>
                      {lang === "bg" ? `Смени на ${status[focus.id]?.until}` : `Switch to ${status[focus.id]?.until}`}
                    </button>
                  )}
                </div>
              ) : (
                <p className="fp-mini-hint">{lang === "bg" ? "Натисни зелена маса — или „Без значение“" : "Tap a green table — or “No preference”"}</p>
              )}
            </>
          )}
          <div className="wz-actions">
            <button type="button" className="btn btn-line" onClick={() => { setTableId(null); go(4); }}>
              {t.any}
            </button>
            {tableId && (
              <button type="button" className="btn btn-accent" onClick={() => go(4)}>
                {t.toDetails} <Arrow />
              </button>
            )}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="wz-step wz-details">
          <form onSubmit={submit} className="booking">
            <div className="f-grid">
              <label className="f f-wide">
                <span>{t.name}</span>
                <input name="name" required autoComplete="name" minLength={2} maxLength={80} placeholder={t.name} />
              </label>
              <label className="f">
                <span>{t.phone}</span>
                <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern={"[0-9 +\\(\\)\\-]{6,}"} placeholder={t.phone} />
              </label>
              <label className="f">
                <span>{t.email}</span>
                <input name="email" type="email" autoComplete="email" placeholder={t.email} />
              </label>
              <label className="f f-wide">
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
            {error && (
              <p className="form-err" role="alert">
                {t.err} <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
              </p>
            )}
            <button className="btn btn-accent btn-lg wz-send" disabled={sending}>
              {sending ? t.sending : t.send}
            </button>
            <p className="res-hint">{t.hold}</p>
          </form>
        </section>
      )}

      {step === 5 && done && (
        <section className="wz-step res-done" role="status">
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
            <button type="button" className="btn btn-accent" onClick={() => { setDone(null); setTableId(null); go(0); }}>
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
