// DEMO menu built from public reviews + Instagram. Prices are placeholders (EUR) until Kalina sends the real menu.
// In production this comes from М5 (products) — one source for site, QR menu, POS and the fiscal PLU list.
import type { L } from "@/lib/i18n";

export type MenuItem = {
  name: L;
  desc?: L;
  price: number; // EUR
  tags?: ("signature" | "new" | "seasonal" | "vegan" | "alcohol-free")[];
  img?: string; // media id
  allergens?: string[];
};
export type MenuSection = { id: string; title: L; note?: L; items: MenuItem[] };
export type Daypart = "day" | "night";

export const MENU_IS_DEMO = true;

export const menu: Record<Daypart, MenuSection[]> = {
  day: [
    {
      id: "coffee",
      title: { bg: "Кафе", en: "Coffee" },
      items: [
        { name: { bg: "Еспресо", en: "Espresso" }, price: 1.8 },
        { name: { bg: "Капучино", en: "Cappuccino" }, price: 2.8 },
        { name: { bg: "Флат уайт", en: "Flat white" }, price: 3.2 },
        { name: { bg: "Лате на пластове", en: "Layered latte" }, desc: { bg: "Във висока чаша, както я снимате", en: "In a tall glass, the way you photograph it" }, price: 3.6, tags: ["signature"] },
        { name: { bg: "Айс лате", en: "Iced latte" }, price: 3.8, img: "iced-latte" },
        { name: { bg: "Айс лате с тиквен спайс", en: "Pumpkin spice iced latte" }, price: 4.2, tags: ["seasonal"] },
      ],
    },
    {
      id: "chocolate",
      title: { bg: "Горещ шоколад", en: "Hot chocolate" },
      items: [
        {
          name: { bg: "Горещ шоколад в ядлива чашка", en: "Hot chocolate in an edible cup" },
          desc: { bg: "С бита сметана. И да — чашата се яде.", en: "With whipped cream. And yes — you can eat the cup." },
          price: 5.5,
          tags: ["signature"],
          img: "cupffee",
          allergens: ["мляко / milk", "глутен / gluten"],
        },
      ],
    },
    {
      id: "cold",
      title: { bg: "Лимонади и студени чайове", en: "Lemonades & cold teas" },
      items: [
        { name: { bg: "Лавандулова лимонада", en: "Lavender lemonade" }, price: 4.5, tags: ["signature", "alcohol-free"] },
        { name: { bg: "Ягода-лимон мохито без алкохол", en: "Strawberry-lemon mocktail" }, desc: { bg: "„Най-добрият моктейл, който съм пила“ — от отзив", en: "“Best mocktail I've ever had” — from a review" }, price: 5.2, tags: ["alcohol-free"] },
        { name: { bg: "Домашен студен чай", en: "House cold tea" }, price: 3.9, tags: ["alcohol-free"] },
        { name: { bg: "Ментов чай", en: "Mint tea" }, price: 3.0 },
      ],
    },
    {
      id: "sweet",
      title: { bg: "Сладко", en: "Sweet" },
      items: [
        { name: { bg: "Морковена торта", en: "Carrot cake" }, price: 4.5 },
        { name: { bg: "Шоколадово-кокосова торта", en: "Chocolate-coconut cake" }, price: 4.8 },
        { name: { bg: "Холандски мъфин", en: "Dutch muffin" }, price: 3.2 },
      ],
    },
  ],
  night: [
    {
      id: "signature",
      title: { bg: "Авторски коктейли", en: "Signature cocktails" },
      note: {
        bg: "Кажи ни какво обичаш — барманът ще ти предложи нещо. Ако не е в менюто, пак може.",
        en: "Tell us what you like and the bartender will suggest something. Not on the menu? Still possible.",
      },
      items: [
        { name: { bg: "Art Passion", en: "Art Passion" }, desc: { bg: "Джин, манго, цитрус", en: "Gin, mango, citrus" }, price: 9.5, tags: ["signature"], img: "cocktails-bar" },
        { name: { bg: "Коктейл на сляпо", en: "Blind cocktail" }, desc: { bg: "Казваш две думи, ние го измисляме", en: "Give us two words, we invent it" }, price: 10, tags: ["signature"], img: "blue-cocktail" },
        { name: { bg: "Сауър извън менюто", en: "Off-menu sour" }, desc: { bg: "Попитай ни за него", en: "Ask us about it" }, price: 9.5, img: "sour" },
        { name: { bg: "„Течен ябълков пай“", en: "“Liquid apple pie”" }, desc: { bg: "Ябълка, канела, ром", en: "Apple, cinnamon, rum" }, price: 9.5, tags: ["seasonal"] },
        { name: { bg: "Пипер и сладко", en: "Pepper jam" }, desc: { bg: "Джин, сладко от чушки, лайм", en: "Gin, pepper jam, lime" }, price: 9.5 },
      ],
    },
    {
      id: "spritz",
      title: { bg: "Сприц и пенливо", en: "Spritz & bubbles" },
      items: [
        { name: { bg: "Сприц", en: "Spritz" }, price: 7.5, img: "spritz-pour" },
        { name: { bg: "Френско пенливо вино, чаша", en: "French sparkling wine, glass" }, price: 7 },
      ],
    },
    {
      id: "wine",
      title: { bg: "Вино", en: "Wine" },
      items: [
        { name: { bg: "Бяло вино, чаша", en: "White wine, glass" }, price: 5.5 },
        { name: { bg: "Червено вино, чаша", en: "Red wine, glass" }, price: 5.5 },
        { name: { bg: "Бутилка по избор", en: "Bottle of choice" }, desc: { bg: "Попитай за картата", en: "Ask for the list" }, price: 28 },
      ],
    },
    {
      id: "beer",
      title: { bg: "Бира и шотове", en: "Beer & shots" },
      items: [
        { name: { bg: "Бира", en: "Beer" }, price: 3.5 },
        { name: { bg: "Шот с Monin сироп", en: "Monin syrup shot" }, price: 3.5 },
      ],
    },
    {
      id: "bites",
      title: { bg: "За хапване", en: "Bites" },
      items: [
        { name: { bg: "Плато сирена", en: "Cheese board" }, price: 12 },
        { name: { bg: "Плато колбаси", en: "Charcuterie board" }, price: 13 },
        { name: { bg: "Препечени филийки", en: "Toast plate" }, price: 6.5 },
      ],
    },
  ],
};

export const tagLabel: Record<NonNullable<MenuItem["tags"]>[number], L> = {
  signature: { bg: "Препоръка", en: "Signature" },
  new: { bg: "Ново", en: "New" },
  seasonal: { bg: "Сезонно", en: "Seasonal" },
  vegan: { bg: "Веган", en: "Vegan" },
  "alcohol-free": { bg: "Без алкохол", en: "Alcohol-free" },
};

export const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
