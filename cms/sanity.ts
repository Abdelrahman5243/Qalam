import { createClient, stegaClean } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { createImageUrlBuilder } from "@sanity/image-url";
import { env } from "@/lib/env";
import { defaultLocale, localizeHref, locales, type Locale } from "@/lib/i18n";
import type { SectionData } from "@/sections/render";
import type { Data } from "./define";
import type { page, settings } from "./documents";

const { projectId, dataset, apiVersion, studioUrl, readToken } =
  env.sanity;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: { studioUrl },
});

const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  // The same server-only token: next-sanity hands it to the browser only in draft mode (live preview).
  browserToken: readToken,
});
export { SanityLive };

const images = createImageUrlBuilder({ projectId, dataset });

export type Settings = Data<typeof settings.fields>;
export type Page = Omit<Data<typeof page.fields>, "sections"> & {
  _id: string;
  _type: "page";
  sections: SectionData[] | null;
};

/** Run a GROQ query; returns null when Sanity is not configured or the query fails. */
async function query<T>(
  groq: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!projectId) return null;
  try {
    const { data } = await sanityFetch({ query: groq, params });
    return data as T;
  } catch (error) {
    console.error("Sanity query failed:", groq, error);
    return null;
  }
}

// Settings feed metadata and CSS variables, not visual editing, so strip the stega markers.
export const getSettings = async (locale: Locale) =>
  stegaClean(
    localize<Settings>(await query(`*[_id == "settings"][0]`), locale),
  );

export const getPage = async (slug: string, locale: Locale) =>
  localize<Page>(
    await query(`*[_type == "page" && slug.current == $slug][0]`, { slug }),
    locale,
  );

/** Every page search engines may index, with its last edit date (used by the sitemap). */
export const getIndexablePages = async () =>
  (await query<Array<{ slug: string; updatedAt: string }>>(
    `*[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, "updatedAt": _updatedAt }`,
  )) ?? [];

/** Shape raw Sanity data for the site: pick one language, turn images into URLs and slugs into strings, prefix internal links. */
function localize<T>(value: unknown, locale: Locale): T {
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
      Object.entries(object).map(([key, item]) => [key, key === "href" && typeof item === "string" ? localizeHref(item, locale) : walk(item)]),
    );
  };
  return walk(value) as T;
}
