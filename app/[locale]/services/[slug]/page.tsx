import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/features/services/components/service-detail-page";
import { getServiceBySlug } from "@/features/services/services/services-service";
import { SitePage } from "@/features/site/components/site-page";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata, absoluteUrl } from "@/lib/seo";
import { cleanSanityText } from "@/lib/sanity/text";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = isLocale(value) ? value : "ar";
  const [service, settings] = await Promise.all([
    getServiceBySlug(locale, slug),
    getSiteSettings(locale),
  ]);
  return createPageMetadata({
    locale,
    path: `/${locale}/services/${encodeURIComponent(slug)}`,
    title: service?.title || (locale === "ar" ? "الخدمة" : "Service"),
    description:
      service?.description ||
      (locale === "ar"
        ? "حلول مصاعد متخصصة للمباني والمشاريع."
        : "Specialized elevator solutions for buildings and projects."),
    settings,
    image: service?.image,
  });
}
export default async function ServiceRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const [settings, service] = await Promise.all([
    getSiteSettings(locale),
    getServiceBySlug(locale, slug),
  ]);
  if (!service) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cleanSanityText(service.title),
    description: cleanSanityText(service.description),
    image: service.image.url,
    url: absoluteUrl(
      `/${locale}/services/${encodeURIComponent(cleanSanityText(service.slug))}`,
    ),
    provider: {
      "@type": "Organization",
      name: cleanSanityText(
        settings?.companyName || "Next Generation Elevators",
      ),
      url: absoluteUrl(`/${locale}`),
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SitePage locale={locale} settings={settings} active="services">
        <ServiceDetailPage
          service={service}
          locale={locale}
          settings={settings}
        />
      </SitePage>
    </>
  );
}
