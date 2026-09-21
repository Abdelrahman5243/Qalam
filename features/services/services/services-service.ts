import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";

import type { ServicesSection } from "../types";

const servicesQuery = `*[_type == "services"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  "linkText": coalesce(linkText[$locale], linkText.ar, linkText),
  items[]{
    "title": coalesce(title[$locale], title.ar, title),
    "description": coalesce(description[$locale], description.ar, description),
    image
  }
}`;

type SanityServices = {
  eyebrow?: string | null;
  title?: string | null;
  linkText?: string | null;
  items?: Array<{
    title?: string | null;
    description?: string | null;
    image?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
  }> | null;
};

export async function getServices(locale: Locale, fallbackImage: ServicesSection["items"][number]["image"]): Promise<ServicesSection> {
  const defaults = locale === "ar"
    ? {
        eyebrow: "خدماتنا",
        title: "حلول مصاعد لكل مساحة",
        linkText: "عرض كل الخدمات",
        items: [
          ["التوريد والتركيب", "توريد وتركيب احترافي كامل مع الاختبار والتوثيق وفق معايير السلامة."],
          ["الصيانة والإصلاح", "صيانة دورية وإصلاحات طارئة وفحوصات شاملة للحفاظ على أفضل أداء."],
          ["خدمات ما بعد البيع", "دعم الضمان والمساعدة الفنية وقطع الغيار والاستجابة السريعة عند الحاجة."],
        ],
      }
    : {
        eyebrow: "Our services",
        title: "Elevator Solutions for Every Space",
        linkText: "View All Services",
        items: [
          ["Supply & Installation", "Complete elevator sourcing and professional installation with full testing and compliance documentation."],
          ["Maintenance & Repair", "Preventive maintenance, emergency repair, and comprehensive inspections to ensure optimal performance."],
          ["After-Sales Services", "Warranty support, technical assistance, spare parts, and emergency response for complete peace of mind."],
        ],
      };

  if (!sanityClient.config().projectId) {
    return {
      ...defaults,
      items: defaults.items.map(([title, description]) => ({ title, description, image: fallbackImage })),
    };
  }

  try {
    const data = await sanityClient.fetch<SanityServices | null>(servicesQuery, { locale }, { next: { revalidate: 60 } });
    const items = data?.items?.length ? data.items : [];

    return {
      eyebrow: data?.eyebrow || defaults.eyebrow,
      title: data?.title || defaults.title,
      linkText: data?.linkText || defaults.linkText,
      items: (items.length ? items : defaults.items).map((item, index) => {
        const fallback = defaults.items[index % defaults.items.length];
        return {
          title: Array.isArray(item) ? item[0] : item.title || fallback[0],
          description: Array.isArray(item) ? item[1] : item.description || fallback[1],
          image: !Array.isArray(item) && item.image
            ? { url: urlFor(item.image).width(900).height(1100).fit("crop").auto("format").url(), alt: item.image.alt || item.title || fallback[0] }
            : fallbackImage,
        };
      }),
    };
  } catch (error) {
    console.error("Unable to load services content from Sanity", error);
    return {
      ...defaults,
      items: defaults.items.map(([title, description]) => ({ title, description, image: fallbackImage })),
    };
  }
}
