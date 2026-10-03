import { querySanity } from "@/lib/sanity/live";
import type { Locale } from "@/lib/i18n";

import { sanityHeroSchema } from "../schemas/hero-schema";
import type { Hero } from "../types";
import { getImageUrl } from "@/lib/sanity/image";

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
  const hero = await querySanity({
    query: heroQuery,
    params: { locale },
    schema: sanityHeroSchema,
    name: "hero",
  });

  if (!hero) return null;

  return {
    _id: hero._id,
    eyebrow: resolveCopy(hero.eyebrow, "eyebrow", locale),
    title: resolveCopy(hero.title, "title", locale),
    description: resolveCopy(hero.description, "description", locale),
    ctaText: resolveCopy(hero.ctaText, "ctaText", locale),
    secondaryCtaText: resolveCopy(
      hero.secondaryCtaText,
      "secondaryCtaText",
      locale,
    ),
    image: {
      url: getImageUrl(hero.image, { width: 1600, height: 1800, fit: "crop" }),
      alt: hero.image.alt || hero.title,
    },
  };
}
