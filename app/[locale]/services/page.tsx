import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicesPage } from "@/features/services/components/services-page";
import { getServices } from "@/features/services/services/services-service";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "ar";
  const settings = await getSiteSettings(locale);
  return createPageMetadata({ locale, path: `/${locale}/services`, title: locale === "ar" ? "خدمات المصاعد | توريد وتركيب وصيانة" : "Elevator Services | Supply, Installation & Maintenance", description: locale === "ar" ? "حلول متكاملة لتوريد وتركيب وصيانة المصاعد للمباني السكنية والتجارية والطبية." : "Integrated elevator supply, installation, and maintenance solutions for residential, commercial, and healthcare buildings.", settings });
}

export default async function ServicesRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const settings = await getSiteSettings(locale);
  const services = await getServices(locale, "all");

  return (
    <>
      <SiteHeader locale={locale} settings={settings} active="services" />
      <ServicesPage services={services} locale={locale} settings={settings} />
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
