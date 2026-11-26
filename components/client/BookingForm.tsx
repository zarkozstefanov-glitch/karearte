"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { submitRequest, type RequestKind } from "@/lib/api";
import { to, type Lang } from "@/lib/i18n";
import { zones } from "@/content/floorplan";

type Props = { lang: Lang; initial?: RequestKind; eventSlug?: string; eventTitle?: string; maxSeats?: number; lockKind?: boolean };

const T = {
  bg: {
    table: "Маса", private: "Частно събитие / наем", event: "Място за събитие",
    name: "Име", phone: "Телефон", email: "Имейл (по желание)", emailReq: "Имейл",
    date: "Дата", time: "Час", people: "Брой гости", zone: "Предпочитано място", any: "Без значение",
    occasion: "Повод", space: "Пространство", whole: "Цялото място (до 50)", small: "Малкото Каре (до 15)",
    note: "Нещо, което да знаем?", seats: "Брой места",
    consent: "Съгласен/на съм данните ми да се ползват само за тази резервация.", privacy: "Поверителност",
    send: "Изпрати", sending: "Изпращаме…",
    okTitle: "Получихме я!", okText: "Ще ти се обадим или пишем за потвърждение. Номер на заявката:",
    again: "Нова заявка", err: "Нещо се обърка. Опитай пак или ни звънни.",
    hint: "Плащане няма онлайн — всичко е на място.",
    occ: ["Рожден ден", "Тиймбилдинг", "Моминско парти", "Бебешко парти", "Презентация", "Друго"],
  },
  en: {
    table: "Table", private: "Private event / hire", event: "Event seat",
    name: "Name", phone: "Phone", email: "Email (optional)", emailReq: "Email",
    date: "Date", time: "Time", people: "Guests", zone: "Preferred spot", any: "No preference",
    occasion: "Occasion", space: "Space", whole: "The whole place (up to 50)", small: "Little Kare (up to 15)",
    note: "Anything we should know?", seats: "Seats",
    consent: "I agree my details are used only for this booking.", privacy: "Privacy",
    send: "Send", sending: "Sending…",
    okTitle: "Got it!", okText: "We'll call or message you to confirm. Request number:",
    again: "New request", err: "Something went wrong. Try again or give us a call.",
    hint: "No online payment — everything is paid at the venue.",
    occ: ["Birthday", "Team-building", "Bachelorette", "Baby shower", "Presentation", "Other"],
  },
};

export function BookingForm({ lang, initial = "table", eventSlug, eventTitle, maxSeats = 8, lockKind }: Props) {
  const t = T[lang];
  const [kind, setKind] = useState<RequestKind>(initial);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [ref, setRef] = useState("");
  const [table, setTable] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const tb = q.get("table");
    if (tb) setTable(tb);
    if (q.get("type") === "private") setKind("private");
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.reportValidity()) return;
    const data = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
    setState("sending");
    const r = await submitRequest(kind, { ...data, kind, lang, ...(eventSlug ? { event: eventSlug } : {}) });
    if (r.ok) {
      setRef(r.ref);
      setState("ok");
    } else setState("err");
  }

  if (state === "ok")
    return (
      <div className="form-ok" role="status">
        <h3>{t.okTitle}</h3>
        <p>
          {t.okText} <b>{ref}</b>
        </p>
        <button type="button" className="btn btn-line" onClick={() => setState("idle")}>
          {t.again}
        </button>
      </div>
    );

  return (
    <form className="booking" onSubmit={onSubmit} noValidate={false}>
      {!lockKind && (
        <div className="seg" role="radiogroup" aria-label={lang === "bg" ? "Вид заявка" : "Request type"}>
          {(["table", "private"] as const).map((k) => (
            <button key={k} type="button" role="radio" aria-checked={kind === k} className={kind === k ? "is-on" : ""} onClick={() => setKind(k)}>
              {t[k]}
            </button>
          ))}
        </div>
      )}
      {kind === "event" && eventTitle && <p className="booking-event">{eventTitle}</p>}

      <div className="f-grid">
        <label className="f">
          <span>{t.name}</span>
          <input name="name" required autoComplete="name" minLength={2} />
        </label>
        <label className="f">
          <span>{t.phone}</span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern={"[0-9 +\\(\\)\\-]{6,}"} />
        </label>
        <label className="f f-wide">
          <span>{kind === "private" ? t.emailReq : t.email}</span>
          <input name="email" type="email" autoComplete="email" required={kind === "private"} />
        </label>

        {kind !== "event" && (
          <label className="f">
            <span>{t.date}</span>
            <input name="date" type="date" required min={today} />
          </label>
        )}
        {kind === "table" && (
          <label className="f">
            <span>{t.time}</span>
            <input name="time" type="time" required min="11:00" max="23:30" step={900} defaultValue="19:00" />
          </label>
        )}
        {kind === "event" ? (
          <label className="f">
            <span>{t.seats}</span>
            <input name="seats" type="number" min={1} max={maxSeats} defaultValue={2} required />
          </label>
        ) : (
          <label className="f">
            <span>{t.people}</span>
            <input name="people" type="number" min={1} max={kind === "private" ? 50 : 12} defaultValue={kind === "private" ? 20 : 2} required />
          </label>
        )}

        {kind === "table" && (
          <label className="f">
            <span>{t.zone}</span>
            <select name="spot" value={table || ""} onChange={(e) => setTable(e.target.value)}>
              <option value="">{t.any}</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name[lang]}
                </option>
              ))}
              {table && !zones.some((z) => z.id === table) && <option value={table}>{(lang === "bg" ? "Маса " : "Table ") + table}</option>}
            </select>
          </label>
        )}
        {kind === "private" && (
          <>
            <label className="f">
              <span>{t.occasion}</span>
              <select name="occasion">
                {t.occ.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="f">
              <span>{t.space}</span>
              <select name="space">
                <option value="whole">{t.whole}</option>
                <option value="small">{t.small}</option>
              </select>
            </label>
          </>
        )}
        <label className="f f-wide">
          <span>{t.note}</span>
          <textarea name="note" rows={3} maxLength={800} />
        </label>
      </div>

      <label className="f-check">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          {t.consent} <Link href={to(lang, "privacy")}>{t.privacy}</Link>
        </span>
      </label>
      <div className="booking-foot">
        <button className="btn btn-accent" disabled={state === "sending"}>
          {state === "sending" ? t.sending : t.send}
        </button>
        <small>{t.hint}</small>
      </div>
      {state === "err" && (
        <p className="form-err" role="alert">
          {t.err}
        </p>
      )}
    </form>
  );
}
