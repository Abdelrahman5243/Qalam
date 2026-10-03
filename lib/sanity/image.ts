import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { sanityConfig } from "./config";

const imageBuilder = createImageUrlBuilder(sanityConfig);

export type ImageUrlOptions = {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
};

/** Return a CMS image URL without exposing the Sanity builder to features. */
export function getImageUrl(
  source: SanityImageSource,
  options: ImageUrlOptions = {},
) {
  const image = imageBuilder.image(source);
  if (options.width) image.width(options.width);
  if (options.height) image.height(options.height);
  if (options.fit) image.fit(options.fit);
  return image.auto("format").url();
}
