import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";

import type { ServicesSection } from "../types";

const servicesQuery = `*[_type == "services"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "linkText": coalesce(linkText[$locale], linkText.ar, linkText),
  items[]{
    "title": coalesce(title[$locale], title.ar, title),
    "description": coalesce(description[$locale], description.ar, description),
    image,
    featured
  }
}`;

type SanityServices = {
  eyebrow?: string | null;
  title?: string | null;
  linkText?: string | null;
  items?: Array<{
    title?: string | null;
    description?: string | null;
    image?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    featured?: boolean | null;
  }> | null;
};

type ServicesView = "featured" | "all";

function selectServices(items: ServicesSection["items"], view: ServicesView) {
  return view === "featured"
    ? items.filter((item) => item.featured).slice(0, 3)
    : items;
}

export async function getServices(
  locale: Locale,
  view: ServicesView = "all",
): Promise<ServicesSection> {
  if (!sanityClient.config().projectId) {
    return { eyebrow: "", title: "", linkText: "", items: [] };
  }

  try {
    const data = await sanityClient.fetch<SanityServices | null>(
      servicesQuery,
      { locale },
      { next: { revalidate: 60 } },
    );

    const items = (data?.items ?? []).flatMap((item) => {
      if (!item.title || !item.description || !item.image) return [];

      return [{
        title: item.title,
        description: item.description,
        image: {
          url: urlFor(item.image).width(900).height(1100).fit("crop").auto("format").url(),
          alt: item.image.alt || item.title,
        },
        featured: item.featured === true,
      }];
    });

    return {
      eyebrow: data?.eyebrow || "",
      title: data?.title || "",
      linkText: data?.linkText || "",
      items: selectServices(items, view),
    };
  } catch (error) {
    console.error("Unable to load services content from Sanity", error);
    return { eyebrow: "", title: "", linkText: "", items: [] };
  }
}
