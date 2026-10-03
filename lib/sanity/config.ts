import { createClient } from "next-sanity";

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01",
  studioUrl:
    process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3000/studio",
  // Site settings should reflect published CMS changes immediately.
  useCdn: false,
};

export const sanityClient = createClient(sanityConfig);

export const isSanityConfigured = Boolean(sanityConfig.projectId);
