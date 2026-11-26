import list from "@/content/media.json";
import gen from "@/content/media.generated.json";

export type MediaItem = (typeof list)[number] & { color: string; max: number };
const g = gen as Record<string, { w: number; h: number; color: string; max: number }>;

export const media: Record<string, MediaItem> = Object.fromEntries(
  list.map((m) => [m.id, { ...m, w: g[m.id]?.w || m.w, h: g[m.id]?.h || m.h, color: g[m.id]?.color ?? "#888", max: g[m.id]?.max ?? 960 }]),
);
export const mediaList = Object.values(media);

const WIDTHS = [480, 960, 1600];
export function srcSet(id: string) {
  const m = media[id];
  if (!m) throw new Error(`Unknown media id: ${id}`);
  const ws = WIDTHS.filter((w) => w <= m.max);
  return {
    src: `/img/${id}-${ws[Math.min(1, ws.length - 1)]}.webp`,
    srcSet: ws.map((w) => `/img/${id}-${w}.webp ${w}w`).join(", "),
  };
}
