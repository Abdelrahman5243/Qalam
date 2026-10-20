import type { MetadataRoute } from "next";
import { getSettings } from "@/cms/sanity";
import { defaultLocale } from "@/lib/i18n";
import { cropImage, siteTitle } from "@/lib/seo";

// Rebuilt hourly so name and icon follow Site settings.
export const revalidate = 3600;

/** Web app manifest (install / add to home screen), built from Site settings. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings(defaultLocale);
  const favicon = settings?.favicon;
  return {
    name: siteTitle(settings),
    short_name: settings?.companyName || siteTitle(settings),
    description: settings?.seo?.description || undefined,
    start_url: `/${defaultLocale}`,
    lang: defaultLocale,
    dir: "rtl",
    display: "standalone",
    background_color: "#111113",
    theme_color: "#111113",
    icons: favicon
      ? [192, 512].map((size) => ({
          src: cropImage(favicon.url, size),
          sizes: `${size}x${size}`,
          type: "image/png",
        }))
      : [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
