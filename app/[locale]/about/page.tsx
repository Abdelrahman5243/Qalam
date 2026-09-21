import { notFound } from "next/navigation";

import { AboutSection } from "@/features/about/components/about-section";
import { getAbout } from "@/features/about/services/about-service";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { PageIntro } from "@/features/site/components/page-intro";
import { getHero } from "@/features/hero/services/hero-service";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function AboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const [hero, settings] = await Promise.all([getHero(locale), getSiteSettings(locale)]);
  const fallbackImage = hero?.image || { url: "/logo.png", alt: "Company" };
  const about = await getAbout(locale, fallbackImage);

  const isArabic = locale === "ar";

  return (
    <>
      <SiteHeader locale={locale} settings={settings} active="about" />
      <main className="inner-page" dir={isArabic ? "rtl" : "ltr"}>
        <PageIntro eyebrow={isArabic ? "من نحن" : "About us"} title={isArabic ? "خبرة تُبنى عليها الثقة" : "Experience built around trust"} description={isArabic ? "نتكامل مع عملائنا لتقديم حلول مصاعد آمنة وفعالة ومصممة لتدوم." : "We work alongside our clients to deliver safe, efficient elevator solutions built to last."} />
        <AboutSection about={about} locale={locale} />
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
