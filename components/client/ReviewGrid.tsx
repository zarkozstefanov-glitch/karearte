"use client";
import { useState } from "react";
import { reviewText, type Review } from "@/content/reviews";
import type { Lang } from "@/lib/i18n";
import { Google, Star } from "../Icons";

const COLORS = ["#E5482B", "#ECB330", "#225F68", "#26408B", "#D23A8C", "#CC5708"];
const fmt = (ym: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "bg" ? "bg-BG" : "en-GB", { month: "long", year: "numeric" }).format(new Date(ym + "-01"));

export function ReviewGrid({ reviews, lang }: { reviews: Review[]; lang: Lang }) {
  const [shown, setShown] = useState(false);
  const [all, setAll] = useState(false);
  const list = all ? reviews : reviews.slice(0, 9);
  return (
    <div className="rv-wrap">
      {!shown ? (
        <button type="button" className="btn btn-line rv-show" onClick={() => setShown(true)}>
          {lang === "bg" ? "Покажи отзивите" : "Show the reviews"}
        </button>
      ) : (
        <>
          <ul className="rv-grid">
            {list.map((r, i) => (
              <li key={r.name + i} className={`rv-card ${r.text.length < 110 ? "is-short" : ""}`} lang={reviewText(r, lang).translated ? lang : r.lang}>
                <div className="rv-head">
                  <span className="rv-avatar" style={{ background: COLORS[i % COLORS.length] }} aria-hidden="true">
                    {r.name[0]}
                  </span>
                  <div>
                    <b>{r.name}</b>
                    <small>{fmt(r.when, lang)}</small>
                  </div>
                  <Google className="rv-g" />
                </div>
                <div className="rv-stars" aria-label={`${r.rating}/5`}>
                  {Array.from({ length: r.rating }, (_, k) => (
                    <Star key={k} />
                  ))}
                </div>
                <p>{reviewText(r, lang).text}</p>
                {reviewText(r, lang).translated && <small className="rv-tr">{lang === "bg" ? "Преведено от английски" : "Translated from Bulgarian"}</small>}
              </li>
            ))}
          </ul>
          {!all && reviews.length > 9 && (
            <button type="button" className="btn btn-line rv-show" onClick={() => setAll(true)}>
              {lang === "bg" ? `Още ${reviews.length - 9} отзива` : `${reviews.length - 9} more reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
