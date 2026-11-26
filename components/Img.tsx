import { media, srcSet } from "@/lib/media";
import type { Lang } from "@/lib/i18n";

type Props = {
  id: string;
  lang: Lang;
  sizes?: string;
  className?: string;
  priority?: boolean;
  alt?: string;
};

/** Responsive WebP image with a dominant-colour placeholder and intrinsic size (no CLS). */
export function Img({ id, lang, sizes = "100vw", className, priority, alt }: Props) {
  const m = media[id];
  const { src, srcSet: set } = srcSet(id);
  return (
    <img
      src={src}
      srcSet={set}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt ?? m[lang]}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={{ backgroundColor: m.color }}
    />
  );
}
