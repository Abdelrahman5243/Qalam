"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Languages } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import { HeroContactCta } from "./hero-contact-cta";
import type { Hero } from "../types";

type HeroSectionProps = {
  hero: Hero;
  locale: Locale;
  settings: SiteSettings | null;
};

const navigation = {
  en: [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact Us", href: "#contact" },
  ],
  ar: [
    { label: "الرئيسية", href: "#home" },
    { label: "من نحن", href: "#about" },
    { label: "الخدمات", href: "#services" },
    { label: "المشاريع", href: "#projects" },
    { label: "تواصل معنا", href: "#contact" },
  ],
} as const;

export function HeroSection({ hero, locale, settings }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const navItems = navigation[locale];

  return (
    <main id="home" className="hero-shell" dir={locale === "ar" ? "rtl" : "ltr"}>
      <motion.header
        className="hero-header"
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.a href="#home" className="hero-logo" aria-label={`${settings?.companyName || "Next Generation Elevators"} home`} whileHover={{ y: -2 }}>
          <Image src={settings?.logo.url || "/logo.png"} alt={settings?.logo.alt || "Next Generation Elevators"} width={104} height={64} priority unoptimized={!settings?.logo.url} />
        </motion.a>

        <nav className="hero-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          {navItems.map((item) => (
            <motion.a key={item.href} href={item.href} whileHover={{ y: -2 }}>
              {item.label}
            </motion.a>
          ))}
        </nav>

        <motion.a
          className="hero-locale"
          href={`/${otherLocale}`}
          aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          whileHover={{ y: -2 }}
        >
          <Languages className="hero-globe" aria-hidden="true" />
          <span>{locale === "ar" ? "EN" : "AR"}</span>
        </motion.a>
      </motion.header>

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
          <motion.p className="hero-eyebrow" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.4 }}>{hero.eyebrow}</motion.p>
          <h1 id="hero-title">{hero.title}</h1>
          <p className="hero-description">{hero.description}</p>

          <div className="hero-actions">
            <motion.a className="hero-primary-action" href="#contact" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              {hero.ctaText || "Contact Us"}
            </motion.a>
            <motion.a className="hero-secondary-action" href="#services" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              {hero.secondaryCtaText}
              {locale === "ar" ? <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} /> : <ArrowRight aria-hidden="true" size={18} strokeWidth={1.8} />}
            </motion.a>
          </div>
        </motion.div>
      </section>

      <HeroContactCta locale={locale} whatsappUrl={settings?.whatsappUrl} phone={settings?.phone} email={settings?.email} />
    </main>
  );
}
