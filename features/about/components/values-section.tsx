"use client";

import { Award, Eye, ShieldCheck, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { AboutValues } from "../types";

const icons = { shield: ShieldCheck, award: Award, zap: Zap, eye: Eye } as const;

export function ValuesSection({ values, locale }: { values: AboutValues | null; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  if (!values) return null;

  return (
    <section className="values-section" dir={locale === "ar" ? "rtl" : "ltr"} aria-labelledby="values-title">
      <div className="values-inner">
        <motion.div
          className="values-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="values-eyebrow">{values.eyebrow}</p>
          <h2 id="values-title">{values.title}</h2>
        </motion.div>
        <div className="values-grid">
          {values.items.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <motion.article
                key={`${item.title}-${index}`}
                className="value-item"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="value-icon"><Icon aria-hidden="true" size={18} strokeWidth={1.8} /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
