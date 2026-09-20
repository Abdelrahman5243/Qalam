import { sanityClient } from "@/lib/sanity/config";

import { sanityHeroSchema } from "../schemas/hero-schema";
import type { Hero } from "../types";
import { urlFor } from "@/lib/sanity/image";

const heroQuery = `*[_type == "hero"] | order(_updatedAt desc)[0]{
  _id,
  title,
  description,
  image,
  ctaText
}`;

export async function getHero(): Promise<Hero | null> {
  if (!sanityClient.config().projectId) {
    return null;
  }

  try {
    const data = await sanityClient.fetch<unknown>(heroQuery, {}, { next: { revalidate: 60 } });
    const parsedHero = sanityHeroSchema.safeParse(data);

    if (!parsedHero.success) {
      console.error("Invalid hero content received from Sanity", parsedHero.error.flatten());
      return null;
    }

    return {
      _id: parsedHero.data._id,
      title: parsedHero.data.title,
      description: parsedHero.data.description,
      ctaText: parsedHero.data.ctaText ?? null,
      image: {
        url: urlFor(parsedHero.data.image).width(1600).height(1800).fit("crop").auto("format").url(),
        alt: parsedHero.data.image.alt || parsedHero.data.title,
      },
    };
  } catch (error) {
    console.error("Unable to load hero content from Sanity", error);
    return null;
  }
}
