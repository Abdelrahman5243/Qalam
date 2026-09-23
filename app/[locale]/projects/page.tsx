import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectsPage } from "@/features/projects/components/projects-page";
import { getProjects } from "@/features/projects/services/projects-service";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "ar";
  const settings = await getSiteSettings(locale);
  return createPageMetadata({ locale, path: `/${locale}/projects`, title: locale === "ar" ? "مشاريع المصاعد | أعمالنا" : "Elevator Projects | Our Work", description: locale === "ar" ? "استكشف مشاريع المصاعد التي نفذناها بخبرة هندسية وحلول مصممة للمساحات الحقيقية." : "Explore elevator projects delivered with engineering expertise and solutions designed for real spaces.", settings });
}

export default async function ProjectsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const settings = await getSiteSettings(locale);
  const projects = await getProjects(locale, "all");

  return (
    <>
      <SiteHeader locale={locale} settings={settings} active="projects" />
      <ProjectsPage projects={projects} locale={locale} settings={settings} />
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
