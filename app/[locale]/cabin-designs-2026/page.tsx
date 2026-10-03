import type { Metadata } from "next";
import { CabinGalleryPage } from "@/features/cabin-gallery/components/cabin-gallery-page";
import { getCabinGallery } from "@/features/cabin-gallery/services/cabin-gallery-service";
import { SitePage } from "@/features/site/components/site-page";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : "ar";
  const settings = await getSiteSettings(locale);
  return createPageMetadata({
    locale,
    path: "/" + locale + "/cabin-designs-2026",
    title: locale === "ar" ? "ديكورات كبائن 2026" : "Cabin Designs 2026",
    description:
      locale === "ar"
        ? "استكشف تصاميم وتشطيبات كبائن المصاعد."
        : "Explore elevator cabin designs and finishes.",
    settings,
  });
}

export default async function CabinGalleryRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) return null;
  const locale: Locale = value;
  const [settings, gallery] = await Promise.all([
    getSiteSettings(locale),
    getCabinGallery(locale),
  ]);

  return (
    <SitePage locale={locale} settings={settings}>
      <CabinGalleryPage gallery={gallery} locale={locale} settings={settings} />
    </SitePage>
  );
}
