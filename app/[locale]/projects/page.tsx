import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/cms/sanity";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import styles from "./projects.module.css";

type Props = { params: Promise<{ locale: string }> };

export default async function ProjectsPage({ params }: Props) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const projects = (await getProjects(value)) ?? [];
  const isArabic = value === "ar";

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>{isArabic ? "أعمال مختارة" : "Selected work"}</p>
        <h1>{isArabic ? "المشاريع" : "Projects"}</h1>
        <p>{isArabic ? "مجموعة من الأعمال والتجارب التي نفخر بها." : "A selection of work and experiences we are proud of."}</p>
      </header>

      {projects.length > 0 ? (
        <div className={styles.grid}>
          {projects.map((project) => (
            <Link
              className={styles.card}
              href={`/${value}/projects/${project.slug}`}
              key={project._id}
            >
              {project.cover && (
                <div className={styles.media}>
                  <Image
                    src={project.cover.url}
                    alt={project.cover.alt || project.title || ""}
                    width={1200}
                    height={760}
                  />
                  {project.featured && (
                    <span className={styles.badge}>
                      {isArabic ? "مشروع مميز" : "Featured"}
                    </span>
                  )}
                </div>
              )}
              <div className={styles.cardBody}>
                <h2>{project.title}</h2>
                {project.summary && <p>{project.summary}</p>}
                <span>{isArabic ? "عرض المشروع" : "View project"} →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>{isArabic ? "لا توجد مشاريع منشورة بعد." : "No projects have been published yet."}</p>
      )}
    </main>
  );
}
