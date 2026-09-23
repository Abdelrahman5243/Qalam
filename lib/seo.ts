import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://next-generation-elevators.vercel.app";
export const metadataBase = new URL(siteUrl);

export function absoluteUrl(path = "") {
  return new URL(path.replace(/^\/+/, "/"), metadataBase).toString();
}

type PageMetadataOptions = { locale: Locale; path: string; title: string; description: string; settings?: SiteSettings | null };

export function createPageMetadata({ locale, path, title, description, settings }: PageMetadataOptions): Metadata {
  const image = settings?.seo.ogImage;
  const canonical = absoluteUrl(path);
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const alternatePath = path.replace(/^\/(ar|en)(?=\/|$)/, `/${alternateLocale}`);
  return {
    title, description,
    alternates: { canonical, languages: { [locale]: canonical, [alternateLocale]: absoluteUrl(alternatePath), "x-default": absoluteUrl(path.replace(/^\/(ar|en)(?=\/|$)/, "/ar")) } },
    openGraph: { type: "website", title, description, url: canonical, siteName: "Next Generation Elevators", locale, images: [{ url: image?.url || absoluteUrl("/og/og-image-1200x630.png"), alt: image?.alt || title }] },
    twitter: { card: "summary_large_image", title, description, images: [image?.url || absoluteUrl("/og/og-image-1200x630.png")] },
    robots: { index: true, follow: true },
  };
}
