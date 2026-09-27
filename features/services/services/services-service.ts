import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";
import { urlFor } from "@/lib/sanity/image";

import type { ServicesSection } from "../types";

const servicesQuery = `*[_type == "services"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "linkText": coalesce(linkText[$locale], linkText.ar, linkText),
  items[]{
    "slug": slug.current,
    "arabicTitle": title.ar,
    "title": coalesce(title[$locale], title.ar, title),
    "description": coalesce(description[$locale], description.ar, description),
    image,
    icon,
    featured,
    content
  }
}`;

type SanityServices = {
  eyebrow?: string | null;
  title?: string | null;
  linkText?: string | null;
  items?: Array<{
    slug?: string | null;
    arabicTitle?: string | null;
    title?: string | null;
    description?: string | null;
    image?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    icon?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    featured?: boolean | null;
    content?: { ar?: Array<Record<string, unknown>>; en?: Array<Record<string, unknown>> } | null;
  }> | null;
};

type ServicesView = "featured" | "all";

function selectServices(items: ServicesSection["items"], view: ServicesView) {
  if (view !== "featured") return items;
  const featured = items.filter((item) => item.featured);
  const remaining = items.filter((item) => !item.featured);
  return [...featured, ...remaining].slice(0, 4);
}

type ServiceDetailData = Array<{
  slug?: string | null;
  arabicTitle?: string | null;
  titleAr?: string | null;
  titleEn?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
  content?: { ar?: Array<Record<string, unknown>>; en?: Array<Record<string, unknown>> } | null;
}>;

const serviceDetailQuery = `*[_type == "services"][0].items[]{
  "slug": slug.current,
  "arabicTitle": title.ar,
  "titleAr": title.ar,
  "titleEn": title.en,
  "descriptionAr": description.ar,
  "descriptionEn": description.en,
  image, content
}`;

export async function getServiceBySlug(locale: Locale, slug: string) {
  if (!sanityClient.config().projectId) return null;
  try {
    const decodedSlug = decodeURIComponent(slug);
    const items = await sanityFetchData<ServiceDetailData>(serviceDetailQuery);
    const item = items.find((candidate) => candidate.slug === decodedSlug);
    if (!item?.image) return null;
    const itemTitle = locale === "en"
      ? item.titleEn || item.titleAr || ""
      : item.titleAr || item.titleEn || "";
    const itemDescription = locale === "en"
      ? item.descriptionEn || item.descriptionAr || ""
      : item.descriptionAr || item.descriptionEn || "";
    if (!itemTitle) return null;
    return {
      slug: item.slug || slug,
      title: itemTitle,
      description: itemDescription,
      image: { url: urlFor(item.image).width(1400).height(900).fit("crop").auto("format").url(), alt: item.image.alt || itemTitle },
      content: (item.content?.[locale] || item.content?.ar || []) as ServicesSection["items"][number]["content"],
    };
  } catch { return null; }
}

export async function getServices(
  locale: Locale,
  view: ServicesView = "all",
): Promise<ServicesSection> {
  if (!sanityClient.config().projectId) {
    return { eyebrow: "", title: "", linkText: "", items: [] };
  }

  try {
    const data = await sanityFetchData<SanityServices | null>(servicesQuery, { locale });

    const items = (data?.items ?? []).flatMap((item) => {
      if (!item.slug || !item.title || !item.description || !item.image) return [];

      return [{
        slug: item.slug,
        title: item.title,
        description: item.description,
        image: {
          url: urlFor(item.image).width(900).height(1100).fit("crop").auto("format").url(),
          alt: item.image.alt || item.title,
        },
        icon: item.icon
          ? {
              url: urlFor(item.icon).width(128).height(128).fit("crop").auto("format").url(),
              alt: item.icon.alt || item.title,
            }
          : null,
        featured: item.featured === true,
        content: (item.content?.[locale] || item.content?.ar || []) as ServicesSection["items"][number]["content"],
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
