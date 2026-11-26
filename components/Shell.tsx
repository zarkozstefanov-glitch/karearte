import { LangAttr } from "./client/LangAttr";
import { site } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import { Header } from "./client/Header";
import { Reveal } from "./client/Reveal";
import { Footer, MobileBar } from "./Chrome";
import { ui } from "@/lib/i18n";

const businessLd = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": ["BarOrPub", "CafeOrCoffeeShop"],
  "@id": `${site.url}/#venue`,
  name: "KaRe-Arte",
  alternateName: ["КаРе-АртЕ", "Каре Арте", "Kare Arte"],
  description: site.tagline[lang],
  url: lang === "en" ? `${site.url}/en/` : `${site.url}/`,
  image: [`${site.url}/og.jpg?v=20261126`],
  telephone: site.phone,
  priceRange: "€€",
  servesCuisine: ["Coffee", "Cocktails"],
  acceptsReservations: true,
  address: { "@type": "PostalAddress", streetAddress: "ul. Petar Parchevich 36", addressLocality: "Sofia", postalCode: "1000", addressCountry: "BG" },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "11:00", closes: "23:59" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "11:00", closes: "23:00" },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5 },
  sameAs: [site.instagram, site.facebook],
  hasMenu: lang === "en" ? `${site.url}/en/menu/` : `${site.url}/menu/`,
  maximumAttendeeCapacity: site.capacity,
});

export function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <>
      {lang === "en" && <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='en'" }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd(lang)) }} />
      <LangAttr lang={lang} />
      <a className="skip" href="#main">
        {ui.skip[lang]}
      </a>
      <Header lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
      <MobileBar lang={lang} />
      <Reveal />
    </>
  );
}
