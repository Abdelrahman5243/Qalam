"use client";

import { Award, Clock3, ShieldCheck, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { WhySection } from "../types";

const icons = { shield: ShieldCheck, award: Award, zap: Zap, clock: Clock3 } as const;

export function WhySection({ why, locale }: { why: WhySection; locale: Locale }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="why-section" dir={locale === "ar" ? "rtl" : "ltr"} aria-labelledby="why-title">
      <div className="why-inner">
        <div className="why-heading">
          <p className="why-eyebrow">{why.eyebrow}</p>
          <h2 id="why-title">{why.title}</h2>
        </div>
        <div className="why-grid">
          {why.items.slice(0, 4).map((item, index) => {
            const Icon = icons[item.icon] || ShieldCheck;
            return (
              <motion.article key={`${item.title}-${index}`} className="why-item" initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.4, delay: index * 0.07 }}>
                <div className="why-icon"><Icon aria-hidden="true" size={18} strokeWidth={1.8} /></div>
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
