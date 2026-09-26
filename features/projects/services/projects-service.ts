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
    "category": coalesce(category[$locale], category.ar, category),
    "title": coalesce(title[$locale], title.ar, title),
    "location": coalesce(location[$locale], location.ar, location),
    image,
    featured
  }
}`;

type SanityProjects = {
  eyebrow?: string | null;
  title?: string | null;
  linkText?: string | null;
  items?: Array<{
    category?: string | null;
    title?: string | null;
    location?: string | null;
    image?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    featured?: boolean | null;
  }> | null;
};

type ProjectsView = "featured" | "all";

function selectProjects(items: ProjectsSection["items"], view: ProjectsView) {
  return view === "featured"
    ? items.filter((item) => item.featured).slice(0, 3)
    : items;
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
        category: item.category,
        title: item.title,
        location: item.location,
        image: {
          url: urlFor(item.image).width(1200).height(1100).fit("crop").auto("format").url(),
          alt: item.image.alt || item.title,
        },
        featured: item.featured === true,
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
