import Link from "next/link";
import { site } from "@/content/site";
import { upcoming } from "@/content/events";
import { reviews, praised, reviewText } from "@/content/reviews";
import { ScrollVar } from "../client/ScrollVar";
import { faq, about } from "@/content/pages";
import { menu, eur } from "@/content/menu";
import { to, ui, type Lang } from "@/lib/i18n";
import { pageMeta, suffix, T } from "@/lib/meta";
import { Img } from "../Img";
import { Arrow, Google, Instagram, Star } from "../Icons";
import { SecHead } from "../Chrome";
import { EventCard } from "../EventCard";
import { HeroVideo } from "../client/HeroVideo";
import { OpenStatus } from "../client/OpenStatus";
import { DayNight } from "../client/DayNight";
import { ReviewGrid } from "../client/ReviewGrid";
import { Praised } from "../client/Praised";
import { Reels } from "../client/Reels";
import { MapEmbed } from "../client/MapEmbed";

export const homeMeta = (lang: Lang) =>
  pageMeta(
    lang,
    "/",
    T(lang, "КаРе-АртЕ · Бар-галерия, кафе и коктейли в центъра на София", "KaRe-Arte · Bar-gallery, coffee & cocktails in central Sofia"),
    T(
      lang,
      "Скрита бар-галерия на ул. „Петър Парчевич“ 36: кафе и лимонади през деня, авторски коктейли вечер, куиз, рисуване с вино, джаз и частни партита. 4,8 в Google.",
      "A hidden bar-gallery at 36 Petar Parchevich St: coffee and lemonades by day, signature cocktails by night, quizzes, paint & wine, jazz and private parties. 4.8 on Google.",
    ),
  );

const AV = ["#E5482B", "#26408B", "#C98A1B", "#225F68", "#B5654A", "#8A6BB0", "#3D6344"];

const clip = (t: string) => (t.length > 190 ? t.slice(0, t.lastIndexOf(" ", 185)) + "…" : t);

const stars = (
  <span className="stars" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} />
    ))}
  </span>
);

