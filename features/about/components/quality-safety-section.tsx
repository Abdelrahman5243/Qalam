"use client";

import styles from "./about.module.css";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { QualitySafety } from "../types";

export function QualitySafetySection({
  content,
  locale,
}: {
  content: QualitySafety | null;
  locale: Locale;
}) {
  const reduceMotion = useReducedMotion();
  if (!content) return null;

  return (
    <section
      className={styles["quality-section"]}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="quality-title"
    >
      <div className={styles["quality-inner"]}>
        <motion.div
          className={styles["quality-heading"]}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles["quality-eyebrow"]}>{content.eyebrow}</p>
          <h2 id="quality-title">{content.title}</h2>
          <p>{content.description}</p>
        </motion.div>
        <div className={styles["quality-grid"]}>
          {content.items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              className={styles["quality-item"]}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
