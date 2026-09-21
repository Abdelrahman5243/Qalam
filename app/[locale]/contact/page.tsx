import { notFound } from "next/navigation";

import { ContactPage } from "@/features/contact/components/contact-page";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function ContactRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;

  if (!isLocale(value)) {
    notFound();
  }

  const locale: Locale = value;
  const settings = await getSiteSettings(locale);

  return (
    <>
      <SiteHeader locale={locale} settings={settings} active="contact" />
      <ContactPage locale={locale} settings={settings} />
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
