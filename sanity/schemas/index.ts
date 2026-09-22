import { hero } from "./hero";
import { about } from "./about";
import { localizedString } from "./localized-string";
import { localizedText } from "./localized-text";
import { siteSettings } from "./site-settings";
import { services } from "./services";
import { whyChooseUs } from "./why-choose-us";
import { projects } from "./projects";

export const schemaTypes = [
  localizedString,
  localizedText,
  hero,
  about,
  services,
  whyChooseUs,
  projects,
  siteSettings,
];
