import type { Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/config";
import { sanityFetchData } from "@/lib/sanity/live";
import { urlFor } from "@/lib/sanity/image";

import type { SiteSettings } from "../types";

const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  logo,
  mobileLogo,
  footerLogo,
  "companyName": coalesce(companyName[$locale], companyName.ar, companyName),
  phone,
  whatsapp,
  email,
  "address": coalesce(address[$locale], address.ar, address),
  mapUrl,
  formspreeFormId,
  socialLinks,
  "footerDescription": coalesce(footerDescription[$locale], footerDescription.ar, footerDescription),
  "seoTitle": coalesce(seo.title[$locale], seo.title.ar, seo.title),
  "seoDescription": coalesce(seo.description[$locale], seo.description.ar, seo.description),
  "seoImage": seo.ogImage
}`;

function normalizeWhatsAppUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const phone = url.searchParams.get("phone");

    if (phone && url.hostname.includes("whatsapp.com")) {
      return `https://wa.me/${phone.replace(/\D/g, "")}`;
    }

    if (url.hostname === "wa.me") {
      return `https://wa.me/${url.pathname.replace(/\D/g, "")}`;
    }
  } catch {
    return value;
  }

  return value;
}

function extractMapEmbedUrl(value?: string | null) {
  if (!value) return null;

  const iframeSrc = value.match(/<iframe[^>]+src=(['"])(.*?)\1/i)?.[2];
  return (iframeSrc || value.trim())
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

type SanitySettings = {
  logo: { asset: { _ref: string; _type: "reference" }; alt?: string | null };
  mobileLogo?: {
    asset: { _ref: string; _type: "reference" };
    alt?: string | null;
  } | null;
  footerLogo?: {
    asset: { _ref: string; _type: "reference" };
    alt?: string | null;
  } | null;
  companyName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  mapUrl?: string | null;
  formspreeFormId?: string | null;
  socialLinks?: Array<{ platform?: string | null; url?: string | null }> | null;
  footerDescription?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImage?: {
    asset: { _ref: string; _type: "reference" };
    alt?: string | null;
  } | null;
};

export async function getSiteSettings(
  locale: Locale,
): Promise<SiteSettings | null> {
  if (!sanityClient.config().projectId) {
    return null;
  }

  try {
    const data = await sanityFetchData<SanitySettings | null>(siteSettingsQuery, { locale });

    if (!data?.logo) {
      return null;
    }

    return {
      logo: {
        url: urlFor(data.logo).width(240).auto("format").url(),
        alt: data.logo.alt || data.companyName || "Company logo",
      },
      mobileLogo: data.mobileLogo
        ? {
            url: urlFor(data.mobileLogo)
              .width(256)
              .height(256)
              .fit("crop")
              .auto("format")
              .url(),
            alt: data.mobileLogo.alt || data.companyName || "Company logo",
          }
        : null,
      footerLogo: data.footerLogo
        ? {
            url: urlFor(data.footerLogo).width(800).auto("format").url(),
            alt: data.footerLogo.alt || data.companyName || "Company logo",
          }
        : null,
      companyName: data.companyName || "Next Generation Elevators",
      phone: data.phone || null,
      whatsappUrl: normalizeWhatsAppUrl(data.whatsapp),
      email: data.email || null,
      address: data.address || null,
      mapUrl: extractMapEmbedUrl(data.mapUrl),
      formspreeFormId: data.formspreeFormId || null,
      socialLinks: (data.socialLinks || [])
        .filter((link): link is { platform: string; url: string } =>
          Boolean(link.platform && link.url),
        )
        .map((link) => ({ platform: link.platform!, url: link.url! })),
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
