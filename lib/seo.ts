import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import { publicConfig } from "@/config/public";
import { cleanSanityText } from "@/lib/sanity/text";

export const siteUrl = publicConfig.siteUrl.replace(/\/$/, "");
export const metadataBase = new URL(siteUrl);

export function absoluteUrl(path = "") {
  return new URL(path.replace(/^\/+/, "/"), metadataBase).toString();
}

type PageMetadataOptions = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  settings?: SiteSettings | null;
  image?: { url: string; alt?: string } | null;
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  settings,
  image: pageImage,
}: PageMetadataOptions): Metadata {
  const cleanTitle = cleanSanityText(title);
  const cleanDescription = cleanSanityText(description);
  const image = settings?.seo.ogImage || pageImage;
  const canonical = absoluteUrl(path);
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const alternatePath = path.replace(
    /^\/(ar|en)(?=\/|$)/,
    `/${alternateLocale}`,
  );
  return {
    title: cleanTitle,
    description: cleanDescription,
    alternates: {
      canonical,
      languages: {
        [locale]: canonical,
        [alternateLocale]: absoluteUrl(alternatePath),
        "x-default": absoluteUrl(path.replace(/^\/(ar|en)(?=\/|$)/, "/ar")),
      },
    },
    openGraph: {
      type: "website",
      title: cleanTitle,
      description: cleanDescription,
      url: canonical,
      siteName: settings?.companyName || "New website",
      locale,
      ...(image ? { images: [{ url: image.url, alt: image.alt || cleanTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      ...(image ? { images: [image.url] } : {}),
    },
    robots: { index: true, follow: true },
  };
}
