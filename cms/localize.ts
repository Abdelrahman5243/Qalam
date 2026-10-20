import { createImageUrlBuilder } from "@sanity/image-url";
import { env } from "@/lib/env";
import { defaultLocale, localizeHref, locales, type Locale } from "@/lib/i18n";

const images = createImageUrlBuilder({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
});

/** Shape raw Sanity data for the site: pick one language, turn images into URLs and slugs into strings, prefix internal links. */
export function localize<T>(value: unknown, locale: Locale): T {
  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);
    if (!value || typeof value !== "object") return value ?? null;

    const object = value as Record<string, unknown>;
    if (object._type === "slug") return object.current ?? null;
    if (object._type === "image") {
      return object.asset
        ? {
            url: images.image(object).auto("format").width(1600).url(),
            alt: (object.alt as string) ?? "",
          }
        : null;
    }
    const keys = Object.keys(object).filter((key) => !key.startsWith("_"));
    if (
      keys.length &&
      keys.every((key) => (locales as readonly string[]).includes(key))
    ) {
      return walk(object[locale] || object[defaultLocale]);
    }
    return Object.fromEntries(
      Object.entries(object).map(([key, item]) => [
        key,
        key === "href" && typeof item === "string"
          ? localizeHref(item, locale)
          : walk(item),
      ]),
    );
  };
  return walk(value) as T;
}
