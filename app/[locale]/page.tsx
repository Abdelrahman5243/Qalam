import { notFound } from "next/navigation";

import { HeroEmptyState } from "@/features/hero/components/hero-empty-state";
import { HeroSection } from "@/features/hero/components/hero-section";
import { AboutSection } from "@/features/about/components/about-section";
import { getAbout } from "@/features/about/services/about-service";
import { HeroContactCta } from "@/features/hero/components/hero-contact-cta";
import { ServicesSection } from "@/features/services/components/services-section";
import { getServices } from "@/features/services/services/services-service";
import { WhySection } from "@/features/why/components/why-section";
import { getWhyChooseUs } from "@/features/why/services/why-service";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import { getProjects } from "@/features/projects/services/projects-service";
import { SiteFooter } from "@/features/site/components/site-footer";
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

  if (!hero) {
    return <HeroEmptyState />;
  }

  const about = await getAbout(locale, hero.image);
  const [services, why, projects] = await Promise.all([
    getServices(locale, hero.image),
    getWhyChooseUs(locale),
    getProjects(locale, hero.image),
  ]);

  return (
    <>
      <HeroSection hero={hero} locale={locale} settings={settings} />
      <AboutSection about={about} locale={locale} />
      <ServicesSection services={services} locale={locale} />
      <WhySection why={why} locale={locale} />
      <ProjectsSection projects={projects} locale={locale} />
      <HeroContactCta locale={locale} whatsappUrl={settings?.whatsappUrl} phone={settings?.phone} email={settings?.email} />
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
