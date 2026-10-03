import { createDataAttribute } from "next-sanity";

import { sanityConfig } from "./config";

const siteSettingsData = createDataAttribute({
  id: "siteSettings",
  type: "siteSettings",
  baseUrl: sanityConfig.studioUrl,
  dataset: sanityConfig.dataset,
  projectId: sanityConfig.projectId,
});

export function siteSettingsPath(path: Parameters<typeof siteSettingsData>[0]) {
  return sanityConfig.projectId ? siteSettingsData(path) : undefined;
}
