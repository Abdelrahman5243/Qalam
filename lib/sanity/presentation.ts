import { createDataAttribute } from "next-sanity";
import { sanityConfig } from "./config";

const homeHeroData = createDataAttribute({
  id: "homeHero",
  type: "homeHero",
  baseUrl: sanityConfig.studioUrl,
  dataset: sanityConfig.dataset,
  projectId: sanityConfig.projectId,
});

const siteSettingsData = createDataAttribute({
  id: "siteSettings",
  type: "siteSettings",
  baseUrl: sanityConfig.studioUrl,
  dataset: sanityConfig.dataset,
  projectId: sanityConfig.projectId,
});

export function homeSectionPath(type: "homeHero", path: Parameters<typeof homeHeroData>[0]) {
  return sanityConfig.projectId ? homeHeroData(path) : undefined;
}

export function siteSettingsPath(path: Parameters<typeof siteSettingsData>[0]) {
  return sanityConfig.projectId ? siteSettingsData(path) : undefined;
}
