import siteStyles from "@/features/site/components/site.module.css";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { ServiceItem } from "@/features/services/types";
import { DetailPageLayout } from "@/features/site/components/detail-page-layout";
import { RichContent } from "@/features/site/components/rich-content";
import { cleanSanityText } from "@/lib/sanity/text";

export function ServiceDetailPage({
  service,
  locale,
  settings,
}: {
  service: Pick<
    ServiceItem,
    "slug" | "title" | "description" | "image" | "content"
  >;
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  return (
    <DetailPageLayout
      locale={locale}
      settings={settings}
      eyebrow={ar ? "خدماتنا" : "Our services"}
      title={service.title}
      description={service.description}
      image={service.image}
    >
      <RichContent blocks={service.content} locale={locale} />
      <Link
        className={siteStyles["detail-page-cta"]}
        href={`/${locale}/contact?type=service&title=${encodeURIComponent(cleanSanityText(service.title))}`}
        aria-label={`${ar ? "اطلب عرض سعر لخدمة" : "Request a quote for"} ${cleanSanityText(service.title)}`}
      >
        {ar ? "اطلب عرض سعر" : "Request a quote"}
        <Arrow size={17} />
      </Link>
    </DetailPageLayout>
  );
}
