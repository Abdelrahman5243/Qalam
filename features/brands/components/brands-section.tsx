"use client";

import Image from "next/image";

import type { Locale } from "@/lib/i18n";
import type { BrandsSection } from "../types";

export function BrandsSection({ brands, locale }: { brands: BrandsSection; locale: Locale }) {
  const isArabic = locale === "ar";
  const items = [...brands.items, ...brands.items];

  return (
    <section className="brands-section" dir={isArabic ? "rtl" : "ltr"} aria-labelledby="brands-title">
      <div className="brands-inner">
        <div className="brands-marquee" aria-label={isArabic ? "شعارات الشركاء" : "Partner logos"}>
          <div className="brands-track">
            {items.map((brand, index) => {
              const logo = <Image src={brand.logo.url} alt={brand.logo.alt} width={160} height={72} unoptimized sizes="160px" />;
              return brand.url ? <a key={`${brand.name}-${index}`} href={brand.url} target="_blank" rel="noreferrer" aria-label={brand.name}>{logo}</a> : <span key={`${brand.name}-${index}`}>{logo}</span>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
