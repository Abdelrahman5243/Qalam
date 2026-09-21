"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "../types";

const navigation = {
  en: [
    { label: "Home", href: "/en" },
    { label: "About Us", href: "/en/about" },
    { label: "Services", href: "/en/services" },
    { label: "Projects", href: "/en/projects" },
    { label: "Contact Us", href: "/en/contact" },
  ],
  ar: [
    { label: "الرئيسية", href: "/ar" },
    { label: "من نحن", href: "/ar/about" },
    { label: "الخدمات", href: "/ar/services" },
    { label: "المشاريع", href: "/ar/projects" },
    { label: "تواصل معنا", href: "/ar/contact" },
  ],
} as const;

const MotionLink = motion(Link);

export function SiteHeader({ locale, settings, active = "home" }: { locale: Locale; settings: SiteSettings | null; active?: "home" | "about" | "services" | "projects" | "contact" }) {
  const reduceMotion = useReducedMotion();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const items = navigation[locale];

  return (
    <motion.header
      className="hero-header"
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-header-inner">
        <MotionLink href={`/${locale}`} className="hero-logo" aria-label={`${settings?.companyName || "Next Generation Elevators"} home`} whileHover={{ y: -2 }}>
          <Image src={settings?.logo.url || "/logo.png"} alt={settings?.logo.alt || "Next Generation Elevators"} width={104} height={64} priority unoptimized={!settings?.logo.url} />
        </MotionLink>

        <nav className="hero-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          {items.map((item) => {
            const isCurrent = item.href === `/${locale}`
              ? active === "home"
              : item.href.endsWith(`/${active}`);
            return <MotionLink key={item.href} href={item.href} data-current={isCurrent ? "true" : undefined} whileHover={{ y: -2 }}>{item.label}</MotionLink>;
          })}
        </nav>

        <Link className="hero-locale" href={`/${otherLocale}`} aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}>
          <span className="hero-locale-current">{locale.toUpperCase()}</span>
          <span className="hero-locale-divider" aria-hidden="true" />
          <span className="hero-locale-target">{otherLocale.toUpperCase()}</span>
        </Link>
      </div>
    </motion.header>
  );
}
