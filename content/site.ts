// Business facts. Sources: brand-assets/RESEARCH.md + Instagram @kare.arte (Nov 2026).
// Later these come from the CMS (М7) — keep the shape.
import type { L } from "@/lib/i18n";

export const site = {
  name: "KaRe-Arte",
  nameBg: "КаРе-АртЕ",
  url: "https://karearte.bg", // TODO: real domain once bought
  phone: "+359888784278",
  phoneDisplay: "0888 784 278",
  email: "", // TODO: confirm with Kalina
  instagram: "https://www.instagram.com/kare.arte/",
  instagramHandle: "@kare.arte",
  facebook: "https://www.facebook.com/KareArtE/",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=KaRe-Arte%2C%20Petar%20Parchevich%2036%2C%20Sofia",
  mapEmbed: "https://www.google.com/maps?q=42.690834,23.318889&z=17&output=embed",
  geo: { lat: 42.690834, lng: 23.318889 },
  address: {
    bg: "ул. „Петър Парчевич“ 36, 1000 София",
    en: "36 Petar Parchevich St, 1000 Sofia",
  } satisfies L,
  rating: { value: 4.8, count: 545 },
  capacity: 50,
  // Instagram bio: "Every day till 0:00". Google: Mon–Sat 11:00–24:00, Sun 11:00–23:00 (confirm).
  hours: [
    { days: { bg: "Понеделник – Събота", en: "Monday – Saturday" }, time: "11:00 – 00:00", open: "11:00", close: "24:00", dow: [1, 2, 3, 4, 5, 6] },
    { days: { bg: "Неделя", en: "Sunday" }, time: "11:00 – 23:00", open: "11:00", close: "23:00", dow: [0] },
  ],
  tagline: {
    bg: "Някои места те канят. Други те карат да останеш.",
    en: "Some places invite you in. Others make you stay.",
  } satisfies L,
};
