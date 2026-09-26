import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

import { sanityConfig } from "./config";

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

/** Central Sanity boundary: published data normally, drafts + stega in Draft Mode. */
export async function sanityFetchData<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const { data } = await sanityFetch({ query, params });
  return data as T;
}
