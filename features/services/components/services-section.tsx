"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/lib/i18n";
import type { ServicesSection } from "../types";

export function ServicesSection({
  services,
  locale,
}: {
  services: ServicesSection;
  locale: Locale;
}) {
  const reduceMotion = useReducedMotion();
  if (services.items.length === 0) return null;
  const isArabic = locale === "ar";
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section
      id="services"
      className="services-section"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="services-title"
    >
      <div className="services-inner">
        <div className="services-heading">
          <div>
            <p className="services-eyebrow">{services.eyebrow}</p>
            <h2 id="services-title">{services.title}</h2>
          </div>
          <Link className="services-all-link" href={`/${locale}/services`}>
            {services.linkText}
            <DirectionArrow aria-hidden="true" size={16} />
          </Link>
        </div>

        <div id="services-list" className="services-grid">
          {services.items.slice(0, 4).map((service, index) => (
            <Link
              key={`${service.title}-${index}`}
              className="service-card-link"
              href={`/${locale}/services/${encodeURIComponent(service.slug)}`}
              aria-label={service.title}
            >
            <motion.article
              className="service-card"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="service-image">
                <Image
                  src={service.image.url}
                  alt={service.image.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 720px) 50vw, 33vw"
                />
              </div>
              <div className="service-icon" aria-hidden={!service.icon}>
                {service.icon ? (
                  <Image
                    src={service.icon.url}
                    alt={service.icon.alt}
                    width={64}
                    height={64}
                    unoptimized
                  />
                ) : (
                  <Building2 size={34} strokeWidth={1.5} />
                )}
              </div>
              <div className="service-card-copy">
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span className="service-card-link-indicator" aria-hidden="true">
                  <DirectionArrow size={15} />
                </span>
              </div>
            </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
