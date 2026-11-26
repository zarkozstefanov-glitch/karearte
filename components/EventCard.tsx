import Link from "next/link";
import { eventTypes, type KAEvent } from "@/content/events";
import { href, ui, type Lang } from "@/lib/i18n";
import { fmtDay, fmtMon, fmtTime, fmtWeekday } from "@/lib/format";
import { eur } from "@/content/menu";
import { Img } from "./Img";

export function EventCard({ e, lang }: { e: KAEvent; lang: Lang }) {
  const low = e.seatsLeft <= Math.max(5, e.seats * 0.2);
  return (
    <Link href={href(lang, `/events/${e.slug}/`)} className="ev-card">
      <div className="ev-media">
        <Img id={e.img} lang={lang} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" />
        <span className="ev-date">
          <b>{fmtDay(e.start, lang)}</b>
          <span>{fmtMon(e.start, lang)}</span>
        </span>
        <span className="ev-type">{eventTypes[e.type][lang]}</span>
      </div>
      <div className="ev-body">
        <p className="ev-when">
          {fmtWeekday(e.start, lang)} · {fmtTime(e.start, lang)}
        </p>
        <h3>{e.title[lang]}</h3>
        <p className="ev-sum">{e.summary[lang]}</p>
        <div className="ev-foot">
          <span className="ev-price">{e.price === null ? ui.free[lang] : `${eur(e.price)} · ${ui.payOnSite[lang]}`}</span>
          {low && <span className="ev-left">{lang === "bg" ? `Остават ${e.seatsLeft} места` : `${e.seatsLeft} seats left`}</span>}
        </div>
      </div>
    </Link>
  );
}
