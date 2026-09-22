import type { Metadata } from "next";
import type { ReactNode } from "react";

import { defaultLocale, getDirection, isLocale, type Locale } from "@/lib/i18n";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { siteAssets } from "@/lib/site-assets";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : defaultLocale;

  const settings = await getSiteSettings(locale);
  const fallbackTitle = locale === "ar" ? "شركة المصاعد" : "Next Generation Elevators";
  const fallbackDescription = locale === "ar"
    ? "حلول المصاعد والتركيب والصيانة للمشاريع السكنية والتجارية."
    : "Elevator installation, maintenance, and modern mobility solutions for your building.";

  return {
    title: settings?.seo.title || settings?.companyName || fallbackTitle,
    description: settings?.seo.description || fallbackDescription,
    icons: {
      icon: [
        { url: siteAssets.favicon16, sizes: "16x16", type: "image/png" },
        { url: siteAssets.favicon32, sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: siteAssets.appleTouchIcon, sizes: "180x180", type: "image/png" }],
    },
    alternates: { canonical: `/${locale}` },
    openGraph: {
      title: settings?.seo.title || settings?.companyName || fallbackTitle,
      description: settings?.seo.description || fallbackDescription,
      images: [{
        url: settings?.seo.ogImage?.url || siteAssets.logoWhiteBackground,
        alt: settings?.seo.ogImage?.alt || `${settings?.companyName || fallbackTitle} logo`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.seo.title || settings?.companyName || fallbackTitle,
      description: settings?.seo.description || fallbackDescription,
      images: [settings?.seo.ogImage?.url || siteAssets.logoWhiteBackground],
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : defaultLocale;
  const settings = await getSiteSettings(locale);
  const fallbackCompanyName = locale === "ar" ? "شركة المصاعد" : "Next Generation Elevators";
  const companyName = settings?.companyName || fallbackCompanyName;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: `/${locale}`,
    logo: settings?.logo.url || siteAssets.logoTransparent,
    telephone: settings?.phone || undefined,
    email: settings?.email || undefined,
    sameAs: settings?.socialLinks.map((link) => link.url) || [],
  };

  return (
    <div lang={locale} dir={getDirection(locale)} className={`min-h-full ${locale === "ar" ? "locale-ar" : "locale-en"}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {children}
    </div>
  );
}
