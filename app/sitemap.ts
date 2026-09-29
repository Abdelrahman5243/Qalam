import type { MetadataRoute } from "next";

import { sanityClient } from "@/lib/sanity/config";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const locales = ["ar", "en"] as const;

const routes = [
  { route: "", changeFrequency: "weekly", priority: 1 },
  { route: "/about", changeFrequency: "monthly", priority: 0.7 },
  { route: "/services", changeFrequency: "weekly", priority: 0.8 },
  { route: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { route: "/cabin-designs-2026", changeFrequency: "monthly", priority: 0.7 },
  { route: "/contact", changeFrequency: "monthly", priority: 0.7 },
] as const;

type SitemapDocument = {
  _updatedAt?: string;
  items?: Array<{
    slug?: string | null;
    arabicTitle?: string | null;
    title?: string | null;
  }> | null;
};

type SitemapData = {
  services?: SitemapDocument | null;
  projects?: SitemapDocument | null;
  cabinGallery?: { _updatedAt?: string } | null;
};

const sitemapQuery = [
  "{",
  '  "services": *[_type == "services"][0]{',
  "    _updatedAt,",
  '    items[]{ "slug": slug.current, "arabicTitle": title.ar, "title": title.en }',
  "  },",
  '  "projects": *[_type == "projects"][0]{',
  "    _updatedAt,",
  '    items[]{ "slug": slug.current, "arabicTitle": title.ar, "title": title.en }',
  "  },",
  '  "cabinGallery": *[_type == "cabinGallery"][0]{ _updatedAt }',
  "}",
].join("\n");

function localizedAlternates(route: string) {
  return { languages: Object.fromEntries([...locales.map((locale) => [locale, absoluteUrl("/" + locale + route)]), ["x-default", absoluteUrl("/ar" + route)]]) };
}

function staticEntries(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map(({ route, changeFrequency, priority }) => ({
      url: absoluteUrl("/" + locale + route),
      alternates: localizedAlternates(route),
      changeFrequency,
      priority,
    })),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = staticEntries();
  if (!sanityClient.config().projectId) return entries;

  try {
    const data = await sanityClient.fetch<SitemapData>(sitemapQuery);
    const dynamicEntries = locales.flatMap((locale) => [
      ...(data.services?.items ?? []).flatMap((item) => {
        if (!item.slug || (!item.title && !item.arabicTitle)) return [];
        const slug = item.slug;
        return [{
          url: absoluteUrl("/" + locale + "/services/" + encodeURIComponent(slug)),
          alternates: localizedAlternates("/services/" + encodeURIComponent(slug)),
          lastModified: data.services?._updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }];
      }),
      ...(data.projects?.items ?? []).flatMap((item) => {
        if (!item.slug || (!item.title && !item.arabicTitle)) return [];
        const slug = item.slug;
        return [{
          url: absoluteUrl("/" + locale + "/projects/" + encodeURIComponent(slug)),
          alternates: localizedAlternates("/projects/" + encodeURIComponent(slug)),
          lastModified: data.projects?._updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }];
      }),
    ]);
    return [...entries, ...dynamicEntries];
  } catch (error) {
    console.error("Unable to load dynamic sitemap entries from Sanity", error);
    return entries;
  }
}