export function Home({ lang }: { lang: Lang }) {
  const bg = lang === "bg";
  const next = upcoming().slice(0, 3);
  const highlights = [
    { ...menu.day[1].items[0], part: "day" as const },
    { ...menu.night[0].items[0], part: "night" as const },
    { ...menu.day[2].items[0], part: "day" as const, img: "garden-spritz" },
    { ...menu.night[0].items[1], part: "night" as const },
  ];
  const reels = [
    { src: "/video/reel-night", title: bg ? "Една вечер в Каре Арте" : "A night in Kare Arte" },
    { src: "/video/reel-cupffee", title: bg ? "Чашата се яде" : "You can eat the cup" },
    { src: "/video/reel-blind-cocktails", title: bg ? "Коктейл на сляпо" : "Blind cocktail" },
    { src: "/video/reel-summer", title: bg ? "Сприц в градината" : "Spritz in the garden" },
    { src: "/video/reel-sour", title: bg ? "Сауърът извън менюто" : "The off-menu sour" },
    { src: "/video/reel-favourite-guest", title: bg ? "Идва любимият ни гост" : "Our favourite guest" },
  ].map((r) => ({ ...r, href: site.instagram }));
  const marquee = bg
    ? ["кафе", "коктейли", "изкуство", "куиз", "джаз", "рисуване с вино", "градина", "караоке", "книги", "свещи"]
    : ["coffee", "cocktails", "art", "quiz", "jazz", "paint & wine", "garden", "karaoke", "books", "candles"];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <Img id="interior-wide" lang={lang} priority sizes="100vw" className="hero-bg-night" alt="" />
          <Img id="hall-bar-wide" lang={lang} sizes="100vw" className="hero-bg-day" alt="" />
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <a href="#reviews" className="hero-rating" data-reveal="up">
              {stars}
              <b>{String(site.rating.value).replace(".", bg ? "," : ".")}</b>
              <span>
                {site.rating.count} {ui.reviewsOnGoogle[lang]}
              </span>
            </a>
            <h1 data-reveal="up" style={{ "--d": "80ms" } as React.CSSProperties}>
              <span className="h1-hand">{bg ? "скрита" : "a hidden"}</span>
              <span className="h1-main">{bg ? "Бар-галерия" : "Bar-gallery"}</span>
              <span className="h1-sub">{bg ? "в сърцето на София" : "in the heart of Sofia"}</span>
            </h1>
            <p className="hero-lead" data-reveal="up" style={{ "--d": "160ms" } as React.CSSProperties}>
              <span className="only-day">{bg ? "Сутрин — кафе, лимонади и тишина за лаптопа. Две тераси отзад." : "Mornings — coffee, lemonades and quiet for your laptop. Two terraces out back."}</span>
              <span className="only-night">{bg ? "Вечер — авторски коктейли, свещи, куиз и джаз под стенописа на Ван Гог." : "Evenings — signature cocktails, candles, quizzes and jazz under the Van Gogh mural."}</span>
            </p>
            <div className="hero-cta" data-reveal="up" style={{ "--d": "220ms" } as React.CSSProperties}>
              <Link href={to(lang, "reservations")} className="btn btn-accent btn-lg">
                {ui.reserve[lang]}
              </Link>
              <Link href={to(lang, "menu")} className="btn btn-glass btn-lg">
                {ui.seeMenu[lang]}
              </Link>
            </div>
            <div className="hero-meta" data-reveal="up" style={{ "--d": "280ms" } as React.CSSProperties}>
              <OpenStatus lang={lang} />
              <Link href={to(lang, "findUs")}>{site.address[lang]}</Link>
            </div>
          </div>
          <div className="hero-art" data-reveal="right">
            <HeroVideo label={bg ? "Видео от заведението" : "Video from the venue"} />
            <span className="hero-note">{bg ? "без табела отвън — нарочно" : "no sign outside — on purpose"}</span>
          </div>
        </div>
      <div className="marquee hero-marquee" aria-hidden="true">
        <div className="mq-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {marquee.map((w) => (
                <em key={w + k}>{w}</em>
              ))}
            </span>
          ))}
        </div>
      </div>

      </section>

      {/* REVIEWS — kiwis-style marquee of cards */}
      <section className="sec reviews-sec" id="reviews">
        <div className="container rv-top">
          <div data-reveal="left">
            <p className="kicker">{bg ? "Отзиви в Google" : "Google reviews"}</p>
            <h2>{bg ? "4,8 от 545 отзива." : "4.8 from 545 reviews."}</h2>
          </div>
          <a href={site.googleMaps} target="_blank" rel="noopener" className="rv-score" data-reveal="right">
            {stars}
            <span>
              <Google /> {bg ? "Прочети ги в Google" : "Read them on Google"}
            </span>
          </a>
        </div>
        <ScrollVar />
        <div className="rv-mq" aria-label={bg ? "Откъси от отзиви" : "Review snippets"}>
          {[0, 1, 2, 3].map((row) => {
            const list = reviews.filter((_, i) => i % 4 === row);
            return (
              <div key={row} className={`rv-row ${row % 2 === 1 ? "is-rev" : ""}`} style={{ "--dur": `${60 + row * 11}s` } as React.CSSProperties}>
                <div className="rv-track">
                  {[0, 1, 2, 3].map((dup) =>
                    list.map((r, i) => (
                      <figure key={`${dup}-${i}`} className="rv-mcard" lang={reviewText(r, lang).translated ? lang : r.lang} aria-hidden={dup > 0 ? true : undefined}>
                        <span className="rv-mstars" aria-label={`${r.rating}/5`}>
                          {Array.from({ length: r.rating }, (_, k) => (
                            <Star key={k} />
                          ))}
                        </span>
                        <blockquote>„{clip(reviewText(r, lang).text)}“</blockquote>
                        <figcaption>
                          <span className="rv-av" style={{ background: AV[(i + row) % AV.length] }}>
                            {r.name[0]}
                          </span>
                          <b>{r.name}</b>
                          {reviewText(r, lang).translated && <small className="rv-tr">{bg ? "преведено" : "translated"}</small>}
                          <Google className="rv-gl" />
                        </figcaption>
                      </figure>
                    )),
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="container">
          <ReviewGrid reviews={reviews} lang={lang} />
          <p className="rv-note">{bg ? "Отзиви от Google Карти. Тези на английски са преведени; имената са съкратени." : "Reviews from Google Maps. Those written in Bulgarian are translated; names shortened."}</p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="sec about-sec tone-blue" id="about">
        <div className="container about-grid">
          <div className="about-photos" data-reveal="left">
            <Img id="vangogh" lang={lang} sizes="(min-width: 1000px) 30vw, 70vw" className="ap ap-1" />
            <Img id="pedal-stool" lang={lang} sizes="(min-width: 1000px) 18vw, 40vw" className="ap ap-2" />
            <Img id="cupffee" lang={lang} sizes="(min-width: 1000px) 16vw, 36vw" className="ap ap-3" />
          </div>
          <div className="about-copy" data-reveal="right">
            <p className="kicker">{bg ? "Кои сме" : "Who we are"}</p>
            <h2>
              {bg ? (
                <>
                  Някои места те канят. <em>Други те карат да останеш.</em>
                </>
              ) : (
                <>
                  Some places invite you in. <em>Others make you stay.</em>
                </>
              )}
            </h2>
            <p className="lead">{about.lead[lang]}</p>
            <p>{about.paragraphs[0][lang]}</p>
            <ul className="facts">
              {about.facts.map((f) => (
                <li key={f.n}>
                  <b data-count={f.n.replace("~", "")}>{f.n}</b>
                  <span>{f.l[lang]}</span>
                </li>
              ))}
            </ul>
            <Link href={to(lang, "about")} className="link-arrow">
              {bg ? "Цялата история" : "The whole story"} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* DAY / NIGHT */}
      <section className="sec dn-sec">
        <div className="container dn-grid">
          <div data-reveal="up">
            <DayNight lang={lang} day="hall-bar-wide" night="night-mural-guests" />
          </div>
          <div className="dn-copy" data-reveal="up" style={{ "--d": "100ms" } as React.CSSProperties}>
            <p className="kicker">{bg ? "Две места в едно" : "Two places in one"}</p>
            <h2>{bg ? "Денем кафене. Нощем бар." : "Café by day. Bar by night."}</h2>
            <div className="dn-cols">
              <div>
                <h3 className="dn-h dn-h-day">{bg ? "11:00 – 18:00" : "11am – 6pm"}</h3>
                <p>{bg ? "Лате на пластове, лавандулова лимонада, горещ шоколад в ядлива чашка, морковена торта. Тихо, светло, с Wi-Fi." : "Layered latte, lavender lemonade, hot chocolate in an edible cup, carrot cake. Quiet, bright, with Wi-Fi."}</p>
              </div>
              <div>
                <h3 className="dn-h dn-h-night">{bg ? "18:00 – 00:00" : "6pm – midnight"}</h3>
                <p>{bg ? "Около десет авторски коктейла без списък със съставки — барманът ще те попита какво обичаш. Свещи, музика, събития." : "About ten signature cocktails with no ingredient list — the bartender asks what you like. Candles, music, events."}</p>
              </div>
            </div>
            <p className="dn-hint">{bg ? "Плъзни линията. Или натисни ден/нощ горе — целият сайт се сменя." : "Drag the line. Or tap day/night up top — the whole site changes."}</p>
          </div>
        </div>
      </section>

      {/* MENU HIGHLIGHTS */}
      <section className="sec hl-sec tone-orange">
        <div className="container">
          <SecHead kicker={bg ? "От менюто" : "From the menu"} title={bg ? "За това се връщат." : "What people come back for."}>
            <Link href={to(lang, "menu")} className="btn btn-line">
              {bg ? "Цялото меню" : "Full menu"} <Arrow />
            </Link>
          </SecHead>
          <ul className="hl-grid">
            {highlights.map((h, i) => (
              <li key={h.name.en} className="hl-card" data-reveal="up" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                <div className="hl-img">
                  <Img id={h.img!} lang={lang} sizes="(min-width: 1000px) 25vw, (min-width: 600px) 50vw, 100vw" />
                  <span className={`hl-part hl-${h.part}`}>{h.part === "day" ? (bg ? "Ден" : "Day") : bg ? "Нощ" : "Night"}</span>
                </div>
                <div className="hl-body">
                  <h3>{h.name[lang]}</h3>
                  {h.desc && <p>{h.desc[lang]}</p>}
                  <b>{eur(h.price)}</b>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EVENTS */}
      <section className="sec ev-sec">
        <div className="container">
          <SecHead
            kicker={bg ? "Какво предстои" : "Coming up"}
            title={bg ? "Куиз, четки, джаз и караоке." : "Quizzes, brushes, jazz and karaoke."}
            lead={bg ? "Резервираш онлайн, плащаш на място." : "Book online, pay at the venue."}
          >
            <Link href={to(lang, "events")} className="btn btn-line">
              {ui.allEvents[lang]} <Arrow />
            </Link>
          </SecHead>
          <ul className="ev-grid">
            {next.map((e, i) => (
              <li key={e.slug} data-reveal="up" style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
                <EventCard e={e} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REELS */}
      <section className="sec reels-sec tone-navy">
        <div className="container">
          <SecHead kicker="Instagram" title={bg ? "Както изглежда наистина." : "What it really looks like."} lead={bg ? "Клипове от нашия Instagram. Натисни за звук." : "Clips from our Instagram. Tap for sound."}>
            <a href={site.instagram} target="_blank" rel="noopener" className="btn btn-line">
              <Instagram /> {site.instagramHandle}
            </a>
          </SecHead>
        </div>
        <Praised count={reels.length}>
          <Reels reels={reels} lang={lang} />
        </Praised>
      </section>

      {/* PRAISED — sticky horizontal */}
      <section className="sec praised-sec tone-mustard" aria-label={bg ? "За какво пишат гостите" : "What guests write about"}>
        <Praised count={praised.length}>
          <div className="praised-intro">
            <p className="kicker">{bg ? "От отзивите" : "From the reviews"}</p>
            <h2>{bg ? "За какво пишат гостите." : "What guests write about."}</h2>
          </div>
          {praised.map((p) => (
            <figure className="praised-card" key={p.img}>
              <Img id={p.img} lang={lang} sizes="(min-width: 900px) 30vw, 80vw" />
              <figcaption>
                <span className="kicker">{p.title[lang]}</span>
                <blockquote>„{p.quote}“</blockquote>
                <cite>— {p.who}</cite>
              </figcaption>
            </figure>
          ))}
        </Praised>
      </section>

      {/* GALLERY TEASER */}
      <section className="sec gal-teaser">
        <div className="container">
          <SecHead kicker={bg ? "Галерия" : "Gallery"} title={bg ? "Всеки ъгъл е картина." : "Every corner is a painting."}>
            <Link href={to(lang, "gallery")} className="btn btn-line">
              {bg ? "Към галерията" : "Open the gallery"} <Arrow />
            </Link>
          </SecHead>
          <div className="gt-grid">
            {["hall-panorama-entrance", "terrace2-upper-yellow-chairs", "orange-room-armchair-vangogh", "blue-cocktail", "orange-room-sofas", "terrace1-long-view", "garden-night"].map((id, i) => (
              <Link key={id} href={to(lang, "gallery")} className={`gt gt-${i}`} data-reveal="up" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
                <Img id={id} lang={lang} sizes="(min-width: 1000px) 33vw, 50vw" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SPACE + PRIVATE */}
      <section className="sec space-sec">
        <div className="container space-grid">
          <Link href={to(lang, "space")} className="space-card" data-reveal="left">
            <Img id="orange-room-sofas" lang={lang} sizes="(min-width: 900px) 50vw, 100vw" />
            <div>
              <p className="kicker">{bg ? "Пространството" : "The space"}</p>
              <h3>{bg ? "Зала, оранжева стая и две тераси. Разгледай ги и си избери маса." : "A hall, an orange room and two terraces. Look around and pick a table."}</h3>
              <span className="link-arrow">
                {bg ? "Интерактивен план" : "Interactive plan"} <Arrow />
              </span>
            </div>
          </Link>
          <Link href={`${to(lang, "reservations")}?type=private`} className="space-card is-accent" data-reveal="right">
            <Img id="terrace1-long-view" lang={lang} sizes="(min-width: 900px) 50vw, 100vw" />
            <div>
              <p className="kicker">{bg ? "Частни събития" : "Private events"}</p>
              <h3>{bg ? "Рожден ден, тиймбилдинг, моминско? Цялото място е твое." : "Birthday, team-building, bachelorette? The whole place is yours."}</h3>
              <span className="link-arrow">
                {bg ? "До 50 гости · запитване" : "Up to 50 guests · inquire"} <Arrow />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* VISIT */}
      <section className="sec visit-sec tone-teal" id="visit">
        <div className="container visit-grid">
          <div data-reveal="up">
            <p className="kicker">{bg ? "Как да ни намериш" : "How to find us"}</p>
            <h2>{bg ? "Скрити сме. Нарочно." : "We're hidden. On purpose."}</h2>
            <ol className="visit-steps">
              <li>{bg ? "Офис сградата на ул. „Петър Парчевич“ 36." : "The office building at 36 Petar Parchevich St."}</li>
              <li>{bg ? "Голямата черна стъклена врата — влез смело." : "The big black glass door — walk right in."}</li>
              <li>{bg ? "По коридора до края. Жълтият неон е там." : "Down the corridor to the end. The yellow neon is there."}</li>
            </ol>
            <div className="visit-actions">
              <Link href={to(lang, "findUs")} className="btn btn-accent">
                {bg ? "Пътят със снимки" : "The way, in photos"}
              </Link>
              <a href={`tel:${site.phone}`} className="btn btn-line">
                {site.phoneDisplay}
              </a>
            </div>
            <ul className="f-hours visit-hours">
              {site.hours.map((h) => (
                <li key={h.time}>
                  <span>{h.days[lang]}</span>
                  <b>{h.time}</b>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="up" style={{ "--d": "100ms" } as React.CSSProperties}>
            <MapEmbed lang={lang} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec faq-sec">
        <div className="container narrow">
          <SecHead kicker={bg ? "Въпроси" : "FAQ"} title={bg ? "Преди да дойдеш." : "Before you come."} center />
          <div className="faq">
            {faq.slice(0, 5).map((f) => (
              <details key={f.q.en} data-reveal="up">
                <summary>{f.q[lang]}</summary>
                <p>{f.a[lang]}</p>
              </details>
            ))}
          </div>
          <p className="center">
            <Link href={to(lang, "faq")} className="link-arrow">
              {bg ? "Всички въпроси" : "All questions"} <Arrow />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
