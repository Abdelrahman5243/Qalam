import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { ProjectItem } from "@/features/projects/types";
import { PageIntro } from "@/features/site/components/page-intro";
import { RichContent } from "@/features/site/components/rich-content";

export function ProjectDetailPage({ project, locale, settings }: { project: Pick<ProjectItem, "slug" | "title" | "category" | "location" | "image" | "content">; locale: Locale; settings: SiteSettings | null }) {
  const ar = locale === "ar"; const Arrow = ar ? ArrowLeft : ArrowRight;
  return <main className="inner-page" dir={ar ? "rtl" : "ltr"}>
    <PageIntro settings={settings} eyebrow={project.category || (ar ? "مشاريعنا" : "Our projects")} title={project.title} description={project.location} />
    <section className="detail-page-section"><div className="detail-page-container">
      <div className="detail-page-media"><Image src={project.image.url} alt={project.image.alt} fill unoptimized sizes="(max-width: 800px) 100vw, 50vw" /></div>
      <div className="detail-page-copy"><RichContent blocks={project.content} locale={locale} /><Link
        className="detail-page-cta"
        href={`/${locale}/contact?type=project&title=${encodeURIComponent(project.title)}`}
        aria-label={`${ar ? "ناقش مشروع" : "Discuss project"} ${project.title}`}
      >
        {ar ? "ناقش مشروعك معنا" : "Discuss your project"}<Arrow size={17} />
      </Link></div>
    </div></section>
  </main>;
}
