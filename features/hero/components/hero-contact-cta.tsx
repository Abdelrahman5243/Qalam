"use client";

import Link from "next/link";

import { MessageCircle, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

const MotionLink = motion(Link);

export function HeroContactCta({
  locale,
  whatsappUrl,
  phone,
}: {
  locale: Locale;
  whatsappUrl?: string | null;
  phone?: string | null;
  email?: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";

  return (
    <motion.section
      id="contact"
      className="contact-cta"
      aria-labelledby="contact-cta-title"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="contact-cta-inner">
        <div className="contact-cta-copy">
          <h2 id="contact-cta-title">
            {isArabic
              ? "هل لديك مشروع مصاعد؟"
              : "Have an Elevator Project in Mind?"}
          </h2>
          <p>
            {isArabic
              ? "دعنا نناقش الحل المناسب لمبناك."
              : "Let's discuss the right solution for your building."}
          </p>
        </div>

        <div className="contact-cta-actions">
          <motion.a
            className="contact-cta-whatsapp"
            href={
              whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL || "#contact"
            }
            target={
              whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL
                ? "_blank"
                : undefined
            }
            rel={
              whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL
                ? "noreferrer"
                : undefined
            }
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle aria-hidden="true" size={20} strokeWidth={1.8} />
            {isArabic ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
          </motion.a>
          <motion.a
            className="contact-cta-call"
            href={phone ? `tel:${phone}` : "#contact"}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Phone aria-hidden="true" size={18} strokeWidth={1.8} />
            {isArabic ? "اتصل بنا" : "Call us"}
          </motion.a>
          <MotionLink
            className="contact-cta-contact"
            href={`/${locale}/contact`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            {isArabic ? "تواصل معنا" : "Contact Us"}
          </MotionLink>
        </div>
      </div>
    </motion.section>
  );
}
