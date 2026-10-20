import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/cms/sanity";
import { env } from "@/lib/env";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: env.sanity.readToken }),
});
