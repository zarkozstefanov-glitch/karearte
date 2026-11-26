import Link from "next/link";
import { site } from "@/content/site";
import { nav, to, type Lang } from "@/lib/i18n";
import { Logo } from "./Logo";
import { Facebook, Instagram } from "./Icons";
import { OpenStatus } from "./client/OpenStatus";

export function Footer({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <footer className="site-footer">
      <div className="footer-brush" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="f-brand">
          <Logo className="logo-lg" />
          <p className="f-tag">{site.tagline[lang]}</p>
          <div className="f-social">
            <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram />
            </a>
            <a href={site.facebook} target="_blank" rel="noopener" aria-label="Facebook">
              <Facebook />
            </a>
          </div>
        </div>
        <div>
          <h4>{bg ? "Посети ни" : "Visit"}</h4>
          <p>
            <a href={site.googleMaps} target="_blank" rel="noopener">
              {site.address[lang]}
            </a>
          </p>
          <p>
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          </p>
          <OpenStatus lang={lang} />
        </div>
        <div>
          <h4>{bg ? "Работно време" : "Opening hours"}</h4>
          <ul className="f-hours">
            {site.hours.map((h) => (
              <li key={h.time}>
                <span>{h.days[lang]}</span>
                <b>{h.time}</b>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{bg ? "Сайтът" : "Site"}</h4>
          <ul className="f-links">
            {nav.map((n) => (
              <li key={n.key}>
                <Link href={to(lang, n.key)}>{n.label[lang]}</Link>
              </li>
            ))}
            <li>
              <Link href={to(lang, "about")}>{bg ? "За нас" : "About"}</Link>
            </li>
            <li>
              <Link href={to(lang, "faq")}>{bg ? "Въпроси" : "FAQ"}</Link>
            </li>
            <li>
              <Link href={to(lang, "contact")}>{bg ? "Контакти" : "Contact"}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container f-bottom">
        <span>© {new Date().getFullYear()} KaRe-Arte · {bg ? "Бар-галерия, София" : "Bar-gallery, Sofia"}</span>
        <Link href={to(lang, "privacy")}>{bg ? "Поверителност и бисквитки" : "Privacy & cookies"}</Link>
      </div>
    </footer>
  );
}

/** Bottom bar on phones: Book · Call · Directions — slides in when the visitor scrolls up. */
export { MobileBar } from "./client/MobileBar";

export function PageHero({ kicker, title, lead, children }: { kicker: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="kicker" data-reveal="up">
          {kicker}
        </p>
        <h1 data-reveal="up" style={{ "--d": "60ms" } as React.CSSProperties}>
          {title}
        </h1>
        {lead && (
          <p className="lead" data-reveal="up" style={{ "--d": "120ms" } as React.CSSProperties}>
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SecHead({ kicker, title, lead, children, center }: { kicker: string; title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`sec-head ${center ? "is-center" : ""}`} data-reveal="up">
      <div>
        <p className="kicker">{kicker}</p>
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children && <div className="sec-head-aside">{children}</div>}
    </div>
  );
}
