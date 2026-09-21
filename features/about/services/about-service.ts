import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";

import type { About } from "../types";

const aboutQuery = `*[_type == "about"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "description": coalesce(description[$locale], description.ar, description),
  "ctaText": coalesce(ctaText[$locale], ctaText.ar, ctaText),
  image
}`;

type SanityAbout = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  ctaText?: string | null;
  image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
};

export async function getAbout(locale: Locale, fallbackImage: About["image"]): Promise<About> {
  const defaults = locale === "ar"
    ? {
        eyebrow: "من نحن",
        title: "خبرة منذ 2010",
        description: "منذ عام 2010، نقدم حلولًا متكاملة للمصاعد والسلالم المتحركة تجمع بين الجودة والأمان والكفاءة والتكنولوجيا الحديثة للسوق المحلي والإقليمي.",
        ctaText: "اكتشف المزيد",
      }
    : {
        eyebrow: "About us",
        title: "Experience Since 2010",
        description: "Established in 2010, we deliver integrated elevator and escalator solutions combining quality, safety, efficiency, and modern technology for the local and regional market.",
        ctaText: "Discover More",
      };

  if (!sanityClient.config().projectId) {
    return { ...defaults, image: fallbackImage };
  }

  try {
    const data = await sanityClient.fetch<SanityAbout | null>(aboutQuery, { locale }, { next: { revalidate: 60 } });
    return {
      eyebrow: data?.eyebrow || defaults.eyebrow,
      title: data?.title || defaults.title,
      description: data?.description || defaults.description,
      ctaText: data?.ctaText || defaults.ctaText,
      image: data?.image
        ? {
            url: urlFor(data.image).width(1400).height(900).fit("crop").auto("format").url(),
            alt: data.image.alt || data.title || defaults.title,
          }
        : fallbackImage,
    };
  } catch (error) {
    console.error("Unable to load about content from Sanity", error);
    return { ...defaults, image: fallbackImage };
  }
}
