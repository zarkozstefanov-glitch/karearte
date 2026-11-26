import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { routes } from "@/lib/i18n";
import { events } from "@/content/events";
import { posts } from "@/content/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...Object.values(routes), ...events.map((e) => `/events/${e.slug}/`), ...posts.map((p) => `/vlog/${p.slug}/`)];
  return paths.map((p) => ({
    url: `${site.url}${p}`,
    alternates: { languages: { bg: `${site.url}${p}`, en: `${site.url}/en${p}` } },
  }));
}
