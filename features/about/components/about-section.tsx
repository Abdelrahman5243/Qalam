"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { About } from "../types";

export function AboutSection({ about, locale }: { about: About; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";

  return (
    <section id="about" className="about-section" dir={isArabic ? "rtl" : "ltr"} aria-labelledby="about-title">
      <div className="about-inner">
        <motion.div
          className="about-copy"
          initial={reduceMotion ? false : { opacity: 0, x: isArabic ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="about-eyebrow">{about.eyebrow}</p>
          <h2 id="about-title">{about.title}</h2>
          <p className="about-description">{about.description}</p>
          <a className="about-link" href={`/${locale}/about`}>
            {about.ctaText}
            {isArabic ? <ArrowLeft aria-hidden="true" size={18} /> : <ArrowRight aria-hidden="true" size={18} />}
          </a>
        </motion.div>

        <motion.div
          className="about-media"
          initial={reduceMotion ? false : { opacity: 0, x: isArabic ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={about.image.url} alt={about.image.alt} fill unoptimized sizes="(max-width: 900px) 100vw, 55vw" />
        </motion.div>
      </div>
    </section>
  );
}
