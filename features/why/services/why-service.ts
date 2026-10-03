import type { Locale } from "@/lib/i18n";
import { querySanity } from "@/lib/sanity/live";

import type { WhySection, WhyValue } from "../types";

const whyQuery = `*[_id == "whyChooseUs"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  items[]{
    icon,
    "title": coalesce(title[$locale], title.ar, title),
    "description": coalesce(description[$locale], description.ar, description)
  }
}`;

type SanityWhy = {
  eyebrow?: string | null;
  title?: string | null;
  items?: Array<{
    icon?: WhyValue["icon"] | null;
    title?: string | null;
    description?: string | null;
  }> | null;
};

export async function getWhyChooseUs(locale: Locale): Promise<WhySection> {
  const data = await querySanity<SanityWhy | null>({
    query: whyQuery,
    params: { locale },
    name: "why choose us",
  });

  const items = (data?.items ?? []).flatMap((item) => {
    if (!item.icon || !item.title || !item.description) return [];
    return [
      { icon: item.icon, title: item.title, description: item.description },
    ];
  });

  return { eyebrow: data?.eyebrow || "", title: data?.title || "", items };
}
