"use client";

import siteStyles from "@/features/site/components/site.module.css";
import styles from "./projects.module.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { ProjectsSection } from "../types";
import { PageIntro } from "@/features/site/components/page-intro";

export function ProjectsPage({
  projects,
  locale,
  settings,
}: {
  projects: ProjectsSection;
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main className={siteStyles["inner-page"]} dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro
        settings={settings}
        locale={locale}
        eyebrow={projects.eyebrow || (isArabic ? "مشاريعنا" : "Our projects")}
        title={projects.title || (isArabic ? "مشاريعنا" : "Our Projects")}
        description={
          isArabic
            ? "نحوّل الخبرة الهندسية إلى حلول مصاعد تعمل بكفاءة داخل مساحات حقيقية."
            : "We turn engineering expertise into elevator solutions that perform in real spaces."
        }
      />

      <section
        className={siteStyles["inner-page-section"]}
        aria-label={projects.title}
      >
        <div
          className={`${siteStyles["inner-page-container"]} ${styles["project-detail-grid"]}`}
        >
          {projects.items.map((project, index) => (
            <motion.article
              key={`${project.title}-${index}`}
              className={`${styles["project-detail-card"]} ${styles[`project-detail-card-${index + 1}`]}`}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className={styles["project-detail-image"]}>
                <Image
                  src={project.image.url}
                  alt={project.image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <div className={styles["project-detail-overlay"]} />
              </div>
              <div className={styles["project-detail-copy"]}>
                <p>{project.category}</p>
                <h2>{project.title}</h2>
                <span>{project.location}</span>
                <Link
                  href={`/${locale}/projects/${encodeURIComponent(project.slug)}`}
                  aria-label={`${isArabic ? "عرض تفاصيل" : "View details for"} ${project.title}`}
                >
                  {isArabic ? "التفاصيل" : "View details"}
                  <DirectionArrow size={17} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
