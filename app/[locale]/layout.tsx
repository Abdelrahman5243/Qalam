import type { CSSProperties, ReactNode } from "react";
import type { Viewport } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { getSettings, SanityLive, type Settings } from "@/cms/sanity";
import { VisualEditing } from "@/cms/visual-editing";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/lib/env";
import { direction, isLocale, locales } from "@/lib/i18n";
import { siteMetadata } from "@/lib/seo";
import "../globals.css";

// Settings (logo, branding) can change at any time, so render on every request.
export const dynamic = "force-dynamic";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111113",
  colorScheme: "dark",
};

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return isLocale(locale) ? siteMetadata(await getSettings(locale)) : {};
}

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

const { googleTagManagerId: gtmId, googleAnalyticsId: gaId } = env;

/** Root layout of the website: <html lang dir> follows the page language, which search engines read. */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  // Only /ar and /en exist; anything else is a 404 (app/global-not-found.tsx).
  if (!isLocale(locale)) notFound();
  const [{ isEnabled: isDraftMode }, settings] = await Promise.all([
    draftMode(),
    getSettings(locale),
  ]);

  return (
    <html lang={locale} dir={direction(locale)} className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        style={brandingStyle(settings?.branding ?? null)}
      >
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              hidden
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <SiteHeader
          locale={locale}
          logo={settings?.logo ?? null}
          menu={settings?.menu ?? []}
        />
        {children}
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <VisualEditing />}
      </body>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
