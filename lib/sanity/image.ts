import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { sanityConfig } from "./config";

const imageBuilder = createImageUrlBuilder(sanityConfig);

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}
