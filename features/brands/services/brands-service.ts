import type { Locale } from "@/lib/i18n";
import { environment } from "@/config/environment";
import { querySanity } from "@/lib/sanity/live";
import { getImageUrl } from "@/lib/sanity/image";

import type { BrandsSection } from "../types";

const brandsQuery = `*[_id == "brands"][0]{
  enabled,
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "description": coalesce(description[$locale], description.ar, description),
  items[]{
    "name": coalesce(name[$locale], name.ar, name),
    logo,
    url
  }
}`;

type SanityBrands = {
  enabled?: boolean | null;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  items?: Array<{
    name?: string | null;
    logo?: {
      asset: { _ref: string; _type: "reference" };
      alt?: string | null;
    } | null;
    url?: string | null;
  }> | null;
};

export async function getBrands(locale: Locale): Promise<BrandsSection | null> {
  const defaults =
    locale === "ar"
      ? {
          eyebrow: "شركاؤنا",
          title: "شراكات موثوقة",
          description: "نتعاون مع علامات وشركاء موثوقين لتقديم حلول متكاملة.",
        }
      : {
          eyebrow: "Our partners",
          title: "Trusted partnerships",
          description:
            "We work with trusted brands and partners to deliver complete solutions.",
        };
  const demoNames =
    locale === "ar"
      ? [
          "شريك تجريبي 01",
          "شريك تجريبي 02",
          "شريك تجريبي 03",
          "شريك تجريبي 04",
          "شريك تجريبي 05",
          "شريك تجريبي 06",
        ]
      : [
          "Demo Partner 01",
          "Demo Partner 02",
          "Demo Partner 03",
          "Demo Partner 04",
          "Demo Partner 05",
          "Demo Partner 06",
        ];
  const demoLogos = ["orbit", "vertex", "nova", "ascent", "axis", "liftline"];
  const demoItems = demoNames.map((name, index) => ({
    name,
    url: null,
    logo: { url: `/brands/${demoLogos[index]}.svg`, alt: name },
  }));

  try {
    const data = await querySanity<SanityBrands | null>({
      query: brandsQuery,
      params: { locale },
      name: "brands",
    });
    const items = (data?.items || [])
      .filter(
        (
          item,
        ): item is {
          name: string;
          logo: NonNullable<typeof item.logo>;
          url?: string | null;
        } => Boolean(item.name && item.logo),
      )
      .map((item) => ({
        name: item.name,
        url: item.url || null,
        logo: {
          url: getImageUrl(item.logo, { width: 320, height: 160, fit: "crop" }),
          alt: item.logo.alt || item.name,
        },
      }));

    if (!data && environment.isDevelopment) {
      return { enabled: true, ...defaults, items: demoItems };
    }

    if (!data?.enabled || !items.length) {
      return null;
    }

    return {
      enabled: true,
      eyebrow: data.eyebrow || defaults.eyebrow,
      title: data.title || defaults.title,
      description: data.description || defaults.description,
      items,
    };
  } catch (error) {
    // Keep the demo fallback for unexpected feature mapping errors.
    console.error("Unable to map brands content", error);
    return environment.isDevelopment
      ? { enabled: true, ...defaults, items: demoItems }
      : null;
  }
}
