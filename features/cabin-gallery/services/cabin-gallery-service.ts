import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";
import { urlFor } from "@/lib/sanity/image";
import type { SiteImage } from "@/features/site/types";

export type CabinDesign = {
  image: SiteImage;
  width: number;
  height: number;
};

export type CabinGallery = {
  title: string;
  description: string;
  items: CabinDesign[];
};

const cabinGalleryQuery = '*[_type == "cabinGallery"][0]{' +
  '"title": coalesce(title[$locale], title.ar, title),' +
  '"description": coalesce(description[$locale], description.ar, description),' +
  'items[]{image, "dimensions": image.asset->metadata.dimensions{width, height}}' +
'}';

type SanityCabinGallery = {
  title?: string | null;
  description?: string | null;
  items?: Array<{
    image?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    dimensions?: { width?: number; height?: number } | null;
  }> | null;
};

export async function getCabinGallery(locale: Locale): Promise<CabinGallery | null> {
  if (!sanityClient.config().projectId) return null;

  try {
    const data = await sanityFetchData<SanityCabinGallery | null>(cabinGalleryQuery, { locale });
    if (!data) return null;

    return {
      title: data.title || (locale === "ar" ? "ديكورات كبائن 2026" : "Cabin Designs 2026"),
      description: data.description || (locale === "ar"
        ? "استكشف مجموعة مختارة من تصاميم وتشطيبات كبائن المصاعد."
        : "Explore a curated collection of elevator cabin designs and finishes."),
      items: (data.items || []).flatMap((item) => {
        if (!item.image) return [];
        return [{
          image: {
            url: urlFor(item.image).width(1200).auto("format").url(),
            alt: item.image.alt || "Elevator cabin design",
          },
          width: item.dimensions?.width || 1200,
          height: item.dimensions?.height || 1200,
        }];
      }),
    };
  } catch (error) {
    console.error("Unable to load cabin gallery from Sanity", error);
    return null;
  }
}
