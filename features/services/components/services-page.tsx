"use client";

import siteStyles from "@/features/site/components/site.module.css";
import styles from "./services.module.css";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Building2 } from "lucide-react";
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
    <main className={siteStyles["inner-page"]} dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro
        settings={settings}
        locale={locale}
        eyebrow={services.eyebrow || (isArabic ? "خدماتنا" : "Our services")}
        title={services.title || (isArabic ? "خدماتنا" : "Our Services")}
        description={
          isArabic
            ? "حلول متكاملة مصممة لتلبية احتياجات المباني السكنية والتجارية والطبية."
            : "Integrated solutions designed for residential, commercial, and healthcare buildings."
        }
      />

      <section
        className={siteStyles["inner-page-section"]}
        aria-label={services.title}
      >
        <div
          className={`${siteStyles["inner-page-container"]} ${styles["service-detail-grid"]}`}
        >
          {services.items.map((service, index) => (
            <motion.article
              key={`${service.title}-${index}`}
              className={styles["service-detail-card"]}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className={styles["service-detail-image"]}>
                <Image
                  className={styles["service-detail-image-desktop"]}
                  src={service.image.url}
                  alt={service.image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <Image
                  className={styles["service-detail-image-mobile"]}
                  src={(service.mobileImage ?? service.image).url}
                  alt={(service.mobileImage ?? service.image).alt}
                  fill
                  unoptimized
                  sizes="100vw"
                />
              </div>
              <div
                className={styles["service-detail-icon"]}
                aria-hidden={!service.icon}
              >
                {service.icon ? (
                  <Image
                    src={service.icon.url}
                    alt={service.icon.alt}
                    width={72}
                    height={72}
                    unoptimized
                  />
                ) : (
                  <Building2 size={38} strokeWidth={1.5} />
                )}
              </div>
              <div className={styles["service-detail-copy"]}>
                <p className={styles["service-detail-index"]}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <Link
                  href={`/${locale}/services/${encodeURIComponent(service.slug)}`}
                  aria-label={`${isArabic ? "عرض تفاصيل" : "View details for"} ${service.title}`}
                >
                  {isArabic ? "التفاصيل" : "View details"}
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
