import type { Metadata } from "next";
import type { ReactNode } from "react";
import { draftMode } from "next/headers";

import { defaultLocale, getDirection, isLocale, type Locale } from "@/lib/i18n";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { siteAssets } from "@/lib/site-assets";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { SanityLive } from "@/lib/sanity/live";
import { SanityVisualEditing } from "@/lib/sanity/visual-editing";
import { FloatingContactActions } from "@/features/site/components/floating-contact-actions";

// Site settings include mutable branding assets. Keep the locale tree dynamic
// so a published logo change is read on the next request instead of being
// embedded into a statically generated page at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : defaultLocale;
  const settings = await getSiteSettings(locale);
  const fallbackTitle =
    locale === "ar" ? "شركة المصاعد" : "Next Generation Elevators";
  const fallbackDescription =
    locale === "ar"
      ? "حلول المصاعد والتركيب والصيانة للمشاريع السكنية والتجارية."
      : "Elevator installation, maintenance, and modern mobility solutions for your building.";

  return {
    ...createPageMetadata({
      locale,
      path: `/${locale}`,
      title: settings?.seo.title || settings?.companyName || fallbackTitle,
      description: settings?.seo.description || fallbackDescription,
      settings,
    }),
    icons: {
      icon: [
        { url: siteAssets.faviconIco },
        { url: siteAssets.favicon16, sizes: "16x16", type: "image/png" },
        { url: siteAssets.favicon32, sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: siteAssets.appleTouchIcon, sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale: Locale = isLocale(value) ? value : defaultLocale;
  const { isEnabled: isDraftMode } = await draftMode();
  const settings = await getSiteSettings(locale);
  const organizationId = `${absoluteUrl(`/${locale}`)}#organization`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${absoluteUrl()}#website`,
      name: "مصاعد الجيل القادم",
      alternateName: "Next Generation Elevators",
      url: "https://next-generation-elevators.vercel.app/",
      publisher: { "@id": organizationId },
    },
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness"],
      "@id": organizationId,
      name: "مصاعد الجيل القادم",
      alternateName: "Next Generation Elevators",
      url: "https://next-generation-elevators.vercel.app/",
      logo: "https://cdn.sanity.io/images/qwovtgh7/production/da584322ee51dd595475a6710113839ab872b7b1-1200x269.png?w=480&auto=format",
      image: absoluteUrl(settings?.logo.url || siteAssets.logoTransparent),
      address: settings?.address
        ? { "@type": "PostalAddress", streetAddress: settings.address }
        : undefined,
      contactPoint: settings?.phone
        ? [
            {
              "@type": "ContactPoint",
              telephone: settings.phone,
              contactType: "customer service",
              availableLanguage: ["ar", "en"],
            },
          ]
        : undefined,
      telephone: settings?.phone || undefined,
      email: settings?.email || undefined,
      sameAs: settings?.socialLinks.map((link) => link.url) || undefined,
    },
  ];
  return (
    <div
      lang={locale}
      dir={getDirection(locale)}
      className={`min-h-full ${locale === "ar" ? "locale-ar" : "locale-en"}`}
    >
      {structuredData.map((data) => (
        <script
          key={data["@type"].toString()}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {children}
      <FloatingContactActions locale={locale} settings={settings} />
      <SanityLive />
      {isDraftMode && <SanityVisualEditing />}
    </div>
  );
}
