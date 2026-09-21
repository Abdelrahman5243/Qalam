import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";

import type { ProjectsSection } from "../types";

const projectsQuery = `*[_type == "projects"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "linkText": coalesce(linkText[$locale], linkText.ar, linkText),
  items[]{
    "category": coalesce(category[$locale], category.ar, category),
    "title": coalesce(title[$locale], title.ar, title),
    "location": coalesce(location[$locale], location.ar, location),
    image
  }
}`;

type SanityProjects = {
  eyebrow?: string | null;
  title?: string | null;
  linkText?: string | null;
  items?: Array<{
    category?: string | null;
    title?: string | null;
    location?: string | null;
    image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
  }> | null;
};

export async function getProjects(locale: Locale, fallbackImage: ProjectsSection["items"][number]["image"]): Promise<ProjectsSection> {
  const defaults = locale === "ar"
    ? {
        eyebrow: "مشاريعنا",
        title: "مصاعد داخل مساحات حقيقية",
        linkText: "عرض المشاريع",
        items: [
          ["مصعد منزلي", "فيلا النخيل", "الرياض، المملكة العربية السعودية"],
          ["مصعد ركاب", "برج المنار التجاري", "جدة، المملكة العربية السعودية"],
          ["مصعد مستشفى", "مركز الهلال الطبي", "الدمام، المملكة العربية السعودية"],
        ],
      }
    : {
        eyebrow: "Our projects",
        title: "Built Into Real Spaces",
        linkText: "View Projects",
        items: [
          ["Home Elevator", "Al Nakheel Residential Villa", "Riyadh, Saudi Arabia"],
          ["Passenger Elevator", "Manar Commercial Tower", "Jeddah, Saudi Arabia"],
          ["Hospital Elevator", "Al Hilal Medical Center", "Dammam, Saudi Arabia"],
        ],
      };

  const fallbackItems = defaults.items.map(([category, title, location]) => ({ category, title, location, image: fallbackImage }));

  if (!sanityClient.config().projectId) {
    return { ...defaults, items: fallbackItems };
  }

  try {
    const data = await sanityClient.fetch<SanityProjects | null>(projectsQuery, { locale }, { next: { revalidate: 60 } });
    const items = data?.items?.length ? data.items : [];

    return {
      eyebrow: data?.eyebrow || defaults.eyebrow,
      title: data?.title || defaults.title,
      linkText: data?.linkText || defaults.linkText,
      items: (items.length ? items : defaults.items).map((item, index) => {
        const fallback = defaults.items[index % defaults.items.length];
        return {
          category: Array.isArray(item) ? item[0] : item.category || fallback[0],
          title: Array.isArray(item) ? item[1] : item.title || fallback[1],
          location: Array.isArray(item) ? item[2] : item.location || fallback[2],
          image: !Array.isArray(item) && item.image
            ? { url: urlFor(item.image).width(1200).height(1100).fit("crop").auto("format").url(), alt: item.image.alt || item.title || fallback[1] }
            : fallbackImage,
        };
      }),
    };
  } catch (error) {
    console.error("Unable to load projects content from Sanity", error);
    return { ...defaults, items: fallbackItems };
  }
}
