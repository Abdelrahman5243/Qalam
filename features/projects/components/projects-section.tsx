"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { ProjectsSection } from "../types";

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
      className="projects-section"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="projects-title"
    >
      <div className="projects-inner">
        <div className="projects-heading">
          <div>
            <p className="projects-eyebrow">{projects.eyebrow}</p>
            <h2 id="projects-title">{projects.title}</h2>
          </div>
          <Link className="projects-all-link" href={`/${locale}/projects`}>
            {projects.linkText}
            <DirectionArrow aria-hidden="true" size={16} />
          </Link>
        </div>

        <div id="projects-list" className="projects-grid">
          {projects.items.slice(0, 3).map((project, index) => (
            <motion.article
              key={`${project.title}-${index}`}
              className={`project-card project-card-${index + 1}`}
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
              <div className="project-card-overlay" />
              <div className="project-card-copy">
                <p>{project.category}</p>
                <h3>{project.title}</h3>
                <span>{project.location}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
