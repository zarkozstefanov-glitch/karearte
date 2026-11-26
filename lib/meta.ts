import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import type { Lang } from "./i18n";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export function pageMeta(lang: Lang, path: string, title: string, description: string): Metadata {
  const bgUrl = path;
  const enUrl = `/en${path}`;
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical: lang === "en" ? enUrl : bgUrl,
      languages: { bg: bgUrl, en: enUrl, "x-default": bgUrl },
    },
    openGraph: {
      type: "website",
      siteName: "KaRe-Arte",
      title,
      description,
      url: lang === "en" ? enUrl : bgUrl,
      locale: lang === "en" ? "en_GB" : "bg_BG",
      alternateLocale: lang === "en" ? "bg_BG" : "en_GB",
      images: [{ url: lang === "en" ? "/og-en.jpg" : "/og.jpg", width: 1200, height: 630, alt: lang === "en" ? "KaRe-Arte — a hidden art café-bar in the heart of Sofia" : "КаРе-АртЕ — скрит арт кафе-бар в сърцето на София" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [lang === "en" ? "/og-en.jpg" : "/og.jpg"] },
    icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
    manifest: "/site.webmanifest",
    other: { "geo.region": "BG-22", "geo.placename": "София", "geo.position": `${site.geo.lat};${site.geo.lng}`, ICBM: `${site.geo.lat}, ${site.geo.lng}` },
  };
}

export const T = (lang: Lang, bg: string, en: string) => (lang === "bg" ? bg : en);
export const suffix = (lang: Lang) => (lang === "bg" ? " · КаРе-АртЕ, арт кафе-бар в София" : " · KaRe-Arte, art café-bar in Sofia");
