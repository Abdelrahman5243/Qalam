import siteStyles from "./site.module.css";
import Image from "next/image";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "../types";
import { PageIntro } from "./page-intro";

type DetailPageLayoutProps = {
  locale: Locale;
  settings: SiteSettings | null;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  image: { url: string; alt: string };
  children: ReactNode;
};

export function DetailPageLayout({
  locale,
  settings,
  eyebrow,
  title,
  description,
  image,
  children,
}: DetailPageLayoutProps) {
  const isArabic = locale === "ar";

  return (
    <main className={siteStyles["inner-page"]} dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro
        settings={settings}
        locale={locale}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <section className={siteStyles["detail-page-section"]}>
        <div className={siteStyles["detail-page-container"]}>
          <div className={siteStyles["detail-page-media"]}>
            <Image
              src={image.url}
              alt={image.alt}
              fill
              unoptimized
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className={siteStyles["detail-page-copy"]}>{children}</div>
        </div>
      </section>
    </main>
  );
}
