import type { MetadataRoute } from "next";

import { sanityClient } from "@/lib/sanity/config";
import { absoluteUrl } from "@/lib/seo";
import { normalizeContentSlug } from "@/lib/content-slug";

export const revalidate = 3600;

const locales = ["ar", "en"] as const;

const routes = ["", "/about", "/services", "/projects", "/cabin-designs-2026", "/contact"] as const;

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

function staticEntries(data?: SitemapData): MetadataRoute.Sitemap {
  const lastModifiedByRoute: Record<string, string | undefined> = {
    "/services": data?.services?._updatedAt,
    "/projects": data?.projects?._updatedAt,
    "/cabin-designs-2026": data?.cabinGallery?._updatedAt,
  };

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: absoluteUrl("/" + locale + route),
      alternates: localizedAlternates(route),
      ...(lastModifiedByRoute[route] ? { lastModified: lastModifiedByRoute[route] } : {}),
    })),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!sanityClient.config().projectId) return staticEntries();

  try {
    const data = await sanityClient.fetch<SitemapData>(sitemapQuery);
    const entries = staticEntries(data);
    const dynamicEntries = locales.flatMap((locale) => [
      ...(data.services?.items ?? []).flatMap((item) => {
        if (!item.slug || (!item.title && !item.arabicTitle)) return [];
        const slug = normalizeContentSlug(item.slug);
        return [{
          url: absoluteUrl("/" + locale + "/services/" + encodeURIComponent(slug)),
          alternates: localizedAlternates("/services/" + encodeURIComponent(slug)),
        }];
      }),
      ...(data.projects?.items ?? []).flatMap((item) => {
        if (!item.slug || (!item.title && !item.arabicTitle)) return [];
        const slug = normalizeContentSlug(item.slug);
        return [{
          url: absoluteUrl("/" + locale + "/projects/" + encodeURIComponent(slug)),
          alternates: localizedAlternates("/projects/" + encodeURIComponent(slug)),
        }];
      }),
    ]);
    return [...entries, ...dynamicEntries];
  } catch (error) {
    console.error("Unable to load dynamic sitemap entries from Sanity", error);
    return staticEntries();
  }
}
