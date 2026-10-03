"use client";

import styles from "./about.module.css";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { Vision } from "../types";

export function VisionSection({
  vision,
  locale,
}: {
  vision: Vision | null;
  locale: Locale;
}) {
  const reduceMotion = useReducedMotion();

  if (!vision) return null;

  return (
    <section
      className={styles["vision-section"]}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="vision-title"
    >
      <motion.div
        className={styles["vision-inner"]}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles["vision-eyebrow"]}>{vision.eyebrow}</p>
        <h2 id="vision-title">{vision.title}</h2>
        <p className={styles["vision-description"]}>{vision.description}</p>
      </motion.div>
    </section>
  );
}
