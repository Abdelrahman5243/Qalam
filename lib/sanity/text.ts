import { stegaClean } from "@sanity/client/stega";

export function cleanSanityText(value: string) {
  return stegaClean(value);
}
