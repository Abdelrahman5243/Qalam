import type { MetadataRoute } from "next";
import { getIndexablePages } from "@/cms/sanity";
import { locales } from "@/lib/i18n";
import { languageAlternates, pageUrl } from "@/lib/seo";

// Pages are added from the dashboard, so refresh the list hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getIndexablePages();
  return pages.flatMap(({ slug, updatedAt }) =>
    locales.map((locale) => ({
      url: pageUrl(locale, slug),
      lastModified: updatedAt,
      alternates: { languages: languageAlternates(slug) },
    })),
  );
}
