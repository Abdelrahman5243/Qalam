import type { Locale } from "@/lib/i18n";
import { querySanity } from "@/lib/sanity/live";
import { getImageUrl } from "@/lib/sanity/image";
import type { SiteSettings } from "../types";

const query = `*[_id == "siteSettings"][0]{ logo, "companyName": coalesce(companyName[$locale], companyName.ar, companyName), "headline": coalesce(headline[$locale], headline.ar, headline), "description": coalesce(description[$locale], description.ar, description), email, branding, "seoTitle": coalesce(seo.title[$locale], seo.title.ar, seo.title), "seoDescription": coalesce(seo.description[$locale], seo.description.ar, seo.description), "seoImage": seo.ogImage }`;
type ImageValue = { asset: { _ref: string; _type: "reference" }; alt?: string | null };
type Data = { logo?: ImageValue | null; companyName?: string | null; headline?: string | null; description?: string | null; email?: string | null; branding?: SiteSettings["branding"] | null; seoTitle?: string | null; seoDescription?: string | null; seoImage?: ImageValue | null };

export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  const data = await querySanity<Data | null>({ query, params: { locale }, name: "site settings" });
  if (!data) return null;
  return {
    logo: data.logo ? { url: getImageUrl(data.logo, { width: 480 }), alt: data.logo.alt || data.companyName || "Company logo" } : null,
    footerLogo: null,
    companyName: data.companyName || "New website",
    headline: data.headline || null,
    description: data.description || null,
    nationalNumber: null, taxNumber: null, commercialRegistration: null, emergencyPhone: null, maintenancePhone: null,
    phone: null, whatsappUrl: null, email: data.email || null, address: null, mapUrl: null, socialLinks: [], footerDescription: null,
    seo: { title: data.seoTitle || null, description: data.seoDescription || null, ogImage: data.seoImage ? { url: getImageUrl(data.seoImage, { width: 1200 }), alt: data.seoImage.alt || "" } : null },
    branding: {
      primaryColor: data.branding?.primaryColor || null, accentColor: data.branding?.accentColor || null, darkColor: data.branding?.darkColor || null,
      bodyFont: data.branding?.bodyFont || null, headingFont: data.branding?.headingFont || null,
    },
  };
}
