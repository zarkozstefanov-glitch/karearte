// Illustrated floor plan of KaRe-Arte. Venue photos are intentionally not published.
// You enter from the office-building corridor at the bottom; the bar faces you.
// Left = big terrace. Right = marble steps up to the orange room. Past the green wall next to
// the bar = small terrace; its steps lead to the upper deck, which sits between it and the
// orange room. Units ≈ 2 cm. Proportions are approximate — Kalina can fix them in the admin (М4).
import type { L } from "@/lib/i18n";

export type ZoneId = "hall" | "orange" | "terrace" | "patio";
export type Zone = {
  id: ZoneId;
  name: L;
  short: L;
  desc: L;
  photos: string[];
  view: [number, number, number, number];
};

export type Shape = { kind: "round"; cx: number; cy: number; r: number } | { kind: "rect"; x: number; y: number; w: number; h: number; rx?: number };
export type TopStyle = "wood" | "wood-dark" | "marble" | "glass" | "iron" | "blue" | "metal" | "bar";
export type ChairStyle = "stool-leather" | "stool-black" | "stool-burgundy" | "wire-white" | "wire-yellow" | "bistro" | "armchair-orange" | "rattan" | "sofa-white" | "sofa-rattan" | "wood";
export type Table = {
  id: string;
  label: string;
  zone: ZoneId;
  shape: Shape;
  seats: number;
  chairs: { n: number; layout: "around" | "bottom" | "left" | "topbottom" | "leftright" | "sofas" | "sofa-top" };
  top: TopStyle;
  chair: ChairStyle;
  type: "high" | "low" | "lounge" | "bar";
  name: L;
  features: L;
  photos: string[];
  reservable: boolean;
};
export type PhotoSpot = { id: string; x: number; y: number; zone: ZoneId; name: L; photos: string[] };

export const PLAN_W = 1200;
export const PLAN_H = 900;

export const zones: Zone[] = [
  {
    id: "hall",
    name: { bg: "Основната зала", en: "Main hall" },
    short: { bg: "Залата", en: "Hall" },
    desc: { bg: "Барът от бели камъни, светлинната завеса, високите маси на килима и стъклените врати към голямата тераса.", en: "The white-stone bar, the light curtain, the high tables on the rug and the glass doors to the big terrace." },
    photos: [],
    view: [330, 200, 560, 640],
  },
  {
    id: "orange",
    name: { bg: "Оранжевата стая", en: "The orange room" },
    short: { bg: "Оранжевата", en: "Orange room" },
    desc: { bg: "По мраморните стъпала покрай Ван Гог. Дивани, оранжеви кресла и картини навсякъде.", en: "Up the marble steps past Van Gogh. Sofas, orange armchairs and paintings everywhere." },
    photos: [],
    view: [740, 450, 450, 420],
  },
  {
    id: "terrace",
    name: { bg: "Голямата тераса", en: "The big terrace" },
    short: { bg: "Голямата тераса", en: "Big terrace" },
    desc: { bg: "Просторен двор с мраморни и бистро маси, високи маси и белите плетени столове. Има отоплители.", en: "A spacious courtyard with marble and bistro tables, high tables and the white wire chairs. Heaters included." },
    photos: [],
    view: [10, 40, 400, 760],
  },
  {
    id: "patio",
    name: { bg: "Малката тераса", en: "The small terrace" },
    short: { bg: "Малката тераса", en: "Small terrace" },
    desc: { bg: "Ратанов кът под големия плакат, а по стълбите — горна площадка с жълтите столове.", en: "A rattan corner under the big poster, and up the steps an upper deck with the yellow chairs." },
    photos: [],
    view: [720, 10, 480, 490],
  },
];

