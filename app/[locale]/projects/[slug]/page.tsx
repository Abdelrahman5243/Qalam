import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/features/projects/components/project-detail-page";
import { getProjectBySlug } from "@/features/projects/services/projects-service";
import { SiteHeader } from "@/features/site/components/site-header";
import { SiteFooter } from "@/features/site/components/site-footer";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: value, slug } = await params; const locale = isLocale(value) ? value : "ar"; const project = await getProjectBySlug(locale, slug);
  return { title: project?.title || (locale === "ar" ? "المشروع" : "Project"), description: project?.location };
}
export default async function ProjectRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params; if (!isLocale(value)) notFound(); const locale: Locale = value;
  const [settings, project] = await Promise.all([getSiteSettings(locale), getProjectBySlug(locale, slug)]); if (!project) notFound();
  return <><SiteHeader locale={locale} settings={settings} active="projects" /><ProjectDetailPage project={project} locale={locale} settings={settings} /><SiteFooter locale={locale} settings={settings} /></>;
}
