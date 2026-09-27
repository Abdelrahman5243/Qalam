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

const serviceSlugAliases: Record<string, string> = {
  "توريد وتركيب المصاعد": "elevator-supply-installation",
  "\"الصيانة والإصلاح \"": "maintenance-repair",
  "الصيانة والإصلاح": "maintenance-repair",
  "خدمات ما بعد البيع": "after-sales-services",
  "تحديث وتطوير المصاعد": "elevator-modernization",
  "elevator supply & installation": "elevator-supply-installation",
  "maintenance & repair": "maintenance-repair",
  "after-sales services": "after-sales-services",
  "elevator modernization": "elevator-modernization",
  "maintenance-&-repair": "maintenance-repair",
};

function normalizeServiceKey(value: string | null | undefined) {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function canonicalServiceSlug(slug: string | null | undefined, arabicTitle: string | null | undefined, title: string) {
  const normalizedSlug = normalizeServiceKey(slug);
  const slugAsTitle = normalizedSlug.replace(/-/g, " ");

  return (
    serviceSlugAliases[normalizeServiceKey(arabicTitle)] ||
    serviceSlugAliases[normalizeServiceKey(title)] ||
    serviceSlugAliases[slugAsTitle] ||
    normalizedSlug ||
    title.toLowerCase().replace(/\s+/g, "-")
  );
}

function selectServices(items: ServicesSection["items"], view: ServicesView) {
  if (view !== "featured") return items;
  const featured = items.filter((item) => item.featured);
  const remaining = items.filter((item) => !item.featured);
  return [...featured, ...remaining].slice(0, 4);
}

type ServiceDetailData = { slug?: string | null; title?: string | null; description?: string | null; image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null; content?: { ar?: Array<Record<string, unknown>>; en?: Array<Record<string, unknown>> } | null };

const serviceDetailQuery = `*[_type == "services"][0].items[slug.current == $slug || slug.current == $rawSlug || title.ar == $title][0]{
  "slug": slug.current,
  "title": coalesce(title[$locale], title.ar, title),
  "description": coalesce(description[$locale], description.ar, description),
  image, content
}`;

export async function getServiceBySlug(locale: Locale, slug: string) {
  if (!sanityClient.config().projectId) return null;
  try {
    const decodedSlug = decodeURIComponent(slug);
    const normalizedSlug = normalizeServiceKey(decodedSlug);
    const canonicalSlug = serviceSlugAliases[normalizedSlug] || serviceSlugAliases[normalizedSlug.replace(/-/g, " ")] || normalizedSlug;
    const title = Object.entries(serviceSlugAliases).find(
      ([key, value]) =>
        value === normalizedSlug ||
        key === normalizedSlug ||
        key.replace(/\s+/g, "-") === normalizedSlug,
    )?.[0] ||
      (normalizedSlug.includes("-") && !/^[a-z0-9-]+$/i.test(normalizedSlug)
        ? normalizedSlug.replace(/-/g, " ")
        : null);
    const item = await sanityFetchData<ServiceDetailData | null>(serviceDetailQuery, {
      locale,
      slug: canonicalSlug,
      rawSlug: decodedSlug,
      title,
    });
    if (!item?.title || !item.image) return null;
    return {
      slug: item.slug || slug,
      title: item.title,
      description: item.description || "",
      image: { url: urlFor(item.image).width(1400).height(900).fit("crop").auto("format").url(), alt: item.image.alt || item.title },
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
      if (!item.title || !item.description || !item.image) return [];

      return [{
        slug: canonicalServiceSlug(item.slug, item.arabicTitle, item.title),
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
