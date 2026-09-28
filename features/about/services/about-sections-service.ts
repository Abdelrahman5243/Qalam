import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";
import { urlFor } from "@/lib/sanity/image";

import type {
  AboutClients,
  AboutValues,
  Mission,
  QualitySafety,
} from "../types";

const aboutSectionsQuery = `{
  "mission": *[_id == "mission"][0]{
    "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
    "title": coalesce(title[$locale], title.ar),
    paragraphs[]{ "value": coalesce(value[$locale], value.ar) },
    image
  },
  "qualitySafety": *[_id == "qualitySafety"][0]{
    "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
    "title": coalesce(title[$locale], title.ar),
    "description": coalesce(description[$locale], description.ar),
    items[]{
      "title": coalesce(title[$locale], title.ar),
      "description": coalesce(description[$locale], description.ar)
    }
  },
  "values": *[_id == "values"][0]{
    "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
    "title": coalesce(title[$locale], title.ar),
    items[]{
      icon,
      "title": coalesce(title[$locale], title.ar),
      "description": coalesce(description[$locale], description.ar)
    }
  },
  "clients": *[_id == "clients"][0]{
    "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar),
    "title": coalesce(title[$locale], title.ar),
    "description": coalesce(description[$locale], description.ar),
    items[]{
      "name": coalesce(name[$locale], name.ar),
      logo
    }
  }
}`;

type LocalizedItem = { title?: string | null; description?: string | null };
type SanitySections = {
  mission?: {
    eyebrow?: string | null;
    title?: string | null;
    paragraphs?: Array<{ value?: string | null }> | null;
    image?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
  } | null;
  qualitySafety?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    items?: LocalizedItem[] | null;
  } | null;
  values?: {
    eyebrow?: string | null;
    title?: string | null;
    items?: Array<LocalizedItem & { icon?: AboutValues["items"][number]["icon"] | null }> | null;
  } | null;
  clients?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    items?: Array<{
      name?: string | null;
      logo?: {
        asset: { _ref: string; _type: "reference" };
        alt?: string | null;
      } | null;
    }> | null;
  } | null;
};

function listItems(items: LocalizedItem[] | null | undefined) {
  return (items ?? []).flatMap((item) =>
    item.title && item.description
      ? [{ title: item.title, description: item.description }]
      : [],
  );
}

export async function getAboutSections(locale: Locale): Promise<{
  mission: Mission | null;
  qualitySafety: QualitySafety | null;
  values: AboutValues | null;
  clients: AboutClients | null;
}> {
  const empty = { mission: null, qualitySafety: null, values: null, clients: null };
  if (!sanityClient.config().projectId) return empty;

  try {
    const data = await sanityFetchData<SanitySections | null>(aboutSectionsQuery, { locale });
    if (!data) return empty;

    const mission = data.mission;
    const missionParagraphs = (mission?.paragraphs ?? []).flatMap((paragraph) =>
      paragraph.value ? [paragraph.value] : [],
    );
    const missionResult =
      mission?.eyebrow && mission.title && missionParagraphs.length && mission.image
        ? {
            eyebrow: mission.eyebrow,
            title: mission.title,
            paragraphs: missionParagraphs,
            image: {
              url: urlFor(mission.image).width(1400).height(1000).fit("crop").auto("format").url(),
              alt: mission.image.alt || mission.title,
            },
          }
        : null;

    const quality = data.qualitySafety;
    const qualityItems = listItems(quality?.items);
    const qualityResult =
      quality?.eyebrow && quality.title && quality.description && qualityItems.length
        ? { eyebrow: quality.eyebrow, title: quality.title, description: quality.description, items: qualityItems }
        : null;

    const values = data.values;
    const valueItems = (values?.items ?? []).flatMap((item) =>
      item.icon && item.title && item.description
        ? [{ icon: item.icon, title: item.title, description: item.description }]
        : [],
    );
    const valuesResult =
      values?.eyebrow && values.title && valueItems.length
        ? { eyebrow: values.eyebrow, title: values.title, items: valueItems }
        : null;

    const clients = data.clients;
    const clientItems = (clients?.items ?? []).flatMap((item) =>
      item.name && item.logo
        ? [{
            name: item.name,
            logo: {
              url: urlFor(item.logo).width(480).fit("max").auto("format").url(),
              alt: item.logo.alt || item.name,
            },
          }]
        : [],
    );
    const clientsResult =
      clients?.eyebrow && clients.title && clients.description && clientItems.length
        ? { eyebrow: clients.eyebrow, title: clients.title, description: clients.description, items: clientItems }
        : null;

    return {
      mission: missionResult,
      qualitySafety: qualityResult,
      values: valuesResult,
      clients: clientsResult,
    };
  } catch (error) {
    console.error("Unable to load About sections from Sanity", error);
    return empty;
  }
}
