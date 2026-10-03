import type { Locale } from "@/lib/i18n";
import { querySanity } from "@/lib/sanity/live";

import type { Vision } from "../types";

const visionQuery = `*[_id == "vision"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
  "title": coalesce(title[$locale], title.ar),
  "description": coalesce(description[$locale], description.ar)
}`;

type SanityVision = Partial<Vision> | null;

export async function getVision(locale: Locale): Promise<Vision | null> {
  const data = await querySanity<SanityVision | null>({
    query: visionQuery,
    params: { locale },
    name: "vision",
  });

  if (!data?.eyebrow || !data.title || !data.description) return null;

  return {
    eyebrow: data.eyebrow,
    title: data.title,
    description: data.description,
  };
}
