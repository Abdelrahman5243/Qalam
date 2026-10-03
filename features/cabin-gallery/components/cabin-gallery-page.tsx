import siteStyles from "@/features/site/components/site.module.css";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { CabinGallery } from "../services/cabin-gallery-service";
import { PageIntro } from "@/features/site/components/page-intro";
import styles from "./cabin-gallery.module.css";

export function CabinGalleryPage({
  gallery,
  locale,
  settings,
}: {
  gallery: CabinGallery | null;
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const isArabic = locale === "ar";
  const title =
    gallery?.title || (isArabic ? "ديكورات كبائن 2026" : "Cabin Designs 2026");
  const description =
    gallery?.description ||
    (isArabic
      ? "استكشف مجموعة مختارة من تصاميم وتشطيبات كبائن المصاعد."
      : "Explore a curated collection of elevator cabin designs and finishes.");

  return (
    <main
      className={`${siteStyles["inner-page"]} cabin-gallery-page`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <PageIntro
        settings={settings}
        locale={locale}
        eyebrow={isArabic ? "تصميمات الكبائن" : "Cabin collection"}
        title={title}
        description={description}
      />
      <section className={siteStyles["inner-page-section"]} aria-label={title}>
        <div className={siteStyles["inner-page-container"]}>
          {gallery?.items.length ? (
            <div className={styles["cabin-gallery-masonry"]}>
              {gallery.items.map((item, index) => (
                <figure
                  className={styles["cabin-gallery-item"]}
                  key={item.image.url + "-" + index}
                >
                  <div
                    className={styles["cabin-gallery-image"]}
                    style={{
                      aspectRatio:
                        String(item.width) + " / " + String(item.height),
                    }}
                  >
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 700px) 50vw, 33vw"
                    />
                  </div>
                </figure>
              ))}
            </div>
          ) : (
            <p className={styles["cabin-gallery-empty"]}>
              {isArabic
                ? "سيتم إضافة تصميمات الكبائن قريبًا."
                : "Cabin designs will be added soon."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
