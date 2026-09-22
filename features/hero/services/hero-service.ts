import { sanityClient } from "@/lib/sanity/config";
import type { Locale } from "@/lib/i18n";

import { sanityHeroSchema } from "../schemas/hero-schema";
import type { Hero } from "../types";
import { urlFor } from "@/lib/sanity/image";

const heroQuery = `*[_type == "hero"] | order(_updatedAt desc)[0]{
  _id,
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "description": coalesce(description[$locale], description.ar, description),
  image,
  "ctaText": coalesce(ctaText[$locale], ctaText.ar, ctaText),
  "secondaryCtaText": coalesce(secondaryCtaText[$locale], secondaryCtaText.ar, secondaryCtaText)
}`;

const heroDefaults = {
  ar: {
    eyebrow: "مصاعد الجيل القادم",
    title: "حلول مصاعد متقدمة مصممة لتلبية احتياجاتك",
    description:
      "حلول متكاملة للمصاعد والسلالم المتحركة تجمع بين الجودة والأمان والكفاءة والتكنولوجيا الحديثة.",
    ctaText: "تواصل معنا",
    secondaryCtaText: "استكشف خدماتنا",
  },
  en: {
    eyebrow: "Next generation elevators",
    title: "Advanced Elevator Solutions Built Around Your Needs",
    description:
      "Integrated elevator and escalator solutions combining quality, safety, efficiency, and modern technology.",
    ctaText: "Contact Us",
    secondaryCtaText: "Explore our services",
  },
} as const;

function resolveCopy(
  value: string | null | undefined,
  fallback: string,
  locale: Locale,
) {
  const placeholderValues = new Set([
    "عربي",
    "english",
    "desc",
    "description",
    "save",
    "title",
  ]);
  const normalizedValue = value?.trim().toLowerCase();

  return normalizedValue && !placeholderValues.has(normalizedValue)
    ? value!.trim()
    : heroDefaults[locale][
        fallback as keyof (typeof heroDefaults)[typeof locale]
      ];
}

export async function getHero(locale: Locale): Promise<Hero | null> {
  if (!sanityClient.config().projectId) {
    return null;
  }

  try {
    const data = await sanityClient.fetch<unknown>(
      heroQuery,
      { locale },
      { next: { revalidate: 60 } },
    );
    const parsedHero = sanityHeroSchema.safeParse(data);

    if (!parsedHero.success) {
      console.error(
        "Invalid hero content received from Sanity",
        parsedHero.error.flatten(),
      );
      return null;
    }

    return {
      _id: parsedHero.data._id,
      eyebrow: resolveCopy(parsedHero.data.eyebrow, "eyebrow", locale),
      title: resolveCopy(parsedHero.data.title, "title", locale),
      description: resolveCopy(
        parsedHero.data.description,
        "description",
        locale,
      ),
      ctaText: resolveCopy(parsedHero.data.ctaText, "ctaText", locale),
      secondaryCtaText: resolveCopy(
        parsedHero.data.secondaryCtaText,
        "secondaryCtaText",
        locale,
      ),
      image: {
        url: urlFor(parsedHero.data.image)
          .width(1600)
          .height(1800)
          .fit("crop")
          .auto("format")
          .url(),
        alt: parsedHero.data.image.alt || parsedHero.data.title,
      },
    };
  } catch (error) {
    console.error("Unable to load hero content from Sanity", error);
    return null;
  }
}
