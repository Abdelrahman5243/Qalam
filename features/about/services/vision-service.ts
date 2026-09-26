import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";

import type { Vision } from "../types";

const visionQuery = `*[_id == "vision"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
  "title": coalesce(title[$locale], title.ar),
  "description": coalesce(description[$locale], description.ar)
}`;

type SanityVision = Partial<Vision> | null;

export async function getVision(locale: Locale): Promise<Vision | null> {
  if (!sanityClient.config().projectId) return null;

  try {
    const data = await sanityFetchData<SanityVision | null>(visionQuery, { locale });

    if (!data?.eyebrow || !data.title || !data.description) return null;

    return {
      eyebrow: data.eyebrow,
      title: data.title,
      description: data.description,
    };
  } catch (error) {
    console.error("Unable to load vision content from Sanity", error);
    return null;
  }
}
