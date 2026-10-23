import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/cms/sanity";
import { RichText } from "@/components/ui/rich-text";
import { isLocale } from "@/lib/i18n";
import styles from "./project-detail.module.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

async function resolve(params: Props["params"]) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  return { locale: value, slug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolve(params);
  const project = await getProject(slug, locale);
  return project
    ? { title: project.title, description: project.summary ?? undefined }
    : {};
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await resolve(params);
  const project = await getProject(slug, locale);
  if (!project) notFound();
  const isArabic = locale === "ar";

  return (
    <main className={styles.page}>
      <article>
        <Link className={styles.back} href={`/${locale}/projects`}>
          ← {isArabic ? "كل المشاريع" : "All projects"}
        </Link>
        <header className={styles.header}>
          <h1>{project.title}</h1>
          {project.summary && <p>{project.summary}</p>}
        </header>
        {project.cover && (
          <Image
            className={styles.cover}
            src={project.cover.url}
            alt={project.cover.alt || project.title || ""}
            width={1600}
            height={1000}
            priority
          />
        )}
        <RichText className={styles.body} value={project.body} />
      </article>
    </main>
  );
}
