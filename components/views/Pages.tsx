import Link from "next/link";
import { site } from "@/content/site";
import { events, pastEvents, upcoming, eventTypes, EVENTS_ARE_DEMO, type KAEvent } from "@/content/events";
import { posts, type Post } from "@/content/posts";
import { faq, findSteps, about } from "@/content/pages";
import { eur } from "@/content/menu";
import { href, to, ui, type Lang } from "@/lib/i18n";
import { pageMeta, suffix, T } from "@/lib/meta";
import { fmtDate, fmtMonthYear, fmtTime, fmtWeekday } from "@/lib/format";
import { Img } from "../Img";
import { Arrow, ArrowLeft, Calendar, Clock, Instagram, Facebook, Phone, Pin } from "../Icons";
import { PageHero, SecHead } from "../Chrome";
import { MenuView } from "../client/MenuView";
import { EventsList } from "../client/EventsList";
import { Gallery } from "../client/Gallery";
import { FloorPlan } from "../client/FloorPlan";
import { BookingForm } from "../client/BookingForm";
import { ResTabs } from "../client/ResTabs";
import { MapEmbed } from "../client/MapEmbed";
import { OpenStatus } from "../client/OpenStatus";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/* ---------------- MENU ---------------- */
export const menuMeta = (l: Lang) =>
  pageMeta(l, "/menu/", T(l, "Меню", "Menu") + suffix(l), T(l, "Кафе, лимонади, горещ шоколад в ядлива чашка, авторски коктейли, вино и плата — цялото меню на едно място.", "Coffee, lemonades, hot chocolate in an edible cup, signature cocktails, wine and boards — the whole menu in one place."));
export function MenuPage({ lang }: { lang: Lang }) {
  return (
    <section className="sec menu-page">
      <div className="container">
        <MenuView lang={lang} />
      </div>
    </section>
  );
}

/* ---------------- EVENTS ---------------- */
export const eventsMeta = (l: Lang) =>
  pageMeta(l, "/events/", T(l, "Събития", "Events") + suffix(l), T(l, "Куиз вечери, рисуване с вино, караоке, джаз и литературни вечери. Резервираш онлайн, плащаш на място.", "Quiz nights, paint & wine, karaoke, jazz and literary evenings. Book online, pay at the venue."));
