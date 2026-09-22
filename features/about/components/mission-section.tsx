"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { Mission } from "../types";

export function MissionSection({ mission, locale }: { mission: Mission | null; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  if (!mission) return null;

  return (
    <section className="mission-section" dir={locale === "ar" ? "rtl" : "ltr"} aria-labelledby="mission-title">
      <div className="mission-inner">
        <motion.div
          className="mission-copy"
          initial={reduceMotion ? false : { opacity: 0, x: locale === "ar" ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mission-eyebrow">{mission.eyebrow}</p>
          <h2 id="mission-title">{mission.title}</h2>
          <div className="mission-paragraphs">
            {mission.paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
          </div>
        </motion.div>
        <motion.div
          className="mission-media"
          initial={reduceMotion ? false : { opacity: 0, x: locale === "ar" ? -24 : 24, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={mission.image.url} alt={mission.image.alt} fill unoptimized sizes="(max-width: 900px) 100vw, 55vw" />
        </motion.div>
      </div>
    </section>
  );
}