export const tables: Table[] = [
  // Main hall
  { id: "bar", label: "БАР", zone: "hall", shape: { kind: "rect", x: 480, y: 262, w: 260, h: 44, rx: 6 }, seats: 6, chairs: { n: 6, layout: "bottom" }, top: "bar", chair: "stool-black", type: "bar", name: { bg: "Барът", en: "The bar" }, features: { bg: "Столове на бара, един от тях с велосипедни педали. Без резервация — сядаш, ако е свободно.", en: "Bar stools, one with bicycle pedals. Walk-in only." }, photos: [], reservable: false },
  { id: "1", label: "1", zone: "hall", shape: { kind: "rect", x: 404, y: 330, w: 50, h: 50, rx: 4 }, seats: 3, chairs: { n: 3, layout: "around" }, top: "wood", chair: "stool-leather", type: "high", name: { bg: "Маса 1", en: "Table 1" }, features: { bg: "Висока квадратна маса с кожени столове и лампион.", en: "High square table with leather stools and a floor lamp." }, photos: [], reservable: true },
  { id: "2", label: "2", zone: "hall", shape: { kind: "round", cx: 528, cy: 408, r: 30 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "wood", chair: "stool-leather", type: "high", name: { bg: "Маса 2", en: "Table 2" }, features: { bg: "Висока кръгла маса на персийския килим.", en: "High round table on the Persian rug." }, photos: [], reservable: true },
  { id: "3", label: "3", zone: "hall", shape: { kind: "round", cx: 652, cy: 408, r: 30 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "wood", chair: "stool-leather", type: "high", name: { bg: "Маса 3", en: "Table 3" }, features: { bg: "Висока маса със столовете с педали, срещу неона.", en: "High table with the pedal stools, facing the neon." }, photos: [], reservable: true },
  { id: "4", label: "4", zone: "hall", shape: { kind: "rect", x: 772, y: 330, w: 44, h: 150, rx: 4 }, seats: 6, chairs: { n: 6, layout: "left" }, top: "wood-dark", chair: "stool-black", type: "high", name: { bg: "Маса 4 · дългата", en: "Table 4 · the long one" }, features: { bg: "Дълга дървена маса с високи столове. За компания до 6.", en: "Long wooden table with high chairs. For up to 6." }, photos: [], reservable: true },
  { id: "5", label: "5", zone: "hall", shape: { kind: "round", cx: 452, cy: 600, r: 30 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "wood", chair: "stool-leather", type: "high", name: { bg: "Маса 5", en: "Table 5" }, features: { bg: "Висока кръгла маса с кожени столове.", en: "High round table with leather stools." }, photos: [], reservable: true },
  { id: "6", label: "6", zone: "hall", shape: { kind: "rect", x: 580, y: 590, w: 110, h: 60, rx: 4 }, seats: 4, chairs: { n: 4, layout: "topbottom" }, top: "wood", chair: "wood", type: "low", name: { bg: "Маса 6 · дървената", en: "Table 6 · the wooden one" }, features: { bg: "Ниска дървена маса — любима за лаптоп и разговори.", en: "Low wooden table — a favourite for laptops and long talks." }, photos: [], reservable: true },
  // Orange room
  { id: "7", label: "7", zone: "orange", shape: { kind: "rect", x: 960, y: 568, w: 80, h: 40, rx: 6 }, seats: 6, chairs: { n: 2, layout: "sofas" }, top: "glass", chair: "sofa-white", type: "lounge", name: { bg: "Маса 7 · диваните", en: "Table 7 · the sofas" }, features: { bg: "Два бели дивана и ниска маса. За компания до 6.", en: "Two white sofas and a low table. For up to 6." }, photos: [], reservable: true },
  { id: "8", label: "8", zone: "orange", shape: { kind: "round", cx: 1118, cy: 600, r: 20 }, seats: 2, chairs: { n: 2, layout: "around" }, top: "wood", chair: "armchair-orange", type: "lounge", name: { bg: "Маса 8 · оранжевите кресла", en: "Table 8 · the orange armchairs" }, features: { bg: "Оранжеви кресла и кръгла масичка за двама.", en: "Orange armchairs and a round side table for two." }, photos: [], reservable: true },
  { id: "9", label: "9", zone: "orange", shape: { kind: "rect", x: 1000, y: 704, w: 60, h: 44, rx: 4 }, seats: 4, chairs: { n: 4, layout: "leftright" }, top: "blue", chair: "armchair-orange", type: "low", name: { bg: "Маса 9 · синята", en: "Table 9 · the blue one" }, features: { bg: "Синята маса с въртящите се оранжеви кресла.", en: "The blue table with the orange swivel chairs." }, photos: [], reservable: true },
  // Big terrace
  { id: "T1", label: "T1", zone: "terrace", shape: { kind: "round", cx: 300, cy: 600, r: 24 }, seats: 2, chairs: { n: 2, layout: "around" }, top: "metal", chair: "bistro", type: "low", name: { bg: "T1", en: "T1" }, features: { bg: "Метална бистро маса за двама.", en: "A metal bistro table for two." }, photos: [], reservable: true },
  { id: "T2", label: "T2", zone: "terrace", shape: { kind: "round", cx: 140, cy: 590, r: 28 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "marble", chair: "stool-black", type: "high", name: { bg: "T2 · мраморната", en: "T2 · the marble one" }, features: { bg: "Висока мраморна маса.", en: "A high marble table." }, photos: [], reservable: true },
  { id: "T3", label: "T3", zone: "terrace", shape: { kind: "round", cx: 290, cy: 400, r: 26 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "marble", chair: "stool-burgundy", type: "high", name: { bg: "T3", en: "T3" }, features: { bg: "Висока маса с бордо столове.", en: "A high table with burgundy stools." }, photos: [], reservable: true },
  { id: "T4", label: "T4", zone: "terrace", shape: { kind: "round", cx: 130, cy: 390, r: 28 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "metal", chair: "bistro", type: "low", name: { bg: "T4", en: "T4" }, features: { bg: "Бистро маса за четирима.", en: "A bistro table for four." }, photos: [], reservable: true },
  { id: "T5", label: "T5", zone: "terrace", shape: { kind: "round", cx: 150, cy: 175, r: 28 }, seats: 4, chairs: { n: 4, layout: "around" }, top: "glass", chair: "wire-white", type: "lounge", name: { bg: "T5 · плетените столове", en: "T5 · the wire chairs" }, features: { bg: "Белите плетени столове-яйца около кръгла маса.", en: "The white wire egg chairs around a round table." }, photos: [], reservable: true },
  { id: "T6", label: "T6", zone: "terrace", shape: { kind: "round", cx: 300, cy: 225, r: 22 }, seats: 3, chairs: { n: 3, layout: "around" }, top: "metal", chair: "rattan", type: "low", name: { bg: "T6", en: "T6" }, features: { bg: "Маса с ратанов стол и отоплител.", en: "A table with a rattan chair and a heater." }, photos: [], reservable: true },
  // Small terrace (lower) + upper deck
  { id: "P1", label: "P1", zone: "patio", shape: { kind: "rect", x: 960, y: 112, w: 76, h: 36, rx: 4 }, seats: 4, chairs: { n: 1, layout: "sofa-top" }, top: "glass", chair: "sofa-rattan", type: "lounge", name: { bg: "P1 · ратановият диван", en: "P1 · the rattan sofa" }, features: { bg: "Ратанов диван и масичка под големия плакат.", en: "A rattan sofa and table under the big poster." }, photos: [], reservable: true },
  { id: "P2", label: "P2", zone: "patio", shape: { kind: "round", cx: 830, cy: 150, r: 18 }, seats: 2, chairs: { n: 2, layout: "around" }, top: "glass", chair: "rattan", type: "lounge", name: { bg: "P2 · ратановите столове", en: "P2 · the rattan chairs" }, features: { bg: "Два ратанови стола и стъклена масичка.", en: "Two rattan chairs and a glass side table." }, photos: [], reservable: true },
  { id: "P3", label: "P3", zone: "patio", shape: { kind: "round", cx: 925, cy: 340, r: 22 }, seats: 2, chairs: { n: 2, layout: "around" }, top: "iron", chair: "bistro", type: "low", name: { bg: "P3 · чугунената", en: "P3 · the cast-iron one" }, features: { bg: "Зелена чугунена маса за двама на горната площадка.", en: "A green cast-iron table for two on the upper deck." }, photos: [], reservable: true },
  { id: "P4", label: "P4", zone: "patio", shape: { kind: "round", cx: 1065, cy: 400, r: 22 }, seats: 3, chairs: { n: 3, layout: "around" }, top: "wood-dark", chair: "wire-yellow", type: "high", name: { bg: "P4 · жълтите столове", en: "P4 · the yellow chairs" }, features: { bg: "Жълти плетени столове и висока маса на горната площадка.", en: "Yellow wire chairs and a high table on the upper deck." }, photos: [], reservable: true },
];

export const photoSpots: PhotoSpot[] = [];

export const zoneOf = (id: ZoneId) => zones.find((z) => z.id === id)!;
