"use client";

import Image from "next/image";

import type { Locale } from "@/lib/i18n";
import type { BrandsSection } from "../types";

export function BrandsSection({ brands, locale }: { brands: BrandsSection; locale: Locale }) {
  const isArabic = locale === "ar";
  const items = [...brands.items, ...brands.items];

  const renderLogo = (brand: BrandsSection["items"][number], index: number) => {
    const logo = <Image src={brand.logo.url} alt={brand.logo.alt} width={160} height={72} unoptimized sizes="160px" />;
    return brand.url ? <a key={`${brand.name}-${index}`} href={brand.url} target="_blank" rel="noreferrer" aria-label={brand.name}>{logo}</a> : <span key={`${brand.name}-${index}`}>{logo}</span>;
  };

  return (
    <section className="brands-section" dir={isArabic ? "rtl" : "ltr"} aria-labelledby="brands-title">
      <div className="brands-inner">
        <div className="brands-heading">
          <div>
            <p className="brands-eyebrow">{brands.eyebrow}</p>
            <h2 id="brands-title">{brands.title}</h2>
          </div>
          <p>{brands.description}</p>
        </div>
        <div className="brands-marquee" aria-label={isArabic ? "شعارات الشركاء" : "Partner logos"}>
          <div className="brands-track">
            {items.map(renderLogo)}
          </div>
        </div>
        <div className="brands-mobile-grid" aria-label={isArabic ? "كل شعارات الشركاء" : "All partner logos"}>
          {brands.items.map(renderLogo)}
        </div>
      </div>
    </section>
  );
}
