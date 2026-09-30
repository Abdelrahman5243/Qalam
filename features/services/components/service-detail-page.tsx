import Image from "next/image";
import { stegaClean } from "@sanity/client/stega";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";
import type { ServiceItem } from "@/features/services/types";
import { PageIntro } from "@/features/site/components/page-intro";
import { RichContent } from "@/features/site/components/rich-content";

export function ServiceDetailPage({ service, locale, settings }: { service: Pick<ServiceItem, "slug" | "title" | "description" | "image" | "content">; locale: Locale; settings: SiteSettings | null }) {
  const ar = locale === "ar"; const Arrow = ar ? ArrowLeft : ArrowRight;
  return <main className="inner-page" dir={ar ? "rtl" : "ltr"}>
    <PageIntro settings={settings} locale={locale} eyebrow={ar ? "خدماتنا" : "Our services"} title={service.title} description={service.description} />
    <section className="detail-page-section"><div className="detail-page-container">
      <div className="detail-page-media"><Image src={service.image.url} alt={service.image.alt} fill unoptimized sizes="(max-width: 800px) 100vw, 50vw" /></div>
      <div className="detail-page-copy"><RichContent blocks={service.content} locale={locale} /><Link
        className="detail-page-cta"
        href={`/${locale}/contact?type=service&title=${encodeURIComponent(stegaClean(service.title))}`}
        aria-label={`${ar ? "اطلب عرض سعر لخدمة" : "Request a quote for"} ${stegaClean(service.title)}`}
      >
        {ar ? "اطلب عرض سعر" : "Request a quote"}<Arrow size={17} />
      </Link></div>
    </div></section>
  </main>;
}
