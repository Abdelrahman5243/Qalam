import { notFound } from "next/navigation";
import { LandingPage } from "@/features/site/components/landing-page";
import { getHomeHero } from "@/features/site/services/home-hero-service";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const [hero, settings] = await Promise.all([getHomeHero(locale), getSiteSettings(locale)]);
  return <LandingPage locale={locale} hero={hero} logo={settings?.logo ?? null} />;
}
