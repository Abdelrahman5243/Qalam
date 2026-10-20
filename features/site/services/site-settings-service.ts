import type { Locale } from "@/lib/i18n";
import { querySanity } from "@/lib/sanity/live";
import { getImageUrl } from "@/lib/sanity/image";
import { cleanSanityText } from "@/lib/sanity/text";
import type { SiteSettings } from "../types";

const query = `*[_id == "siteSettings"][0]{ logo, "companyName": coalesce(companyName[$locale], companyName.ar, companyName), email, branding, "seoTitle": coalesce(seo.title[$locale], seo.title.ar, seo.title), "seoDescription": coalesce(seo.description[$locale], seo.description.ar, seo.description), "seoImage": seo.ogImage }`;
type ImageValue = { asset: { _ref: string; _type: "reference" }; alt?: string | null };
type Data = { logo?: ImageValue | null; companyName?: string | null; email?: string | null; branding?: SiteSettings["branding"] | null; seoTitle?: string | null; seoDescription?: string | null; seoImage?: ImageValue | null };

function clean(value: unknown) {
  return typeof value === "string" && value.trim() ? cleanSanityText(value) : null;
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  const data = await querySanity<Data | null>({ query, params: { locale }, name: "site settings" });
  if (!data) return null;
  return {
    logo: data.logo ? { url: getImageUrl(data.logo, { width: 480 }), alt: clean(data.logo.alt) || clean(data.companyName) || "Company logo" } : null,
    companyName: clean(data.companyName) || "New website",
    email: clean(data.email),
    seo: { title: clean(data.seoTitle), description: clean(data.seoDescription), ogImage: data.seoImage ? { url: getImageUrl(data.seoImage, { width: 1200 }), alt: clean(data.seoImage.alt) || "" } : null },
    branding: {
      primaryColor: clean(data.branding?.primaryColor), accentColor: clean(data.branding?.accentColor), darkColor: clean(data.branding?.darkColor),
      bodyFont: clean(data.branding?.bodyFont), headingFont: clean(data.branding?.headingFont),
    },
  };
}
