import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo, Manrope } from "next/font/google";
import "./globals.css";
import { siteAssets } from "@/lib/site-assets";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "شركة المصاعد",
  description: "حلول المصاعد والتركيب والصيانة للمشاريع السكنية والتجارية.",
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
      className={`h-full antialiased ${cairo.variable} ${manrope.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
