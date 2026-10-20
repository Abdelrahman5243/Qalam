import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { env } from "@/lib/env";
import { siteName } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: siteName,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const { googleTagManagerId: gtmId, googleAnalyticsId: gaId } = env;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
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
        {children}
      </body>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
