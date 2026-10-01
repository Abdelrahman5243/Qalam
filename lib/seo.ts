import type { Metadata } from "next";
import { stegaClean } from "@sanity/client/stega";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
export const metadataBase = new URL(siteUrl);

export function absoluteUrl(path = "") {
  return new URL(path.replace(/^\/+/, "/"), metadataBase).toString();
}

type PageMetadataOptions = { locale: Locale; path: string; title: string; description: string; settings?: SiteSettings | null; image?: { url: string; alt?: string } | null };

export function createPageMetadata({ locale, path, title, description, settings, image: pageImage }: PageMetadataOptions): Metadata {
  const cleanTitle = stegaClean(title);
  const cleanDescription = stegaClean(description);
  const image = settings?.seo.ogImage || pageImage;
  const canonical = absoluteUrl(path);
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const alternatePath = path.replace(/^\/(ar|en)(?=\/|$)/, `/${alternateLocale}`);
  return {
    title: cleanTitle, description: cleanDescription,
    alternates: { canonical, languages: { [locale]: canonical, [alternateLocale]: absoluteUrl(alternatePath), "x-default": absoluteUrl(path.replace(/^\/(ar|en)(?=\/|$)/, "/ar")) } },
    openGraph: { type: "website", title: cleanTitle, description: cleanDescription, url: canonical, siteName: "مصاعد الجيل القادم", locale, images: [{ url: image?.url || absoluteUrl("/og/og-image-1200x630.png"), alt: image?.alt || cleanTitle }] },
    twitter: { card: "summary_large_image", title: cleanTitle, description: cleanDescription, images: [image?.url || absoluteUrl("/og/og-image-1200x630.png")] },
    robots: { index: true, follow: true },
  };
}
