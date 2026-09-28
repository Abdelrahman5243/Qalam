"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import type { Locale } from "@/lib/i18n";
import type { AboutClients } from "../types";

export function ClientsSection({ clients, locale }: { clients: AboutClients | null; locale: Locale }) {
  const reduceMotion = useReducedMotion();
  if (!clients) return null;

  return (
    <section className="about-clients-section" dir={locale === "ar" ? "rtl" : "ltr"} aria-labelledby="about-clients-title">
      <div className="about-clients-pattern" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="about-clients-inner">
        <motion.div
          className="about-clients-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="about-clients-eyebrow">{clients.eyebrow}</p>
          <h2 id="about-clients-title">{clients.title}</h2>
          <p>{clients.description}</p>
        </motion.div>
        <div className="about-clients-grid">
          {clients.items.map((client, index) => (
            <motion.div
              key={`${client.name}-${index}`}
              className="about-client"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="about-client-logo-frame">
                <Image
                  src={client.logo.url}
                  alt={client.logo.alt}
                  width={180}
                  height={180}
                  sizes="(max-width: 639px) 70vw, (max-width: 900px) 35vw, 180px"
                  className="about-client-logo"
                />
              </span>
              <span className="sr-only">{client.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
