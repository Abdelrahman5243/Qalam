import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/features/site/components/placeholder-page";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  return <PlaceholderPage locale={locale} settings={await getSiteSettings(locale)} />;
}
