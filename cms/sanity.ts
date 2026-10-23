import { createClient, stegaClean } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n";
import type { SectionData } from "@/sections/render";
import type { Data } from "./define";
import { localize } from "./localize";
import type { page, settings } from "./documents";
import type { project } from "./project";

const { projectId, dataset, apiVersion, studioUrl, readToken } = env.sanity;

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

export type Settings = Data<typeof settings.fields>;
export type Page = Omit<Data<typeof page.fields>, "sections"> & {
  _id: string;
  _type: "page";
  sections: SectionData[] | null;
};
export type Project = Data<typeof project.fields> & {
  _id: string;
  _type: "project";
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

export const getProjects = async (locale: Locale) =>
  localize<Project[]>(
    await query(
      `*[_type == "project" && defined(slug.current)] | order(featured desc, _createdAt desc)`,
    ),
    locale,
  );

export const getProject = async (slug: string, locale: Locale) =>
  localize<Project | null>(
    await query(`*[_type == "project" && slug.current == $slug][0]`, { slug }),
    locale,
  );

/** Every page search engines may index, with its last edit date (used by the sitemap). */
export const getIndexablePages = async () =>
  (await query<Array<{ slug: string; updatedAt: string }>>(
    `*[_type == "page" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, "updatedAt": _updatedAt }`,
  )) ?? [];
