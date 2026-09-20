import { notFound } from "next/navigation";

import { HeroEmptyState } from "@/features/hero/components/hero-empty-state";
import { HeroSection } from "@/features/hero/components/hero-section";
import { getHero } from "@/features/hero/services/hero-service";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;

  if (!isLocale(value)) {
    notFound();
  }

  const locale: Locale = value;
  const [hero, settings] = await Promise.all([getHero(locale), getSiteSettings(locale)]);

  return hero ? <HeroSection hero={hero} locale={locale} settings={settings} /> : <HeroEmptyState />;
}
