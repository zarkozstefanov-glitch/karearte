// Event formats are real (quiz BG/EN, painting & wine, karaoke, live music, Bohemian Sofia,
// book presentations, blind cocktails). Dates and prices below are DEMO until Kalina adds them in the CMS.
import type { L } from "@/lib/i18n";

export type EventType = "quiz" | "painting" | "karaoke" | "music" | "literary" | "cocktails";
export type KAEvent = {
  slug: string;
  type: EventType;
  title: L;
  start: string; // ISO, Europe/Sofia
  durationMin: number;
  price: number | null; // EUR, paid at the venue; null = free
  seats: number;
  seatsLeft: number;
  img: string;
  summary: L;
  body: L;
  includes?: L;
};

export const EVENTS_ARE_DEMO = true;

export const eventTypes: Record<EventType, L> = {
  quiz: { bg: "Куиз", en: "Quiz" },
  painting: { bg: "Рисуване", en: "Painting" },
  karaoke: { bg: "Караоке", en: "Karaoke" },
  music: { bg: "Музика на живо", en: "Live music" },
  literary: { bg: "Литература", en: "Literary" },
  cocktails: { bg: "Коктейли", en: "Cocktails" },
};

export const events: KAEvent[] = [
  {
    slug: "quiz-bg-2026-12-03",
    type: "quiz",
    title: { bg: "Куиз вечер (на български)", en: "Quiz night (in Bulgarian)" },
    start: "2026-12-03T20:00:00+02:00",
    durationMin: 150,
    price: 6,
    seats: 40,
    seatsLeft: 12,
    img: "night-guests",
    summary: { bg: "Отбори до 6 души, шест кръга, награда за победителите.", en: "Teams of up to 6, six rounds, a prize for the winners." },
    body: {
      bg: "Събери отбор (или ела сам — ще те разпределим). Шест кръга: обща култура, изкуство, музика, София и един изненадващ. Победителите вземат бутилка и слава до следващия куиз.",
      en: "Bring a team (or come alone and we'll find you one). Six rounds: general knowledge, art, music, Sofia and a surprise one. Winners take a bottle and glory until the next quiz.",
    },
    includes: { bg: "Таксата е на човек и се плаща на място.", en: "The fee is per person, paid at the venue." },
  },
  {
    slug: "paint-and-wine-2026-12-05",
    type: "painting",
    title: { bg: "Рисуване с вино: „Звездна нощ“", en: "Paint & wine: “Starry Night”" },
    start: "2026-12-05T18:00:00+02:00",
    durationMin: 180,
    price: 35,
    seats: 16,
    seatsLeft: 5,
    img: "art-lounge",
    summary: { bg: "Рисуваш своя версия на Ван Гог с художник до теб. Без опит.", en: "Paint your own Van Gogh with an artist beside you. No experience needed." },
    body: {
      bg: "Платно, бои, престилка и чаша вино са включени. Художникът показва стъпка по стъпка, а ти си тръгваш с картина. Местата са малко — резервирай.",
      en: "Canvas, paints, an apron and a glass of wine are included. The artist guides you step by step and you leave with a painting. Few seats — book ahead.",
    },
    includes: { bg: "Включено: платно, бои, престилка, 1 чаша вино.", en: "Included: canvas, paints, apron, 1 glass of wine." },
  },
  {
    slug: "bohemian-sofia-2026-12-08",
    type: "literary",
    title: { bg: "Бохемска София: литературна вечер", en: "Bohemian Sofia: a literary evening" },
    start: "2026-12-08T19:30:00+02:00",
    durationMin: 120,
    price: null,
    seats: 35,
    seatsLeft: 20,
    img: "night-table",
    summary: { bg: "Четене, разговор с автора и вино на свещи.", en: "Readings, a talk with the author and wine by candlelight." },
    body: {
      bg: "Продължаваме традицията на вечерите „Бохемска София“: гост-автор, откъси, въпроси от публиката и подписване на книги.",
      en: "We continue the “Bohemian Sofia” evenings: a guest author, readings, questions from the audience and book signing.",
    },
  },
  {
    slug: "karaoke-2026-12-11",
    type: "karaoke",
    title: { bg: "Караоке петък", en: "Karaoke Friday" },
    start: "2026-12-11T21:00:00+02:00",
    durationMin: 180,
    price: null,
    seats: 50,
    seatsLeft: 30,
    img: "bar-neon",
    summary: { bg: "Микрофонът е твой. Публиката — приятелски настроена.", en: "The mic is yours. The crowd is friendly." },
    body: {
      bg: "Списък с песни на български и английски, а барът е отворен до полунощ. Резервирай маса, ако сте компания.",
      en: "Songs in Bulgarian and English, and the bar is open until midnight. Book a table if you're a group.",
    },
  },
  {
    slug: "live-jazz-2026-12-12",
    type: "music",
    title: { bg: "Джаз на живо", en: "Live jazz" },
    start: "2026-12-12T20:30:00+02:00",
    durationMin: 150,
    price: 8,
    seats: 40,
    seatsLeft: 18,
    img: "stools-mural",
    summary: { bg: "Трио, свещи и коктейли под стенописа на Ван Гог.", en: "A trio, candles and cocktails under the Van Gogh mural." },
    body: {
      bg: "Тиха, топла вечер с джаз стандарти. Входът се плаща на място.",
      en: "A quiet, warm evening of jazz standards. Entry is paid at the venue.",
    },
  },
  {
    slug: "quiz-en-2026-12-17",
    type: "quiz",
    title: { bg: "Quiz night (на английски)", en: "Quiz night (in English)" },
    start: "2026-12-17T20:00:00+02:00",
    durationMin: 150,
    price: 6,
    seats: 40,
    seatsLeft: 22,
    img: "interior-wide",
    summary: { bg: "Същият куиз, на английски. За експати и всички останали.", en: "Same quiz, in English. For expats and everyone else." },
    body: {
      bg: "Отбори до 6 души. Кръговете са на английски, а разговорите — на какъвто език искате.",
      en: "Teams of up to 6. Rounds are in English, conversations in any language you like.",
    },
  },
  {
    slug: "blind-cocktails-2026-12-19",
    type: "cocktails",
    title: { bg: "Коктейли на сляпо", en: "Blind cocktails" },
    start: "2026-12-19T20:00:00+02:00",
    durationMin: 150,
    price: 15,
    seats: 20,
    seatsLeft: 8,
    img: "bartenders",
    summary: { bg: "Казваш две думи, барманите правят коктейл. Познай какво пиеш.", en: "You give two words, the bartenders make a cocktail. Guess what you're drinking." },
    body: {
      bg: "Форматът от нашите рийлове — на живо. Три мини коктейла на човек и игра „познай съставките“.",
      en: "The format from our reels — live. Three mini cocktails per person and a “guess the ingredients” game.",
    },
    includes: { bg: "Включено: 3 мини коктейла.", en: "Included: 3 mini cocktails." },
  },
];

export const pastEvents: { title: L; date: string; img: string }[] = [
  { title: { bg: "Среща със Симеон Идакиев (пътеписи)", en: "Meet travel writer Simeon Idakiev" }, date: "2022-11", img: "art-armchairs" },
  { title: { bg: "Изложба на студенти от НХА", en: "Exhibition by National Academy of Arts students" }, date: "2018-11", img: "art-lounge" },
  { title: { bg: "Частно парти в градината", en: "A private party in the garden" }, date: "2025-06", img: "balloon-party" },
];

export const upcoming = (now = new Date()) =>
  events.filter((e) => new Date(e.start).getTime() + e.durationMin * 60000 > now.getTime()).sort((a, b) => a.start.localeCompare(b.start));
