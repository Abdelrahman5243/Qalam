import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";
import { urlFor } from "@/lib/sanity/image";
import { normalizeContentSlug } from "@/lib/content-slug";

import type { ProjectsSection } from "../types";

const projectsQuery = `*[_type == "projects"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "linkText": coalesce(linkText[$locale], linkText.ar, linkText),
  items[]{
    "slug": slug.current,
    "arabicTitle": title.ar,
    "category": coalesce(category[$locale], category.ar, category),
    "title": coalesce(title[$locale], title.ar, title),
    "location": coalesce(location[$locale], location.ar, location),
    image,
    featured,
    content
  }
}`;

type SanityProjects = {
  eyebrow?: string | null;
  title?: string | null;
  linkText?: string | null;
  items?: Array<{
    slug?: string | null;
    arabicTitle?: string | null;
    category?: string | null;
    title?: string | null;
    location?: string | null;
    image?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    featured?: boolean | null;
    content?: { ar?: Array<Record<string, unknown>>; en?: Array<Record<string, unknown>> } | null;
  }> | null;
};

type ProjectsView = "featured" | "all";

function selectProjects(items: ProjectsSection["items"], view: ProjectsView) {
  return view === "featured"
    ? items.filter((item) => item.featured).slice(0, 3)
    : items;
}

type ProjectDetailData = Array<{
  slug?: string | null;
  arabicTitle?: string | null;
  titleAr?: string | null;
  titleEn?: string | null;
  categoryAr?: string | null;
  categoryEn?: string | null;
  locationAr?: string | null;
  locationEn?: string | null;
  image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
  content?: { ar?: Array<Record<string, unknown>>; en?: Array<Record<string, unknown>> } | null;
}>;

const projectDetailQuery = `*[_type == "projects"][0].items[]{
  "slug": slug.current,
  "arabicTitle": title.ar,
  "titleAr": title.ar,
  "titleEn": title.en,
  "categoryAr": category.ar,
  "categoryEn": category.en,
  "locationAr": location.ar,
  "locationEn": location.en,
  image, content
}`;

export async function getProjectBySlug(locale: Locale, slug: string) {
  if (!sanityClient.config().projectId) return null;
  try {
    const decodedSlug = decodeURIComponent(slug);
    const items = await sanityFetchData<ProjectDetailData>(projectDetailQuery);
    const item = items.find((candidate) => candidate.slug && normalizeContentSlug(candidate.slug) === normalizeContentSlug(decodedSlug));
    if (!item?.image) return null;
    const itemTitle = locale === "en"
      ? item.titleEn || item.titleAr || ""
      : item.titleAr || item.titleEn || "";
    if (!itemTitle) return null;
    return {
      slug: item.slug ? normalizeContentSlug(item.slug) : normalizeContentSlug(slug),
      category: locale === "en" ? item.categoryEn || item.categoryAr || "" : item.categoryAr || item.categoryEn || "",
      title: itemTitle,
      location: locale === "en" ? item.locationEn || item.locationAr || "" : item.locationAr || item.locationEn || "",
      image: { url: urlFor(item.image).width(1600).height(1000).fit("crop").auto("format").url(), alt: item.image.alt || itemTitle },
      content: (item.content?.[locale] || item.content?.ar || []) as ProjectsSection["items"][number]["content"],
    };
  } catch { return null; }
}

export async function getProjects(
  locale: Locale,
  view: ProjectsView = "all",
): Promise<ProjectsSection> {
  if (!sanityClient.config().projectId) {
    return { eyebrow: "", title: "", linkText: "", items: [] };
  }

  try {
    const data = await sanityFetchData<SanityProjects | null>(projectsQuery, { locale });

    const items = (data?.items ?? []).flatMap((item) => {
      if (!item.slug || !item.category || !item.title || !item.location || !item.image) return [];

      return [{
        slug: normalizeContentSlug(item.slug),
        category: item.category,
        title: item.title,
        location: item.location,
        image: {
          url: urlFor(item.image).width(1200).height(1100).fit("crop").auto("format").url(),
          alt: item.image.alt || item.title,
        },
        featured: item.featured === true,
        content: (item.content?.[locale] || item.content?.ar || []) as ProjectsSection["items"][number]["content"],
      }];
    });

    return {
      eyebrow: data?.eyebrow || "",
      title: data?.title || "",
      linkText: data?.linkText || "",
      items: selectProjects(items, view),
    };
  } catch (error) {
    console.error("Unable to load projects content from Sanity", error);
    return { eyebrow: "", title: "", linkText: "", items: [] };
  }
}
