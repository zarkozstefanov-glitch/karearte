import type { L } from "@/lib/i18n";

export const faq: { q: L; a: L }[] = [
  {
    q: { bg: "Как да ви намеря? Не виждам табела.", en: "How do I find you? I can't see a sign." },
    a: {
      bg: "Влизаш в новата офис сграда на ул. „Петър Парчевич“ 36 през голямата черна стъклена врата, минаваш покрай охраната и вървиш по коридора до края. Там е жълтият неонов надпис. На страница „Как да ни намериш“ има снимки на всяка стъпка.",
      en: "Enter the new office building at 36 Petar Parchevich St through the big black glass door, walk past the security desk and go to the end of the corridor. That's where the yellow neon sign is. The “Find us” page has a photo of every step.",
    },
  },
  {
    q: { bg: "Мога ли да платя с карта?", en: "Can I pay by card?" },
    a: { bg: "Да — с карта и в брой.", en: "Yes — card and cash." },
  },
  {
    q: { bg: "Трябва ли резервация?", en: "Do I need a reservation?" },
    a: {
      bg: "През деня обикновено не. Вечер и в дни със събития — препоръчваме. Резервацията е безплатна.",
      en: "Usually not during the day. In the evening and on event days we recommend it. Booking is free.",
    },
  },
  {
    q: { bg: "Как се плащат събитията?", en: "How do I pay for events?" },
    a: {
      bg: "Резервираш място онлайн, а плащаш на място в деня на събитието. Онлайн плащане няма.",
      en: "You book a seat online and pay at the venue on the day. There is no online payment.",
    },
  },
  {
    q: { bg: "Може ли да наема цялото място?", en: "Can I rent the whole place?" },
    a: {
      bg: "Да — за рождени дни, тиймбилдинги, моминско парти, бебешко парти, презентации. До 50 гости, а „Малкото Каре“ е за до 15. Изпрати запитване от страница „Резервации“.",
      en: "Yes — birthdays, team-buildings, bachelorettes, baby showers, presentations. Up to 50 guests; the “Little Kare” room takes up to 15. Send an inquiry from the “Reservations” page.",
    },
  },
  {
    q: { bg: "Подходящо ли е за работа с лаптоп?", en: "Is it laptop-friendly?" },
    a: { bg: "Да, през деня е тихо, има Wi-Fi и контакти.", en: "Yes, it's quiet during the day, with Wi-Fi and sockets." },
  },
  {
    q: { bg: "Имате ли храна?", en: "Do you serve food?" },
    a: {
      bg: "Леки неща: десерти, мъфини, плата със сирена и колбаси, препечени филийки.",
      en: "Light bites: cakes, muffins, cheese and charcuterie boards, toast.",
    },
  },
  {
    q: { bg: "Има ли настолни игри?", en: "Do you have board games?" },
    a: { bg: "Има — и книги. Питай на бара.", en: "Yes — and books. Ask at the bar." },
  },
];

export const findSteps: { title: L; text: L; img: string }[] = [
  {
    title: { bg: "1. Офис сградата на № 36", en: "1. The office building at No. 36" },
    text: {
      bg: "На ул. „Петър Парчевич“ 36, на крачка от бул. „Витоша“ и НДК. Нова офис сграда, отвън няма наша табела — това е нормално.",
      en: "At 36 Petar Parchevich St, a step from Vitosha Blvd and NDK. A new office building with no sign of ours outside — that's normal.",
    },
    img: "kare-sign",
  },
  {
    title: { bg: "2. Голямата черна стъклена врата", en: "2. The big black glass door" },
    text: {
      bg: "Влез смело. Охраната знае за нас — ако се чудиш, просто кажи „Каре Арте“.",
      en: "Walk in. Security knows us — if in doubt, just say “Kare Arte”.",
    },
    img: "blue-walls",
  },
  {
    title: { bg: "3. До края на коридора", en: "3. To the end of the corridor" },
    text: {
      bg: "Минаваш покрай картините и стигаш до жълтия неон KaReArte. Добре дошъл.",
      en: "Walk past the paintings to the yellow KaReArte neon. Welcome.",
    },
    img: "bar-neon",
  },
];

export const about = {
  lead: {
    bg: "Арт кафе-бар, скрит в офис сграда на крачка от „Витоша“. Сутрин — кафе и тишина. Вечер — коктейли, свещи и хора, които не бързат.",
    en: "An art café-bar hidden in an office building a step from Vitosha Blvd. Mornings: coffee and quiet. Evenings: cocktails, candles and people in no hurry.",
  },
  paragraphs: [
    {
      bg: "КаРе-АртЕ отвори на ул. „Петър Парчевич“ 36 през 2018 г. като „дневна-галерия“: място, където картините по стените се сменят, а гостите се връщат. Барът е облицован с бели речни камъни, единият стол е с велосипедни педали, а до стъпалата към горното ниво те гледа стенопис по Ван Гог — „Терасата на кафенето през нощта“.",
      en: "KaRe-ArtE opened at 36 Petar Parchevich St in 2018 as a “living-room gallery”: the paintings on the walls change and the guests come back. The bar is clad in white river stones, one stool has bicycle pedals, and a Van Gogh mural — “Café Terrace at Night” — watches you from the steps to the upper level.",
    },
    {
      bg: "Коктейлите са около десет и в менюто им няма съставки — нарочно. Барманът ще те попита какво обичаш и ще ти направи нещо. Ако искаш нещо, което го няма, пак може.",
      en: "There are about ten cocktails and the menu doesn't list ingredients — on purpose. The bartender will ask what you like and make you something. If you want something that's not there, that's fine too.",
    },
    {
      bg: "Тук се случват куиз вечери на български и английски, рисуване с вино, караоке, джаз, литературни вечери „Бохемска София“, изложби и много частни празници. До 50 гости, с две тераси.",
      en: "We host quiz nights in Bulgarian and English, paint & wine, karaoke, jazz, “Bohemian Sofia” literary evenings, exhibitions and lots of private parties. Up to 50 guests, with two terraces.",
    },
  ] as L[],
  facts: [
    { n: "2018", l: { bg: "отворихме тук", en: "opened here" } },
    { n: "50", l: { bg: "места + 2 тераси", en: "seats + 2 terraces" } },
    { n: "~10", l: { bg: "авторски коктейла", en: "signature cocktails" } },
    { n: "4,8", l: { bg: "в Google (545 отзива)", en: "on Google (545 reviews)" } },
  ],
};
