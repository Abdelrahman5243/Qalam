import type { Metadata } from "next";
import type { ReactNode } from "react";

import { defaultLocale, getDirection, isLocale, type Locale } from "@/lib/i18n";
import { getSiteSettings } from "@/features/site/services/site-settings-service";

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
    openGraph: settings?.seo.ogImage
      ? {
          title: settings.seo.title || settings.companyName,
          description: settings.seo.description || fallbackDescription,
          images: [{ url: settings.seo.ogImage.url, alt: settings.seo.ogImage.alt }],
        }
      : undefined,
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : defaultLocale;

  return (
    <div lang={locale} dir={getDirection(locale)} className={`min-h-full ${locale === "ar" ? "locale-ar" : "locale-en"}`}>
      {children}
    </div>
  );
}
