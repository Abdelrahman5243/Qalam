import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";

import type { SiteSettings } from "../types";

const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  logo,
  darkLogo,
  "companyName": coalesce(companyName[$locale], companyName.ar, companyName),
  phone,
  whatsapp,
  email,
  "address": coalesce(address[$locale], address.ar, address),
  mapUrl,
  socialLinks,
  "footerDescription": coalesce(footerDescription[$locale], footerDescription.ar, footerDescription),
  "seoTitle": coalesce(seo.title[$locale], seo.title.ar, seo.title),
  "seoDescription": coalesce(seo.description[$locale], seo.description.ar, seo.description),
  "seoImage": seo.ogImage
}`;

type SanitySettings = {
  logo: { asset: { _ref: string; _type: "reference" }; alt?: string | null };
  darkLogo?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
  companyName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  socialLinks?: Array<{ platform?: string | null; url?: string | null }> | null;
  footerDescription?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImage?: { asset: { _ref: string; _type: "reference" }; alt?: string | null } | null;
};

export async function getSiteSettings(locale: Locale): Promise<SiteSettings | null> {
  if (!sanityClient.config().projectId) {
    return null;
  }

  try {
    const data = await sanityClient.fetch<SanitySettings | null>(siteSettingsQuery, { locale }, { next: { revalidate: 60 } });

    if (!data?.logo) {
      return null;
    }

    return {
      logo: {
        url: urlFor(data.logo).width(240).auto("format").url(),
        alt: data.logo.alt || data.companyName || "Company logo",
      },
      darkLogo: data.darkLogo
        ? {
            url: urlFor(data.darkLogo).width(240).auto("format").url(),
            alt: data.darkLogo.alt || data.companyName || "Company logo",
          }
        : null,
      companyName: data.companyName || "Next Generation Elevators",
      phone: data.phone || null,
      whatsappUrl: data.whatsapp || null,
      email: data.email || null,
      address: data.address || null,
      mapUrl: data.mapUrl || null,
      socialLinks: (data.socialLinks || []).filter((link): link is { platform: string; url: string } => Boolean(link.platform && link.url)).map((link) => ({ platform: link.platform!, url: link.url! })),
      footerDescription: data.footerDescription || null,
      seo: {
        title: data.seoTitle || null,
        description: data.seoDescription || null,
        ogImage: data.seoImage
          ? {
              url: urlFor(data.seoImage).width(1200).auto("format").url(),
              alt: data.seoImage.alt || data.seoTitle || "",
            }
          : null,
      },
    };
  } catch (error) {
    console.error("Unable to load site settings from Sanity", error);
    return null;
  }
}
