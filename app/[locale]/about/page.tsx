import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutSection } from "@/features/about/components/about-section";
import { VisionSection } from "@/features/about/components/vision-section";
import { MissionSection } from "@/features/about/components/mission-section";
import { QualitySafetySection } from "@/features/about/components/quality-safety-section";
import { ValuesSection } from "@/features/about/components/values-section";
import { ClientsSection } from "@/features/about/components/clients-section";
import { getAbout } from "@/features/about/services/about-service";
import { getVision } from "@/features/about/services/vision-service";
import { getAboutSections } from "@/features/about/services/about-sections-service";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { PageIntro } from "@/features/site/components/page-intro";
import { getHero } from "@/features/hero/services/hero-service";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { getFallbackBrandImage } from "@/lib/site-assets";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "ar";
  const settings = await getSiteSettings(locale);
  return createPageMetadata({ locale, path: `/${locale}/about`, title: locale === "ar" ? "من نحن | خبرة تُبنى عليها الثقة" : "About Us | Experience Built Around Trust", description: locale === "ar" ? "تعرّف إلى خبرتنا وقيمنا ونهجنا في تقديم حلول مصاعد آمنة وفعالة." : "Learn about our experience, values, and approach to safe and efficient elevator solutions.", settings });
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const [hero, settings] = await Promise.all([
    getHero(locale),
    getSiteSettings(locale),
  ]);
  const fallbackImage = hero?.image || getFallbackBrandImage(locale);
  const [about, vision, aboutSections] = await Promise.all([
    getAbout(locale, fallbackImage),
    getVision(locale),
    getAboutSections(locale),
  ]);

  const isArabic = locale === "ar";

  return (
    <>
      <SiteHeader locale={locale} settings={settings} active="about" />
      <main className="inner-page" dir={isArabic ? "rtl" : "ltr"}>
        <PageIntro
          settings={settings} locale={locale}
          eyebrow={isArabic ? "من نحن" : "About us"}
          title={
            isArabic
              ? "خبرة تُبنى عليها الثقة"
              : "Experience built around trust"
          }
          description={
            isArabic
              ? "نتكامل مع عملائنا لتقديم حلول مصاعد آمنة وفعالة ومصممة لتدوم."
              : "We work alongside our clients to deliver safe, efficient elevator solutions built to last."
          }
        />
        <AboutSection about={about} locale={locale} showCta={false} />
        <MissionSection mission={aboutSections.mission} locale={locale} />
        <VisionSection vision={vision} locale={locale} />
        <QualitySafetySection content={aboutSections.qualitySafety} locale={locale} />
        <ValuesSection values={aboutSections.values} locale={locale} />
        <ClientsSection clients={aboutSections.clients} locale={locale} />
      </main>
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
