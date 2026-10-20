export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);
export const otherLocale = (locale: Locale): Locale =>
  locale === "ar" ? "en" : "ar";
export const direction = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Internal paths get the language prefix ("/about" → "/ar/about", "/" → "/ar"); full URLs stay as they are. */
export const localizeHref = (href: string, locale: Locale) => (href.startsWith("/") ? `/${locale}${href === "/" ? "" : href}` : href);
