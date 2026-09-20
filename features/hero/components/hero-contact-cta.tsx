"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export function HeroContactCta({ locale, whatsappUrl, phone, email }: { locale: Locale; whatsappUrl?: string | null; phone?: string | null; email?: string | null }) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";

  return (
    <motion.section
      className="contact-cta"
      aria-labelledby="contact-cta-title"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="contact-cta-copy">
        <h2 id="contact-cta-title">{isArabic ? "هل لديك مشروع مصاعد؟" : "Have an Elevator Project in Mind?"}</h2>
        <p>{isArabic ? "دعنا نناقش الحل المناسب لمبناك." : "Let&apos;s discuss the right solution for your building."}</p>
      </div>

      <div className="contact-cta-actions">
        <motion.a className="contact-cta-whatsapp" href={whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL || "#contact"} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <MessageCircle aria-hidden="true" size={20} strokeWidth={1.8} />
          {isArabic ? "واتساب" : "WhatsApp"}
        </motion.a>
        <motion.a className="contact-cta-contact" href={email ? `mailto:${email}` : phone ? `tel:${phone}` : "#contact"} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          {isArabic ? "تواصل معنا" : "Contact Us"}
        </motion.a>
      </div>
    </motion.section>
  );
}
