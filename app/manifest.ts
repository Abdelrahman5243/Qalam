import type { MetadataRoute } from "next";
import { defaultLocale } from "@/lib/i18n";
import { siteName } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: "#111113",
    theme_color: "#111113",
  };
}
