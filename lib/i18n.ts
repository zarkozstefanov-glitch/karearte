export type Lang = "bg" | "en";
export type L = { bg: string; en: string };

export const tr = (l: L, lang: Lang) => l[lang];

/** Route keys → path (same slugs in both languages; EN lives under /en). */
export const routes = {
  home: "/",
  menu: "/menu/",
  events: "/events/",
  gallery: "/gallery/",
  vlog: "/vlog/",
  space: "/space/",
  reservations: "/reservations/",
  findUs: "/find-us/",
  about: "/about/",
  contact: "/contact/",
  faq: "/faq/",
  privacy: "/privacy/",
} as const;
export type RouteKey = keyof typeof routes;

export const href = (lang: Lang, path: string) => (lang === "en" ? `/en${path === "/" ? "/" : path}` : path);
export const to = (lang: Lang, key: RouteKey) => href(lang, routes[key]);

export const nav: { key: RouteKey; label: L }[] = [
  { key: "menu", label: { bg: "Меню", en: "Menu" } },
  { key: "events", label: { bg: "Събития", en: "Events" } },
  { key: "space", label: { bg: "Пространството", en: "The space" } },
  { key: "gallery", label: { bg: "Галерия", en: "Gallery" } },
  { key: "vlog", label: { bg: "Влог", en: "Vlog" } },
  { key: "findUs", label: { bg: "Как да ни намериш", en: "Find us" } },
];

export const ui = {
  reserve: { bg: "Резервирай", en: "Book a table" },
  call: { bg: "Обади се", en: "Call" },
  directions: { bg: "Как да стигна", en: "Directions" },
  seeMenu: { bg: "Виж менюто", en: "See the menu" },
  allEvents: { bg: "Всички събития", en: "All events" },
  readMore: { bg: "Прочети", en: "Read" },
  openToday: { bg: "Днес", en: "Today" },
  dayMode: { bg: "Ден", en: "Day" },
  nightMode: { bg: "Нощ", en: "Night" },
  switchTheme: { bg: "Смени ден / нощ", en: "Switch day / night" },
  menuOpen: { bg: "Отвори менюто", en: "Open menu" },
  menuClose: { bg: "Затвори менюто", en: "Close menu" },
  payOnSite: { bg: "плащане на място", en: "pay at the venue" },
  free: { bg: "Вход свободен", en: "Free entry" },
  reviewsOnGoogle: { bg: "отзива в Google", en: "Google reviews" },
  skip: { bg: "Към съдържанието", en: "Skip to content" },
  langSwitch: { bg: "EN", en: "BG" },
  close: { bg: "Затвори", en: "Close" },
  prev: { bg: "Предишна", en: "Previous" },
  next: { bg: "Следваща", en: "Next" },
} satisfies Record<string, L>;
