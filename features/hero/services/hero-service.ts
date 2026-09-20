import { sanityClient } from "@/lib/sanity/config";
import type { Hero } from "../types";

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

  return sanityClient.fetch<Hero | null>(heroQuery, {}, { next: { revalidate: 60 } });
}
