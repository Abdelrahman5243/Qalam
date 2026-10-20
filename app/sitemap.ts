import type { MetadataRoute } from "next";
import { getPageSlugs } from "@/cms/sanity";
import { locales } from "@/lib/i18n";
import { languageAlternates, pageUrl } from "@/lib/seo";

// Pages are added from the dashboard, so refresh the list hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPageSlugs();
  return slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: pageUrl(locale, slug),
      alternates: { languages: languageAlternates(slug) },
    })),
  );
}
