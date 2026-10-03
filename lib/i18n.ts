export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isArabic(locale: Locale) {
  return locale === "ar";
}

export function getOtherLocale(locale: Locale): Locale {
  return isArabic(locale) ? "en" : "ar";
}

export function localizedPath(locale: Locale, path = "") {
  const normalizedPath =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function switchLocalePath(pathname: string | undefined, locale: Locale) {
  const path = pathname || "/";
  const withoutLocale = /^\/(?:ar|en)(?=\/|$)/.test(path)
    ? path.slice(3) || "/"
    : path;

  return localizedPath(locale, withoutLocale);
}
