"use client";
import { useEffect, useState } from "react";
import { menu, tagLabel, eur, MENU_IS_DEMO, type Daypart } from "@/content/menu";
import { srcSet, media } from "@/lib/media";
import { setTheme } from "@/lib/theme";
import { useTheme } from "./useTheme";
import type { Lang } from "@/lib/i18n";
import { Moon, Sun } from "../Icons";

/** Website menu + QR menu (/menu/?t=5). Day/night follows the site theme; switching one switches both. */
export function MenuView({ lang }: { lang: Lang }) {
  const theme = useTheme();
  const part: Daypart = theme === "day" ? "day" : "night";
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
  }, [part]);

  const sections = menu[part];
  return (
    <div className="menu-view">
      {table && (
        <div className="qr-banner" role="status">
          {lang === "bg" ? `Маса ${table} · Покажи на бара или повикай с ръка — идваме.` : `Table ${table} · Wave at the bar — we'll come over.`}
        </div>
      )}
      <div className="menu-switch" role="tablist" aria-label={lang === "bg" ? "Дневно или вечерно меню" : "Day or night menu"}>
        <button role="tab" type="button" aria-selected={part === "day"} className={part === "day" ? "is-on" : ""} onClick={() => setTheme("day")}>
          <Sun /> {lang === "bg" ? "Дневно" : "Day"}
        </button>
        <button role="tab" type="button" aria-selected={part === "night"} className={part === "night" ? "is-on" : ""} onClick={() => setTheme("night")}>
          <Moon /> {lang === "bg" ? "Вечерно" : "Night"}
        </button>
      </div>
      <nav className="menu-cats" aria-label={lang === "bg" ? "Категории" : "Categories"}>
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
              <li key={it.name.en} className={it.img ? "has-img" : ""}>
                {it.img && (
                  <span className="mi-img" style={{ background: media[it.img].color }}>
                    <img {...srcSet(it.img)} sizes="96px" alt="" loading="lazy" />
                  </span>
                )}
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
