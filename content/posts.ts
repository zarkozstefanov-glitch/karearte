// Vlog/blog posts. In production: CMS (М7) with video upload. Videos here are real @kare.arte reels.
import type { L } from "@/lib/i18n";

export type Post = {
  slug: string;
  date: string;
  title: L;
  excerpt: L;
  cover: string; // media id
  video?: string; // /video/<name>
  body: L[];
};

export const posts: Post[] = [
  {
    slug: "blind-cocktails",
    date: "2026-10-20",
    title: { bg: "Коктейл на сляпо, част 2", en: "Blind cocktail, part 2" },
    excerpt: { bg: "Казваш ни „текила“ и „ром“. Ние трябва да измислим нещо, което да ти хареса.", en: "You say “tequila” and “rum”. We have to invent something you'll like." },
    cover: "bartenders",
    video: "/video/reel-blind-cocktails",
    body: [
      { bg: "Играта е проста: гостът казва две думи, барманите имат пет минути. Понякога става шедьовър, понякога — история за разказване.", en: "The game is simple: the guest says two words, the bartenders get five minutes. Sometimes it's a masterpiece, sometimes it's a story to tell." },
      { bg: "На 19 декември го правим на живо — с вас. Виж събитията.", en: "On 19 December we do it live — with you. See events." },
    ],
  },
  {
    slug: "a-night-in-kare-arte",
    date: "2026-11-10",
    title: { bg: "Една вечер в Каре Арте", en: "A night in Kare Arte" },
    excerpt: { bg: "Свещи, книги, син коктейл и хора, които не бързат за никъде.", en: "Candles, books, a blue cocktail and people in no hurry." },
    cover: "night-guests",
    video: "/video/reel-night",
    body: [
      { bg: "Една обикновена вечер у нас. Без филтри — само жълтата светлина на лампите и стенописа.", en: "An ordinary evening here. No filters — just the yellow light of the lamps and the mural." },
    ],
  },
  {
    slug: "edible-cup",
    date: "2026-11-18",
    title: { bg: "Горещ шоколад в ядлива чашка", en: "Hot chocolate in an edible cup" },
    excerpt: { bg: "И да — чашата се яде. Ето как я правим.", en: "And yes — you can eat the cup. Here's how we make it." },
    cover: "cupffee",
    video: "/video/reel-cupffee",
    body: [
      { bg: "Хрупкава вафлена чашка, гъст горещ шоколад, бита сметана и карамелени трохи. Пиеш, после хапваш чашата.", en: "A crunchy wafer cup, thick hot chocolate, whipped cream and caramel crumbs. Drink it, then eat the cup." },
    ],
  },
  {
    slug: "summer-in-the-garden",
    date: "2026-09-05",
    title: { bg: "Лятото още е тук", en: "Summer is still here" },
    excerpt: { bg: "Сприц в градината, докато още е топло.", en: "A spritz in the garden while it's still warm." },
    cover: "garden-spritz",
    video: "/video/reel-summer",
    body: [
      { bg: "Градината ни е скрита зад стъклената врата до бара — сенчеста през деня, с гирлянди вечер.", en: "Our garden hides behind the glass door next to the bar — shady by day, string lights by night." },
    ],
  },
  {
    slug: "off-menu-sour",
    date: "2026-10-02",
    title: { bg: "Сауърът, който го няма в менюто", en: "The sour that isn't on the menu" },
    excerpt: { bg: "Можеш да си го поръчаш, ако знаеш да питаш.", en: "You can order it if you know to ask." },
    cover: "sour",
    video: "/video/reel-sour",
    body: [
      { bg: "Част от коктейлите ни живеят само в главата на бармана. Попитай.", en: "Some of our cocktails live only in the bartender's head. Ask." },
    ],
  },
];
