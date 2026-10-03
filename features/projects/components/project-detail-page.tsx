import siteStyles from "@/features/site/components/site.module.css";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { ProjectItem } from "@/features/projects/types";
import { DetailPageLayout } from "@/features/site/components/detail-page-layout";
import { RichContent } from "@/features/site/components/rich-content";
import { cleanSanityText } from "@/lib/sanity/text";

export function ProjectDetailPage({
  project,
  locale,
  settings,
}: {
  project: Pick<
    ProjectItem,
    "slug" | "title" | "category" | "location" | "image" | "content"
  >;
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  return (
    <DetailPageLayout
      locale={locale}
      settings={settings}
      eyebrow={project.category || (ar ? "مشاريعنا" : "Our projects")}
      title={project.title}
      description={project.location}
      image={project.image}
    >
      <RichContent blocks={project.content} locale={locale} />
      <Link
        className={siteStyles["detail-page-cta"]}
        href={`/${locale}/contact?type=project&title=${encodeURIComponent(cleanSanityText(project.title))}`}
        aria-label={`${ar ? "ناقش مشروع" : "Discuss project"} ${cleanSanityText(project.title)}`}
      >
        {ar ? "ناقش مشروعك معنا" : "Discuss your project"}
        <Arrow size={17} />
      </Link>
    </DetailPageLayout>
  );
}
