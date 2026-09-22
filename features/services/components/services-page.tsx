"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { ServicesSection } from "../types";
import { PageIntro } from "@/features/site/components/page-intro";

export function ServicesPage({
  services,
  locale,
  settings,
}: {
  services: ServicesSection;
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const reduceMotion = useReducedMotion();
  const isArabic = locale === "ar";
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main className="inner-page" dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro
        settings={settings}
        eyebrow={services.eyebrow || (isArabic ? "خدماتنا" : "Our services")}
        title={services.title || (isArabic ? "خدماتنا" : "Our Services")}
        description={
          isArabic
            ? "حلول متكاملة مصممة لتلبية احتياجات المباني السكنية والتجارية والطبية."
            : "Integrated solutions designed for residential, commercial, and healthcare buildings."
        }
      />

      <section className="inner-page-section" aria-label={services.title}>
        <div className="inner-page-container service-detail-grid">
          {services.items.map((service, index) => (
            <motion.article
              key={`${service.title}-${index}`}
              className="service-detail-card"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="service-detail-image">
                <Image
                  src={service.image.url}
                  alt={service.image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className="service-detail-copy">
                <p className="service-detail-index">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <Link href={`/${locale}/contact`}>
                  {isArabic ? "اطلب عرض سعر" : "Request a quote"}
                  <DirectionArrow size={17} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
