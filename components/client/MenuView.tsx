"use client";
import { useEffect, useRef, useState } from "react";
import { menu, tagLabel, eur, MENU_IS_DEMO } from "@/content/menu";
import { srcSet, media } from "@/lib/media";
import type { Lang } from "@/lib/i18n";

/** Everything we serve in one list — coffee to cocktails to boards. Also the QR menu (/menu/?t=5). */
const sections = [...menu.day, ...menu.night];

export function MenuView({ lang }: { lang: Lang }) {
  const cats = useRef<HTMLElement>(null);
  const [table, setTable] = useState<string | null>(null);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("t");
    if (t && /^[\w-]{1,6}$/.test(t)) setTable(t);
  }, []);

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".menu-sec"));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // keep the active category chip in view (phones scroll the chip row sideways)
  useEffect(() => {
    const row = cats.current;
    const chip = row?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!row || !chip) return;
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  return (
    <div className="menu-view">
      {table && (
        <div className="qr-banner" role="status">
          {lang === "bg" ? `Маса ${table} · Покажи на бара или повикай с ръка — идваме.` : `Table ${table} · Wave at the bar — we'll come over.`}
        </div>
      )}
      <nav ref={cats} className="menu-cats" aria-label={lang === "bg" ? "Категории" : "Categories"}>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "is-on" : ""}>
            {s.title[lang]}
          </a>
        ))}
      </nav>
      <div className="menu-sections">
      {sections.map((s, index) => (
        <section key={s.id} id={s.id} className="menu-sec">
          <div className="menu-sec-heading"><span className="menu-index">{String(index + 1).padStart(2, "0")}</span><h2>{s.title[lang]}</h2></div>
          {s.note && <p className="menu-note">{s.note[lang]}</p>}
          <ul className="menu-items">
            {s.items.map((it) => (
              <li key={it.name.en}>
                <div className="mi-text">
                  <div className="mi-line">
                    <h3>{it.name[lang]}</h3>
                    <span className="mi-dots" aria-hidden="true" />
                    <b>{eur(it.price)}</b>
                  </div>
                  {it.desc && <p>{it.desc[lang]}</p>}
                  {(it.tags?.length || it.allergens?.length) && (
                    <div className="mi-tags">
                      {it.tags?.map((t) => (
                        <span key={t} className={`tag tag-${t}`}>
                          {tagLabel[t][lang]}
                        </span>
                      ))}
                      {it.allergens && <span className="tag tag-allergen">{(lang === "bg" ? "Алергени: " : "Allergens: ") + it.allergens.map((a) => a.split(" / ")[lang === "bg" ? 0 : 1]).join(", ")}</span>}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      </div>
      {MENU_IS_DEMO && (
        <p className="demo-note">{lang === "bg" ? "Примерно меню и цени — актуалните идват от системата." : "Sample menu and prices — the live ones come from the system."}</p>
      )}
    </div>
  );
}
