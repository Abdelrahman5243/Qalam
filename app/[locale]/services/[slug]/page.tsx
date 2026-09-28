import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/features/services/components/service-detail-page";
import { getServiceBySlug } from "@/features/services/services/services-service";
import { SiteHeader } from "@/features/site/components/site-header";
import { SiteFooter } from "@/features/site/components/site-footer";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: value, slug } = await params; const locale = isLocale(value) ? value : "ar"; const service = await getServiceBySlug(locale, slug);
  return { title: service?.title || (locale === "ar" ? "الخدمة" : "Service"), description: service?.description };
}
export default async function ServiceRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params; if (!isLocale(value)) notFound(); const locale: Locale = value;
  const [settings, service] = await Promise.all([getSiteSettings(locale), getServiceBySlug(locale, slug)]); if (!service) notFound();
  return <><SiteHeader locale={locale} settings={settings} active="services" /><ServiceDetailPage service={service} locale={locale} settings={settings} /><SiteFooter locale={locale} settings={settings} /></>;
}
