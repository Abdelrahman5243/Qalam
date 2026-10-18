import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { metadataBase } from "@/lib/seo";
import { publicConfig } from "@/config/public";

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "New website",
    template: "%s | New website",
  },
  description:
    "A simple, bilingual website starter.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {publicConfig.googleTagManagerId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${publicConfig.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        {children}
      </body>
      {publicConfig.googleTagManagerId ? (
        <GoogleTagManager gtmId={publicConfig.googleTagManagerId} />
      ) : null}
      {publicConfig.googleAnalyticsId ? (
        <GoogleAnalytics gaId={publicConfig.googleAnalyticsId} />
      ) : null}
    </html>
  );
}
