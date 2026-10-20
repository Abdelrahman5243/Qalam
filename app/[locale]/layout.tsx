import type { CSSProperties, ReactNode } from "react";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getSettings, SanityLive, type Settings } from "@/cms/sanity";
import { VisualEditing } from "@/cms/visual-editing";
import { SiteHeader } from "@/components/site-header";
import { direction, isLocale } from "@/lib/i18n";
import { organizationJsonLd } from "@/lib/seo";

// Settings (logo, branding) can change at any time, so render on every request.
export const dynamic = "force-dynamic";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

/** Branding setting → the CSS variable it overrides. */
const brandingVariables = {
  primaryColor: "--brand-green",
  accentColor: "--brand-green-hover",
  bodyFont: "--font-body",
} as const;

function brandingStyle(branding: Settings["branding"]) {
  const style: Record<string, string> = {};
  for (const [key, variable] of Object.entries(brandingVariables)) {
    const value = branding?.[key as keyof typeof brandingVariables];
    if (value) style[variable] = value;
  }
  return style as CSSProperties;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [{ isEnabled: isDraftMode }, settings] = await Promise.all([
    draftMode(),
    getSettings(locale),
  ]);

  return (
    <div
      lang={locale}
      dir={direction(locale)}
      className="min-h-full"
      style={brandingStyle(settings?.branding ?? null)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(locale, settings)),
        }}
      />
      <SiteHeader locale={locale} logo={settings?.logo ?? null} menu={settings?.menu ?? []} />
      {children}
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode && <VisualEditing />}
    </div>
  );
}
