import type { Locale } from "./i18n";

export const siteAssets = {
  logoHorizontalLight: "/logo/logo-horizontal-light.svg",
  logoStackedLight: "/logo/logo-stacked-light.svg",
  iconLight: "/icon/icon-light.svg",
  iconColor: "/icon/icon-color.svg",
  logoTransparent: "/logo/logo-horizontal-light.svg",
  logoWhiteBackground: "/og/og-image-1200x630.png",
  icon192: "/favicons/android-chrome-192.png",
  icon512: "/favicons/android-chrome-512.png",
  appleTouchIcon: "/favicons/apple-touch-icon.png",
  favicon16: "/favicons/favicon-16x16.png",
  favicon32: "/favicons/favicon-32x32.png",
  faviconIco: "/favicons/favicon.ico",
} as const;

export function getFallbackBrandImage(locale: Locale) {
  return {
    url: siteAssets.logoTransparent,
    alt: locale === "ar" ? "شعار شركة المصاعد" : "Next Generation Elevators logo",
  };
}
