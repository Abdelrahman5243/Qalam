import type { Locale } from "@/lib/i18n";
import { querySanity } from "@/lib/sanity/live";
import { getImageUrl } from "@/lib/sanity/image";
import { normalizeContentSlug } from "@/lib/content-slug";

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
    content?: {
      ar?: Array<Record<string, unknown>>;
      en?: Array<Record<string, unknown>>;
    } | null;
  }> | null;
};

type ServicesView = "featured" | "all";

function selectServices(items: ServicesSection["items"], view: ServicesView) {
  if (view !== "featured") return items;
  const featured = items.filter((item) => item.featured);
  const remaining = items.filter((item) => !item.featured);
  return [...featured, ...remaining].slice(0, 3);
}

type ServiceDetailData = Array<{
  slug?: string | null;
  arabicTitle?: string | null;
  titleAr?: string | null;
  titleEn?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  image?: {
    asset: { _ref: string; _type: "reference" };
    alt?: string | null;
  } | null;
  content?: {
    ar?: Array<Record<string, unknown>>;
    en?: Array<Record<string, unknown>>;
  } | null;
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
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    return null;
  }

  const items = await querySanity<ServiceDetailData>({
    query: serviceDetailQuery,
    name: "service detail",
  });
  const item = items?.find(
    (candidate) =>
      candidate.slug &&
      normalizeContentSlug(candidate.slug) ===
        normalizeContentSlug(decodedSlug),
  );
  if (!item?.image) return null;
  const itemTitle =
    locale === "en"
      ? item.titleEn || item.titleAr || ""
      : item.titleAr || item.titleEn || "";
  const itemDescription =
    locale === "en"
      ? item.descriptionEn || item.descriptionAr || ""
      : item.descriptionAr || item.descriptionEn || "";
  if (!itemTitle) return null;
  return {
    slug: item.slug
      ? normalizeContentSlug(item.slug)
      : normalizeContentSlug(slug),
    title: itemTitle,
    description: itemDescription,
    image: {
      url: getImageUrl(item.image, { width: 1400, height: 900, fit: "crop" }),
      alt: item.image.alt || itemTitle,
    },
    content: (item.content?.[locale] ||
      item.content?.ar ||
      []) as ServicesSection["items"][number]["content"],
  };
}

export async function getServices(
  locale: Locale,
  view: ServicesView = "all",
): Promise<ServicesSection> {
  const data = await querySanity<SanityServices | null>({
    query: servicesQuery,
    params: { locale },
    name: "services",
  });

  const items = (data?.items ?? []).flatMap((item) => {
    if (!item.slug || !item.title || !item.description || !item.image)
      return [];

    return [
      {
        slug: normalizeContentSlug(item.slug),
        title: item.title,
        description: item.description,
        image: {
          url: getImageUrl(item.image, {
            width: 1200,
            height: 900,
            fit: "crop",
          }),
          alt: item.image.alt || item.title,
        },
        icon: item.icon
          ? {
              url: getImageUrl(item.icon, {
                width: 128,
                height: 128,
                fit: "crop",
              }),
              alt: item.icon.alt || item.title,
            }
          : null,
        mobileImage: item.icon
          ? {
              url: getImageUrl(item.icon, {
                width: 1200,
                height: 900,
                fit: "crop",
              }),
              alt: item.icon.alt || item.title,
            }
          : null,
        featured: item.featured === true,
        content: (item.content?.[locale] ||
          item.content?.ar ||
          []) as ServicesSection["items"][number]["content"],
      },
    ];
  });

  return {
    eyebrow: data?.eyebrow || "",
    title: data?.title || "",
    linkText: data?.linkText || "",
    items: selectServices(items, view),
  };
}
