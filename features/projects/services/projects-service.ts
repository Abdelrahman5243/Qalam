import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";
import { urlFor } from "@/lib/sanity/image";

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

const projectSlugAliases: Record<string, string> = {
  "فيلا سكنية خاصة": "private-residential-villa",
  "برج تجاري": "commercial-tower",
  "مركز طبي متخصص": "specialized-medical-center",
  "مركز تسوق": "shopping-center",
  "private residential villa": "private-residential-villa",
  "commercial tower": "commercial-tower",
  "specialized medical center": "specialized-medical-center",
  "shopping center": "shopping-center",
};

function normalizeProjectKey(value: string | null | undefined) {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function canonicalProjectSlug(slug: string | null | undefined, arabicTitle: string | null | undefined, title: string) {
  const normalizedSlug = normalizeProjectKey(slug);
  const slugAsTitle = normalizedSlug.replace(/-/g, " ");

  return (
    projectSlugAliases[normalizeProjectKey(arabicTitle)] ||
    projectSlugAliases[normalizeProjectKey(title)] ||
    projectSlugAliases[slugAsTitle] ||
    normalizedSlug ||
    title.toLowerCase().replace(/\s+/g, "-")
  );
}

function selectProjects(items: ProjectsSection["items"], view: ProjectsView) {
  return view === "featured"
    ? items.filter((item) => item.featured).slice(0, 3)
    : items;
}

type ProjectDetailData = { slug?: string | null; category?: string | null; title?: string | null; location?: string | null; image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null; content?: { ar?: Array<Record<string, unknown>>; en?: Array<Record<string, unknown>> } | null };

const projectDetailQuery = `*[_type == "projects"][0].items[slug.current == $slug || slug.current == $rawSlug || title.ar == $title][0]{
  "slug": slug.current,
  "category": coalesce(category[$locale], category.ar, category),
  "title": coalesce(title[$locale], title.ar, title),
  "location": coalesce(location[$locale], location.ar, location),
  image, content
}`;

export async function getProjectBySlug(locale: Locale, slug: string) {
  if (!sanityClient.config().projectId) return null;
  try {
    const decodedSlug = decodeURIComponent(slug);
    const normalizedSlug = normalizeProjectKey(decodedSlug);
    const canonicalSlug = projectSlugAliases[normalizedSlug] || projectSlugAliases[normalizedSlug.replace(/-/g, " ")] || normalizedSlug;
    const title = Object.entries(projectSlugAliases).find(
      ([key, value]) =>
        value === normalizedSlug ||
        key === normalizedSlug ||
        key.replace(/\s+/g, "-") === normalizedSlug,
    )?.[0] ||
      (normalizedSlug.includes("-") && !/^[a-z0-9-]+$/i.test(normalizedSlug)
        ? normalizedSlug.replace(/-/g, " ")
        : null);
    const item = await sanityFetchData<ProjectDetailData | null>(projectDetailQuery, {
      locale,
      slug: canonicalSlug,
      rawSlug: decodedSlug,
      title,
    });
    if (!item?.title || !item.image) return null;
    return {
      slug: item.slug || slug,
      category: item.category || "",
      title: item.title,
      location: item.location || "",
      image: { url: urlFor(item.image).width(1600).height(1000).fit("crop").auto("format").url(), alt: item.image.alt || item.title },
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
      if (!item.category || !item.title || !item.location || !item.image) return [];

      return [{
        slug: canonicalProjectSlug(item.slug, item.arabicTitle, item.title),
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
