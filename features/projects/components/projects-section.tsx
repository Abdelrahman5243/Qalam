"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { ProjectsSection } from "../types";
import styles from "./projects.module.css";

export function ProjectsSection({
  projects,
  locale,
}: {
  projects: ProjectsSection;
  locale: Locale;
}) {
  const reduceMotion = useReducedMotion();
  if (projects.items.length === 0) return null;
  const isArabic = locale === "ar";
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section
      id="projects"
      className={styles["projects-section"]}
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="projects-title"
    >
      <div className={styles["projects-inner"]}>
        <div className={styles["projects-heading"]}>
          <div>
            <p className={styles["projects-eyebrow"]}>{projects.eyebrow}</p>
            <h2 id="projects-title">{projects.title}</h2>
          </div>
          <Link
            className={styles["projects-all-link"]}
            href={`/${locale}/projects`}
          >
            {projects.linkText}
            <DirectionArrow aria-hidden="true" size={16} />
          </Link>
        </div>

        <div id="projects-list" className={styles["projects-grid"]}>
          {projects.items.slice(0, 3).map((project, index) => (
            <Link
              key={`${project.title}-${index}`}
              href={`/${locale}/projects/${encodeURIComponent(project.slug)}`}
              className={styles["project-card-link"]}
              aria-label={project.title}
            >
              <motion.article
                className={styles["project-card"]}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Image
                  src={project.image.url}
                  alt={project.image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
                />
                <div className={styles["project-card-overlay"]} />
                <div className={styles["project-card-copy"]}>
                  <p>{project.category}</p>
                  <h3>{project.title}</h3>
                  <span>{project.location}</span>
                  <span className={styles["project-card-action"]}>
                    {isArabic ? "التفاصيل" : "View details"}
                    <DirectionArrow aria-hidden="true" size={16} />
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