export function EventsPage({ lang }: { lang: Lang }) {
  const list = upcoming();
  return (
    <>
      <section className="sec sec-tight">
        <div className="container">
          <EventsList lang={lang} events={list} />
          {EVENTS_ARE_DEMO && <p className="demo-note">{T(lang, "Датите и цените са примерни — истинските Калина ги въвежда от системата.", "Dates and prices are samples — Kalina enters the real ones in the system.")}</p>}
        </div>
      </section>
      <section className="sec">
        <div className="container">
          <SecHead kicker={T(lang, "Архив", "Archive")} title={T(lang, "Било е.", "It happened.")} />
          <ul className="past-grid">
            {pastEvents.map((p, i) => (
              <li key={p.title.en} data-reveal="up" style={d(i * 80)}>
                <Img id={p.img} lang={lang} sizes="(min-width: 900px) 33vw, 100vw" />
                <div>
                  <small>{fmtMonthYear(p.date, lang)}</small>
                  <h3>{p.title[lang]}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sec cta-band">
        <div className="container cta-inner" data-reveal="up">
          <h2>{T(lang, "Искаш свое събитие при нас?", "Want your own event here?")}</h2>
          <Link className="btn btn-accent btn-lg" href={`${to(lang, "reservations")}?type=private`}>
            {T(lang, "Изпрати запитване", "Send an inquiry")}
          </Link>
        </div>
      </section>
    </>
  );
}

export const eventMeta = (l: Lang, e: KAEvent) => pageMeta(l, `/events/${e.slug}/`, `${e.title[l]} · ${fmtDate(e.start, l)}` + suffix(l), e.summary[l]);
export function EventPage({ lang, e }: { lang: Lang; e: KAEvent }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title[lang],
    startDate: e.start,
    endDate: new Date(new Date(e.start).getTime() + e.durationMin * 60000).toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: "KaRe-Arte", address: site.address[lang] },
    image: [`${site.url}/img/${e.img}-960.webp`],
    description: e.summary[lang],
    offers: { "@type": "Offer", price: e.price ?? 0, priceCurrency: "EUR", availability: e.seatsLeft > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut", url: `${site.url}${href(lang, `/events/${e.slug}/`)}` },
    organizer: { "@type": "Organization", name: "KaRe-Arte", url: site.url },
  };
  const others = upcoming().filter((x) => x.slug !== e.slug).slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="ev-hero">
        <Img id={e.img} lang={lang} priority sizes="100vw" className="ev-hero-img" />
        <div className="container ev-hero-copy">
          <Link href={to(lang, "events")} className="back">
            <ArrowLeft /> {T(lang, "Всички събития", "All events")}
          </Link>
          <p className="kicker">{eventTypes[e.type][lang]}</p>
          <h1>{e.title[lang]}</h1>
          <ul className="ev-facts">
            <li>
              <Calendar /> {fmtWeekday(e.start, lang)}, {fmtDate(e.start, lang)}
            </li>
            <li>
              <Clock /> {fmtTime(e.start, lang)} · {Math.round(e.durationMin / 60 * 10) / 10} {T(lang, "ч", "h")}
            </li>
            <li>{e.price === null ? ui.free[lang] : `${eur(e.price)} · ${ui.payOnSite[lang]}`}</li>
          </ul>
        </div>
      </section>
      <section className="sec sec-tight">
        <div className="container ev-detail">
          <div className="prose">
            <p className="lead">{e.summary[lang]}</p>
            <p>{e.body[lang]}</p>
            {e.includes && <p className="note-box">{e.includes[lang]}</p>}
            <p className="seats-bar" style={{ "--fill": `${Math.round((1 - e.seatsLeft / e.seats) * 100)}%` } as React.CSSProperties}>
              <span />
              <b>{T(lang, `Свободни ${e.seatsLeft} от ${e.seats} места`, `${e.seatsLeft} of ${e.seats} seats left`)}</b>
            </p>
          </div>
          <div className="ev-book card">
            <h2>{T(lang, "Запази място", "Save a seat")}</h2>
            <BookingForm lang={lang} initial="event" lockKind eventSlug={e.slug} eventTitle={`${e.title[lang]} · ${fmtDate(e.start, lang)}`} maxSeats={Math.min(10, e.seatsLeft)} />
          </div>
        </div>
      </section>
      {others.length > 0 && (
        <section className="sec">
          <div className="container">
            <SecHead kicker={T(lang, "Още", "More")} title={T(lang, "Може и това.", "Maybe this too.")} />
            <ul className="ev-grid">
              {others.map((x) => (
                <li key={x.slug}>
                  <EventCardLite e={x} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
function EventCardLite({ e, lang }: { e: KAEvent; lang: Lang }) {
  return (
    <Link href={href(lang, `/events/${e.slug}/`)} className="ev-mini">
      <Img id={e.img} lang={lang} sizes="120px" />
      <div>
        <small>
          {fmtDate(e.start, lang)} · {fmtTime(e.start, lang)}
        </small>
        <b>{e.title[lang]}</b>
      </div>
    </Link>
  );
}

/* ---------------- GALLERY ---------------- */
export const galleryMeta = (l: Lang) => pageMeta(l, "/gallery/", T(l, "Галерия", "Gallery") + suffix(l), T(l, "Снимки и видео от арт кафе-бара: интериор, градина, коктейли и събития.", "Photos and video from the art café-bar: interior, garden, cocktails and events."));
export function GalleryPage({ lang }: { lang: Lang }) {
  const videos = [
    { src: "/video/reel-night", title: T(lang, "Една вечер в Каре Арте", "A night in Kare Arte"), mood: "night" },
    { src: "/video/reel-cupffee", title: T(lang, "Горещ шоколад в ядлива чашка", "Hot chocolate in an edible cup"), mood: "day" },
    { src: "/video/reel-blind-cocktails", title: T(lang, "Коктейл на сляпо", "Blind cocktail"), mood: "night" },
    { src: "/video/reel-summer", title: T(lang, "Сприц в градината", "Spritz in the garden"), mood: "day" },
    { src: "/video/reel-sour", title: T(lang, "Сауърът извън менюто", "The off-menu sour"), mood: "night" },
    { src: "/video/reel-favourite-guest", title: T(lang, "Любимият ни гост", "Our favourite guest"), mood: "night" },
  ];
  return (
    <>
      <section className="sec sec-tight">
        <div className="container">
          <Gallery lang={lang} videos={videos} />
        </div>
      </section>
    </>
  );
}

/* ---------------- VLOG ---------------- */
export const vlogMeta = (l: Lang) => pageMeta(l, "/vlog/", T(l, "Влог", "Vlog") + suffix(l), T(l, "Истории, рецепти и вечери от КаРе-АртЕ.", "Stories, recipes and evenings from KaRe-Arte."));
export function VlogPage({ lang }: { lang: Lang }) {
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const [first, ...rest] = list;
  return (
    <>
      <section className="sec sec-tight">
        <div className="container">
          <Link href={href(lang, `/vlog/${first.slug}/`)} className="post-feature" data-reveal="up">
            <Img id={first.cover} lang={lang} sizes="(min-width: 900px) 40vw, 100vw" />
            <div>
              <small>{fmtDate(first.date, lang)}</small>
              <h2>{first.title[lang]}</h2>
              <p>{first.excerpt[lang]}</p>
              <span className="link-arrow">
                {ui.readMore[lang]} <Arrow />
              </span>
            </div>
          </Link>
          <ul className="post-grid">
            {rest.map((p, i) => (
              <li key={p.slug} data-reveal="up" style={d(i * 70)}>
                <PostCard p={p} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
function PostCard({ p, lang }: { p: Post; lang: Lang }) {
  return (
    <Link href={href(lang, `/vlog/${p.slug}/`)} className="post-card">
      <div className="pc-img">
        <Img id={p.cover} lang={lang} sizes="(min-width: 900px) 25vw, 50vw" />
        {p.video && <span className="pc-video">{T(lang, "Видео", "Video")}</span>}
      </div>
      <small>{fmtDate(p.date, lang)}</small>
      <h3>{p.title[lang]}</h3>
      <p>{p.excerpt[lang]}</p>
    </Link>
  );
}
export const postMeta = (l: Lang, p: Post) => pageMeta(l, `/vlog/${p.slug}/`, p.title[l] + suffix(l), p.excerpt[l]);
export function PostPage({ lang, p }: { lang: Lang; p: Post }) {
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <article className="post">
        <div className="container post-grid-2">
          <div className="post-media" data-reveal="left">
            {p.video ? (
              <video controls playsInline preload="metadata" poster={`${p.video}.webp`} src={`${p.video}.mp4`} />
            ) : (
              <Img id={p.cover} lang={lang} priority sizes="(min-width: 900px) 40vw, 100vw" />
            )}
          </div>
          <div className="post-copy">
            <Link href={to(lang, "vlog")} className="back">
              <ArrowLeft /> {T(lang, "Влог", "Vlog")}
            </Link>
            <small>{fmtDate(p.date, lang)}</small>
            <h1>{p.title[lang]}</h1>
            <p className="lead">{p.excerpt[lang]}</p>
            {p.body.map((b, i) => (
              <p key={i}>{b[lang]}</p>
            ))}
            <a className="btn btn-line" href={site.instagram} target="_blank" rel="noopener">
              <Instagram /> {T(lang, "Още в Instagram", "More on Instagram")}
            </a>
          </div>
        </div>
      </article>
      <section className="sec">
        <div className="container">
          <SecHead kicker={T(lang, "Още от влога", "More from the vlog")} title={T(lang, "Продължи да гледаш.", "Keep watching.")} />
          <ul className="post-grid">
            {more.map((x) => (
              <li key={x.slug}>
                <PostCard p={x} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ---------------- SPACE ---------------- */
export const spaceMeta = (l: Lang) => pageMeta(l, "/space/", T(l, "Пространството", "The space") + suffix(l), T(l, "Разгледай стаите на КаРе-АртЕ — бар, лаундж, горно ниво с Ван Гог, градина и Малкото Каре — и избери маса.", "Explore the rooms of KaRe-Arte — bar, lounge, the Van Gogh upper level, garden and Little Kare — and pick a table."));
export function SpacePage({ lang }: { lang: Lang }) {
  return (
    <section className="sec space-page">
      <div className="container">
        <h1 className="sr-only">{T(lang, "Пространството", "The space")}</h1>
        <FloorPlan lang={lang} />
      </div>
    </section>
  );
}

/* ---------------- RESERVATIONS ---------------- */
export const reservationsMeta = (l: Lang) => pageMeta(l, "/reservations/", T(l, "Резервации", "Reservations") + suffix(l), T(l, "Резервирай маса или изпрати запитване за частно събитие и наем на цялото място (до 50 гости).", "Book a table or send an inquiry for a private event or hiring the whole place (up to 50 guests)."));
export function ReservationsPage({ lang }: { lang: Lang }) {
  return (
    <section className="sec res-page">
      <div className="container">
        <h1 className="sr-only">{T(lang, "Резервация", "Reservation")}</h1>
        <ResTabs lang={lang} />
      </div>
    </section>
  );
}

/* ---------------- FIND US ---------------- */
export const findMeta = (l: Lang) => pageMeta(l, "/find-us/", T(l, "Как да ни намериш", "How to find us") + suffix(l), T(l, "Скрити сме в офис сграда на ул. „Петър Парчевич“ 36. Ето пътя със снимки — три стъпки.", "We're hidden in an office building at 36 Petar Parchevich St. Here's the way in three photo steps."));
export function FindUsPage({ lang }: { lang: Lang }) {
  return (
    <>
      <section className="sec sec-tight">
        <div className="container">
          <ol className="steps">
            {findSteps.map((s, i) => (
              <li key={s.img} data-reveal="up" style={d(i * 100)}>
                <Img id={s.img} lang={lang} sizes="(min-width: 900px) 33vw, 100vw" />
                <h3>{s.title[lang]}</h3>
                <p>{s.text[lang]}</p>
              </li>
            ))}
          </ol>
          <p className="demo-note">{T(lang, "Тук ще сложим истински снимки (и кратко видео) на входа, вратата и коридора.", "Real photos (and a short video) of the entrance, the door and the corridor go here.")}</p>
        </div>
      </section>
      <section className="sec">
        <div className="container visit-grid">
          <div>
            <h2>{T(lang, "Близо до всичко", "Close to everything")}</h2>
            <ul className="ticks">
              <li>{T(lang, "2 минути от бул. „Витоша“", "2 minutes from Vitosha Blvd")}</li>
              <li>{T(lang, "5 минути от НДК", "5 minutes from NDK")}</li>
              <li>{T(lang, "Метро: НДК (M2)", "Metro: NDK (M2)")}</li>
            </ul>
            <div className="visit-actions">
              <a className="btn btn-accent" href={site.googleMaps} target="_blank" rel="noopener">
                <Pin /> {T(lang, "Отвори в Google Maps", "Open in Google Maps")}
              </a>
              <a className="btn btn-line" href={`tel:${site.phone}`}>
                <Phone /> {site.phoneDisplay}
              </a>
            </div>
          </div>
          <MapEmbed lang={lang} />
        </div>
      </section>
    </>
  );
}

/* ---------------- ABOUT ---------------- */
export const aboutMeta = (l: Lang) => pageMeta(l, "/about/", T(l, "За нас", "About") + suffix(l), about.lead[l]);
export function AboutPage({ lang }: { lang: Lang }) {
  return (
    <>
      <PageHero kicker={T(lang, "За нас", "About")} title={site.tagline[lang]} lead={about.lead[lang]} />
      <section className="sec sec-tight">
        <div className="container about-page">
          <div className="prose">
            {about.paragraphs.map((p, i) => (
              <p key={i} data-reveal="up">
                {p[lang]}
              </p>
            ))}
            <ul className="facts">
              {about.facts.map((f) => (
                <li key={f.n}>
                  <b>{f.n}</b>
                  <span>{f.l[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="about-stack">
            <Img id="interior-wide" lang={lang} sizes="(min-width: 900px) 40vw, 100vw" />
            <Img id="bartenders" lang={lang} sizes="(min-width: 900px) 20vw, 50vw" />
            <Img id="art-armchairs" lang={lang} sizes="(min-width: 900px) 20vw, 50vw" />
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- CONTACT ---------------- */
export const contactMeta = (l: Lang) => pageMeta(l, "/contact/", T(l, "Контакти", "Contact") + suffix(l), T(l, "Телефон, адрес, работно време и социални мрежи на КаРе-АртЕ.", "Phone, address, opening hours and social links for KaRe-Arte."));
export function ContactPage({ lang }: { lang: Lang }) {
  return (
    <>
      <PageHero kicker={T(lang, "Контакти", "Contact")} title={T(lang, "Пиши, звънни или просто ела.", "Message, call or just come by.")} />
      <section className="sec sec-tight">
        <div className="container contact-grid">
          <a className="contact-card" href={`tel:${site.phone}`}>
            <Phone />
            <small>{T(lang, "Телефон / WhatsApp", "Phone / WhatsApp")}</small>
            <b>{site.phoneDisplay}</b>
          </a>
          <a className="contact-card" href={site.googleMaps} target="_blank" rel="noopener">
            <Pin />
            <small>{T(lang, "Адрес", "Address")}</small>
            <b>{site.address[lang]}</b>
          </a>
          <a className="contact-card" href={site.instagram} target="_blank" rel="noopener">
            <Instagram />
            <small>Instagram</small>
            <b>{site.instagramHandle}</b>
          </a>
          <a className="contact-card" href={site.facebook} target="_blank" rel="noopener">
            <Facebook />
            <small>Facebook</small>
            <b>KaRe-Arte</b>
          </a>
        </div>
        <div className="container contact-hours">
          <h2>{T(lang, "Работно време", "Opening hours")}</h2>
          <OpenStatus lang={lang} />
          <ul className="f-hours">
            {site.hours.map((h) => (
              <li key={h.time}>
                <span>{h.days[lang]}</span>
                <b>{h.time}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/* ---------------- FAQ ---------------- */
export const faqMeta = (l: Lang) => pageMeta(l, "/faq/", T(l, "Въпроси", "FAQ") + suffix(l), T(l, "Как да ни намериш, плащане с карта, резервации, събития, наем на мястото и още.", "How to find us, card payments, bookings, events, private hire and more."));
export function FaqPage({ lang }: { lang: Lang }) {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero kicker={T(lang, "Въпроси", "FAQ")} title={T(lang, "Питат ни често.", "We get asked a lot.")} />
      <section className="sec sec-tight">
        <div className="container narrow faq">
          {faq.map((f) => (
            <details key={f.q.en}>
              <summary>{f.q[lang]}</summary>
              <p>{f.a[lang]}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------- PRIVACY ---------------- */
export const privacyMeta = (l: Lang) => pageMeta(l, "/privacy/", T(l, "Поверителност и бисквитки", "Privacy & cookies") + suffix(l), T(l, "Какви данни събираме при резервация и как ги пазим.", "What data we collect when you book and how we protect it."));
export function PrivacyPage({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  return (
    <>
      <PageHero kicker={T(lang, "Поверителност", "Privacy")} title={T(lang, "Кратко и ясно.", "Short and clear.")} />
      <section className="sec sec-tight">
        <div className="container narrow prose">
          <h2>{bg ? "Какво събираме" : "What we collect"}</h2>
          <p>{bg ? "Само това, което попълниш в заявка за резервация или събитие: име, телефон, имейл (по желание) и бележка. Ползваме го, за да потвърдим резервацията." : "Only what you enter in a booking or event request: name, phone, email (optional) and a note. We use it to confirm the booking."}</p>
          <h2>{bg ? "Колко дълго" : "How long"}</h2>
          <p>{bg ? "Пазим заявките до 12 месеца, освен ако не си се съгласил/а да получаваш новини за събития. Можеш да поискаш изтриване по всяко време на телефона ни." : "We keep requests for up to 12 months unless you've agreed to receive event news. You can ask for deletion any time by calling us."}</p>
          <h2>{bg ? "Бисквитки" : "Cookies"}</h2>
          <p>{bg ? "Сайтът не ползва рекламни бисквитки. Запомняме само избора ти ден/нощ в браузъра. Картата на Google Maps се зарежда от Google и може да ползва техни бисквитки." : "The site uses no advertising cookies. We only remember your day/night choice in your browser. The Google Maps embed is loaded from Google and may use their cookies."}</p>
          <h2>{bg ? "Контакт" : "Contact"}</h2>
          <p>
            KaRe-Arte · {site.address[lang]} · <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          </p>
          <p className="demo-note">{bg ? "Чернова — да се прегледа и допълни с данните на фирмата (ЕИК, адрес на управление)." : "Draft — to be reviewed and completed with the company details."}</p>
        </div>
      </section>
    </>
  );
}

export { events, posts };
