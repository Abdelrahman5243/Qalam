import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";

import type { WhySection, WhyValue } from "../types";

const whyQuery = `*[_type == "whyChooseUs"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.ar, eyebrow),
  "title": coalesce(title[$locale], title.ar, title),
  items[]{
    icon,
    "title": coalesce(title[$locale], title.ar, title),
    "description": coalesce(description[$locale], description.ar, description)
  }
}`;

type SanityWhy = {
  eyebrow?: string | null;
  title?: string | null;
  items?: Array<Partial<WhyValue>> | null;
};

export async function getWhyChooseUs(locale: Locale): Promise<WhySection> {
  const defaults: WhySection = locale === "ar"
    ? {
        eyebrow: "لماذا نحن",
        title: "لماذا تختارنا؟",
        items: [
          { icon: "shield", title: "الأمان", description: "السلامة من أعلى أولوياتنا، وكل عملية تركيب تلتزم بالمعايير الدولية واللوائح المحلية." },
          { icon: "award", title: "الجودة", description: "التزام بخدمات عالية الجودة وتحسين مستمر في كل ما نقدمه." },
          { icon: "zap", title: "الابتكار", description: "نستخدم أحدث التقنيات والحلول المبتكرة لتقديم أنظمة مصاعد متقدمة." },
          { icon: "clock", title: "الاعتمادية", description: "حلول آمنة وموثوقة وفعالة مصممة لتعمل بكفاءة لسنوات طويلة." },
        ],
      }
    : {
        eyebrow: "Why choose us",
        title: "Why Choose Us",
        items: [
          { icon: "shield", title: "Safety", description: "Safety is one of our highest priorities. Every installation meets international standards and local regulations." },
          { icon: "award", title: "Quality", description: "Commitment to high-quality services and continuous improvement across all our offerings." },
          { icon: "zap", title: "Innovation", description: "Using modern technologies and innovative solutions to deliver advanced elevator systems." },
          { icon: "clock", title: "Reliability", description: "Providing safe, reliable, and efficient solutions designed to perform for decades." },
        ],
      };

  if (!sanityClient.config().projectId) {
    return defaults;
  }

  try {
    const data = await sanityClient.fetch<SanityWhy | null>(whyQuery, { locale }, { next: { revalidate: 60 } });
    return {
      eyebrow: data?.eyebrow || defaults.eyebrow,
      title: data?.title || defaults.title,
      items: data?.items?.length
        ? data.items.map((item, index) => ({ ...defaults.items[index % defaults.items.length], ...item })) as WhyValue[]
        : defaults.items,
    };
  } catch (error) {
    console.error("Unable to load why choose us content from Sanity", error);
    return defaults;
  }
}
