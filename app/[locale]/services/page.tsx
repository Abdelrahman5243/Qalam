import { notFound } from "next/navigation";

import { ServicesPage } from "@/features/services/components/services-page";
import { getServices } from "@/features/services/services/services-service";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";

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
