import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPage } from "@/features/contact/components/contact-page";
import { SitePage } from "@/features/site/components/site-page";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { isLocale, type Locale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "ar";
  const settings = await getSiteSettings(locale);
  return createPageMetadata({
    locale,
    path: `/${locale}/contact`,
    title:
      locale === "ar"
        ? "تواصل معنا | الجيل القادم للمصاعد"
        : "Contact Us | Next Generation Elevators",
    description:
      locale === "ar"
        ? "تواصل مع الجيل القادم للمصاعد لمناقشة احتياجات مشروعك وحلول المصاعد المناسبة."
        : "Contact Next Generation Elevators to discuss your project needs and suitable elevator solutions.",
    settings,
  });
}

export default async function ContactRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ type?: string; title?: string }>;
}) {
  const { locale: value } = await params;
  const query = searchParams ? await searchParams : {};

  if (!isLocale(value)) {
    notFound();
  }

  const locale: Locale = value;
  const settings = await getSiteSettings(locale);

  return (
    <SitePage locale={locale} settings={settings} active="contact">
      <ContactPage
        locale={locale}
        settings={settings}
        prefill={{
          type:
            query.type === "project"
              ? "project"
              : query.type === "service"
                ? "service"
                : undefined,
          title: query.title?.slice(0, 180),
        }}
      />
    </SitePage>
  );
}
