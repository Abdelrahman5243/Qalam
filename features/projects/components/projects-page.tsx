"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { ProjectsSection } from "../types";
import { PageIntro } from "@/features/site/components/page-intro";

export function ProjectsPage({ projects, locale }: { projects: ProjectsSection; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main className="inner-page" dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro eyebrow={projects.eyebrow} title={projects.title} description={isArabic ? "نحوّل الخبرة الهندسية إلى حلول مصاعد تعمل بكفاءة داخل مساحات حقيقية." : "We turn engineering expertise into elevator solutions that perform in real spaces."} />

      <section className="inner-page-section" aria-label={projects.title}>
        <div className="inner-page-container project-detail-grid">
          {projects.items.map((project, index) => (
            <motion.article key={`${project.title}-${index}`} className={`project-detail-card project-detail-card-${index + 1}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45, delay: index * 0.06 }}>
              <div className="project-detail-image"><Image src={project.image.url} alt={project.image.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" /><div className="project-detail-overlay" /></div>
              <div className="project-detail-copy">
                <p>{project.category}</p>
                <h2>{project.title}</h2>
                <span>{project.location}</span>
                <Link href={`/${locale}/contact`}>{isArabic ? "ناقش مشروعك معنا" : "Discuss your project"}<DirectionArrow size={17} /></Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
