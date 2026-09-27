"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import { SiteHeader } from "@/features/site/components/site-header";
import type { Hero } from "../types";

type HeroSectionProps = {
  hero: Hero;
  locale: Locale;
  settings: SiteSettings | null;
};

const MotionLink = motion(Link);

export function HeroSection({ hero, locale, settings }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <main
      id="home"
      className="hero-shell"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <SiteHeader locale={locale} settings={settings} />

      <section className="hero-stage" aria-labelledby="hero-title">
        <Image
          src={hero.image.url}
          alt={hero.image.alt}
          fill
          priority
          unoptimized
          className="hero-background"
          sizes="100vw"
        />
        <div className="hero-overlay" />

        <motion.div
          className="hero-content"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="hero-eyebrow"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            {hero.eyebrow}
          </motion.p>
          <h1 id="hero-title">{hero.title}</h1>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-actions">
            <MotionLink
              className="hero-primary-action hero-whatsapp-action"
              href={settings?.whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL || "#contact"}
              target={settings?.whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL ? "_blank" : undefined}
              rel={settings?.whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL ? "noreferrer" : undefined}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle aria-hidden="true" size={18} strokeWidth={1.8} />
              {hero.ctaText && !["تواصل معنا", "Contact Us"].includes(hero.ctaText)
                ? hero.ctaText
                : locale === "ar"
                  ? "تواصل عبر واتساب"
                  : "Chat on WhatsApp"}
            </MotionLink>
            <MotionLink
              className="hero-secondary-action"
              href="#services"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {hero.secondaryCtaText}
              {locale === "ar" ? (
                <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
              ) : (
                <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />
              )}
            </MotionLink>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
