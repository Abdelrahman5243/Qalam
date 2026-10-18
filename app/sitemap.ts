import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["ar", "en"].map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    alternates: {
      languages: { ar: absoluteUrl("/ar"), en: absoluteUrl("/en"), "x-default": absoluteUrl("/ar") },
    },
  }));
}
