import type { Metadata } from "next";
import type { ReactNode } from "react";
import { draftMode } from "next/headers";

import { defaultLocale, getDirection, isLocale, type Locale } from "@/lib/i18n";
import { getSiteSettings } from "@/features/site/services/site-settings-service";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { SanityLive } from "@/lib/sanity/live";
import { SanityVisualEditing } from "@/lib/sanity/visual-editing";
import type { CSSProperties } from "react";

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
  const fallbackTitle = locale === "ar" ? "موقع جديد" : "New website";
  const fallbackDescription =
    locale === "ar"
      ? "موقع بسيط قابل للتخصيص."
      : "A simple website ready to customize.";

  return {
    ...createPageMetadata({
      locale,
      path: `/${locale}`,
      title: settings?.seo.title || settings?.companyName || fallbackTitle,
      description: settings?.seo.description || fallbackDescription,
      settings,
    }),
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
      name: settings?.companyName || "New website",
      alternateName: settings?.companyName || undefined,
      url: absoluteUrl(`/${locale}`),
      publisher: { "@id": organizationId },
    },
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness"],
      "@id": organizationId,
      name: settings?.companyName || "New website",
      alternateName: settings?.companyName || undefined,
      url: absoluteUrl(`/${locale}`),
      logo: settings?.logo?.url ? absoluteUrl(settings.logo.url) : undefined,
      image: settings?.logo?.url ? absoluteUrl(settings.logo.url) : undefined,
      email: settings?.email || undefined,
    },
  ];
  return (
    <div
      lang={locale}
      dir={getDirection(locale)}
      className={`min-h-full ${locale === "ar" ? "locale-ar" : "locale-en"}`}
      style={
        {
          ...(settings?.branding.primaryColor
            ? { "--brand-green": settings.branding.primaryColor }
            : {}),
          ...(settings?.branding.accentColor
            ? { "--brand-green-hover": settings.branding.accentColor }
            : {}),
          ...(settings?.branding.darkColor
            ? { "--surface-dark": settings.branding.darkColor }
            : {}),
          ...(settings?.branding.bodyFont
            ? { "--font-body": settings.branding.bodyFont }
            : {}),
          ...(settings?.branding.headingFont
            ? { "--font-display": settings.branding.headingFont }
            : {}),
        } as CSSProperties
      }
    >
      {structuredData.map((data) => (
        <script
          key={data["@type"].toString()}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      {children}
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode && <SanityVisualEditing />}
    </div>
  );
}
