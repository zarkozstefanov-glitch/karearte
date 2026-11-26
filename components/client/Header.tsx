"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { nav, to, ui, href, type Lang } from "@/lib/i18n";
import { Logo } from "../Logo";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/content/site";
import { Instagram, Phone } from "../Icons";

export function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname() || "/";

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const bare = lang === "en" ? path.replace(/^\/en/, "") || "/" : path;
  const otherLang: Lang = lang === "bg" ? "en" : "bg";
  const isActive = (p: string) => bare.startsWith(p) && p !== "/";

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="container header-row">
        <Link href={to(lang, "home")} className="header-logo" aria-label="KaRe-Arte">
          <Logo />
        </Link>
        <nav className="header-nav" aria-label={lang === "bg" ? "Основна навигация" : "Main navigation"}>
          {nav.map((n) => (
            <Link key={n.key} href={to(lang, n.key)} className={isActive(to("bg", n.key)) ? "is-active" : ""}>
              {n.label[lang]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle lang={lang} />
          <Link href={href(otherLang, bare)} className="lang-switch" hrefLang={otherLang} lang={otherLang} scroll={false}>
            {ui.langSwitch[lang]}
          </Link>
          <Link href={to(lang, "reservations")} className="btn btn-accent btn-sm header-cta">
            {ui.reserve[lang]}
          </Link>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.menuClose[lang] : ui.menuOpen[lang]}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="mm-links">
          {nav.map((n, i) => (
            <Link key={n.key} href={to(lang, n.key)} style={{ "--i": i } as React.CSSProperties}>
              {n.label[lang]}
            </Link>
          ))}
          <Link href={to(lang, "about")} style={{ "--i": nav.length } as React.CSSProperties}>
            {lang === "bg" ? "За нас" : "About"}
          </Link>
          <Link href={to(lang, "faq")} style={{ "--i": nav.length + 1 } as React.CSSProperties}>
            {lang === "bg" ? "Въпроси" : "FAQ"}
          </Link>
        </nav>
        <div className="mm-foot">
          <Link href={to(lang, "reservations")} className="btn btn-accent">
            {ui.reserve[lang]}
          </Link>
          <a href={`tel:${site.phone}`} className="btn btn-line">
            <Phone /> {site.phoneDisplay}
          </a>
          <a href={site.instagram} className="mm-ig" target="_blank" rel="noopener">
            <Instagram /> {site.instagramHandle}
          </a>
        </div>
      </div>
    </header>
  );
}
