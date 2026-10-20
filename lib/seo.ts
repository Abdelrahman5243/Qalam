import type { Metadata } from "next";
import type { Page, Settings } from "@/cms/sanity";
import { env } from "@/lib/env";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

export const siteName = "New website";

/** The slug of the page served at /{locale}. */
export const homeSlug = "home";

export const absoluteUrl = (path = "") => `${env.siteUrl}${path}`;

/** Site path of a page: the home page lives at /{locale}, others at /{locale}/{slug}. */
export const pagePath = (locale: Locale, slug = homeSlug) =>
  slug === homeSlug ? `/${locale}` : `/${locale}/${slug}`;

export const pageUrl = (locale: Locale, slug?: string) =>
  absoluteUrl(pagePath(locale, slug));

/** hreflang map: the same page in every language. */
export const languageAlternates = (slug?: string) => ({
  ...Object.fromEntries(
    locales.map((locale) => [locale, pageUrl(locale, slug)]),
  ),
  "x-default": pageUrl(defaultLocale, slug),
});

type MetadataOptions = { locale: Locale; slug: string; page: Page | null; settings: Settings | null };

/**
 * Title: the page's meta title as written, otherwise "Page title | Site title" (the home page uses the site title alone).
 * Description and share image: the page's own, otherwise the site-wide defaults.
 */
export function pageMetadata({ locale, slug, page, settings }: MetadataOptions): Metadata {
  const siteTitle = settings?.seo?.title || settings?.companyName || siteName;
  const isHome = slug === homeSlug;
  const title = page?.seo?.title || (isHome || !page?.title ? siteTitle : `${page.title} | ${siteTitle}`);
  const description = page?.seo?.description || settings?.seo?.description || undefined;
  const image = page?.seo?.image ?? settings?.seo?.image ?? settings?.logo;
  const url = page?.seo?.canonical || pageUrl(locale, slug);
  return {
    title: { absolute: title },
    description,
    robots: page?.seo?.noIndex ? { index: false, follow: true } : undefined,
    alternates: { canonical: url, languages: languageAlternates(slug) },
    openGraph: { type: "website", title, description, url, locale, siteName: siteTitle, images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image.url] : undefined },
  };
}

export const organizationJsonLd = (
  locale: Locale,
  settings: Settings | null,
) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: settings?.companyName || siteName,
  url: pageUrl(locale),
  logo: settings?.logo?.url,
  email: settings?.email ?? undefined,
});
