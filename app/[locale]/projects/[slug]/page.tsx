import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailPage } from "@/features/projects/components/project-detail-page";
import { getProjectBySlug } from "@/features/projects/services/projects-service";
import { SitePage } from "@/features/site/components/site-page";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata, absoluteUrl } from "@/lib/seo";
import { cleanSanityText } from "@/lib/sanity/text";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = isLocale(value) ? value : "ar";
  const [project, settings] = await Promise.all([
    getProjectBySlug(locale, slug),
    getSiteSettings(locale),
  ]);
  return createPageMetadata({
    locale,
    path: `/${locale}/projects/${encodeURIComponent(slug)}`,
    title: project?.title || (locale === "ar" ? "المشروع" : "Project"),
    description:
      project?.location ||
      (locale === "ar"
        ? "مشروع من أعمالنا في حلول المصاعد."
        : "One of our elevator solution projects."),
    settings,
    image: project?.image,
  });
}
export default async function ProjectRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const [settings, project] = await Promise.all([
    getSiteSettings(locale),
    getProjectBySlug(locale, slug),
  ]);
  if (!project) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: cleanSanityText(project.title),
    description: cleanSanityText(project.location),
    image: project.image.url,
    url: absoluteUrl(
      `/${locale}/projects/${encodeURIComponent(cleanSanityText(project.slug))}`,
    ),
    creator: {
      "@type": "Organization",
      name: cleanSanityText(
        settings?.companyName || "Next Generation Elevators",
      ),
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SitePage locale={locale} settings={settings} active="projects">
        <ProjectDetailPage
          project={project}
          locale={locale}
          settings={settings}
        />
      </SitePage>
    </>
  );
}
