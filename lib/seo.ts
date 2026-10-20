import type { Metadata } from "next";
import type { Image } from "@/cms/define";
import type { Page, Settings } from "@/cms/sanity";
import { env } from "@/lib/env";
import { defaultLocale, locales, otherLocale, type Locale } from "@/lib/i18n";

/** Fallback name when Site settings are empty. */
export const siteName = "Website";

/** The slug of the page served at /{locale}. */
export const homeSlug = "home";

/** Open Graph wants language_TERRITORY. */
const ogLocales = { ar: "ar_EG", en: "en_US" } satisfies Record<Locale, string>;

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

/** Crop a Sanity CDN image to an exact size (the CDN resizes on the fly from URL params). */
export function cropImage(url: string, width: number, height = width) {
  const image = new URL(url);
  image.searchParams.set("w", String(width));
  image.searchParams.set("h", String(height));
  image.searchParams.set("fit", "crop");
  return image.toString();
}

export const siteTitle = (settings: Settings | null) =>
  settings?.seo?.title || settings?.companyName || siteName;

const shareImage = (image: Image | null | undefined, fallbackAlt: string) =>
  image
    ? [
        {
          url: cropImage(image.url, 1200, 630),
          width: 1200,
          height: 630,
          alt: image.alt || fallbackAlt,
        },
      ]
    : undefined;

/** Site-wide metadata (layout level): icons, verification, defaults every page starts from. */
export function siteMetadata(settings: Settings | null): Metadata {
  const name = siteTitle(settings);
  const favicon = settings?.favicon;
  return {
    metadataBase: new URL(env.siteUrl),
    applicationName: name,
    title: name,
    description: settings?.seo?.description || undefined,
    icons: favicon
      ? {
          icon: [32, 192].map((size) => ({
            url: cropImage(favicon.url, size),
            sizes: `${size}x${size}`,
            type: "image/png",
          })),
          apple: { url: cropImage(favicon.url, 180), sizes: "180x180" },
        }
      : { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
    verification: settings?.seo?.googleVerification
      ? { google: settings.seo.googleVerification }
      : undefined,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

type PageOptions = {
  locale: Locale;
  slug: string;
  page: Page | null;
  settings: Settings | null;
};

/**
 * Page metadata. Title: the page's meta title as written, otherwise "Page title | Site title"
 * (the home page uses the site title alone). Description and share image fall back to the site defaults.
 */
export function pageMetadata({
  locale,
  slug,
  page,
  settings,
}: PageOptions): Metadata {
  const site = siteTitle(settings);
  const title =
    page?.seo?.title ||
    (slug === homeSlug || !page?.title ? site : `${page.title} | ${site}`);
  const description =
    page?.seo?.description || settings?.seo?.description || undefined;
  const image = page?.seo?.image ?? settings?.seo?.image ?? settings?.logo;
  const url = page?.seo?.canonical || pageUrl(locale, slug);
  const images = shareImage(image, title);
  return {
    title: { absolute: title },
    description,
    robots: page?.seo?.noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { "max-image-preview": "large", "max-snippet": -1 },
        },
    alternates: { canonical: url, languages: languageAlternates(slug) },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: site,
      locale: ogLocales[locale],
      alternateLocale: ogLocales[otherLocale(locale)],
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}

/**
 * Structured data for Google (schema.org JSON-LD): who publishes the site, the site itself,
 * this page, and its breadcrumb trail.
 */
export function pageJsonLd({ locale, slug, page, settings }: PageOptions) {
  const site = siteTitle(settings);
  const home = pageUrl(locale);
  const url = pageUrl(locale, slug);
  const ids = {
    organization: `${absoluteUrl()}#organization`,
    website: `${absoluteUrl()}#website`,
  };
  const profiles = settings?.seo?.profiles
    ?.map((profile) => profile.url)
    .filter(Boolean);

  const graph: object[] = [
    {
      "@type": "Organization",
      "@id": ids.organization,
      name: settings?.companyName || site,
      url: home,
      logo: settings?.logo?.url,
      email: settings?.email || undefined,
      sameAs: profiles?.length ? profiles : undefined,
    },
    {
      "@type": "WebSite",
      "@id": ids.website,
      name: site,
      url: home,
      inLanguage: locale,
      publisher: { "@id": ids.organization },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: page?.title || site,
      description:
        page?.seo?.description || settings?.seo?.description || undefined,
      url,
      inLanguage: locale,
      isPartOf: { "@id": ids.website },
    },
  ];
  if (slug !== homeSlug && page?.title) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: site, item: home },
        { "@type": "ListItem", position: 2, name: page.title, item: url },
      ],
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
