"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { About } from "../types";
import styles from "./about.module.css";

export function AboutSection({
  about,
  locale,
  showCta = true,
}: {
  about: About;
  locale: Locale;
  showCta?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";

  return (
    <section
      id="about"
      className={styles["about-section"]}
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="about-title"
    >
      <div className={styles["about-inner"]}>
        <motion.div
          className={styles["about-copy"]}
          initial={
            reduceMotion ? false : { opacity: 0, x: isArabic ? 24 : -24 }
          }
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles["about-eyebrow"]}>{about.eyebrow}</p>
          <h2 id="about-title">{about.title}</h2>
          <p className={styles["about-description"]}>{about.description}</p>
          {showCta ? (
            <Link className={styles["about-link"]} href={`/${locale}/about`}>
              {about.ctaText}
              {isArabic ? (
                <ArrowLeft aria-hidden="true" size={18} />
              ) : (
                <ArrowRight aria-hidden="true" size={18} />
              )}
            </Link>
          ) : null}
        </motion.div>

        <motion.div
          className={styles["about-media"]}
          initial={
            reduceMotion ? false : { opacity: 0, x: isArabic ? -24 : 24 }
          }
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={about.image.url}
            alt={about.image.alt}
            fill
            unoptimized
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
