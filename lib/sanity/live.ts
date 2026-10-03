import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import type { z } from "zod";

import { isSanityConfigured, sanityConfig } from "./config";

const serverReadToken = process.env.SANITY_API_READ_TOKEN;
const browserReadToken = process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN;

const liveClient = createClient({
  ...sanityConfig,
  perspective: "published",
  stega: { studioUrl: sanityConfig.studioUrl },
});

export const { sanityFetch, SanityLive } = defineLive({
  client: liveClient,
  serverToken: serverReadToken,
  browserToken: browserReadToken,
});

type QuerySanityOptions<T> = {
  query: string;
  params?: Record<string, unknown>;
  schema?: z.ZodType<T>;
  name: string;
};

/**
 * The application boundary for read-only Sanity content.
 *
 * Features provide a query, an optional boundary schema, and a useful name.
 * Configuration checks, live/draft fetching, validation, and diagnostics stay
 * here so feature services only map valid external data into domain models.
 */
export async function querySanity<T>({
  query,
  params = {},
  schema,
  name,
}: QuerySanityOptions<T>): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const { data } = await sanityFetch({ query, params });

    if (!schema) return data as T;

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      console.error(
        `Invalid ${name} content received from Sanity`,
        parsed.error.flatten(),
      );
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error(`Unable to load ${name} content from Sanity`, error);
    return null;
  }
}
