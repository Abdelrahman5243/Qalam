import { notFound } from "next/navigation";

import { ProjectsPage } from "@/features/projects/components/projects-page";
import { getProjects } from "@/features/projects/services/projects-service";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { getHero } from "@/features/hero/services/hero-service";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { getFallbackBrandImage } from "@/lib/site-assets";

export default async function ProjectsRoute({
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
  const projects = await getProjects(
    locale,
    hero?.image || getFallbackBrandImage(locale),
  );

  return (
    <>
      <SiteHeader locale={locale} settings={settings} active="projects" />
      <ProjectsPage projects={projects} locale={locale} settings={settings} />
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
