import type { Locale } from "@/lib/i18n";
import { querySanity } from "@/lib/sanity/live";
import { cleanSanityText } from "@/lib/sanity/text";
import type { HomeHero } from "../types";
import type { RichText } from "../types";

type Localized = { ar?: string | null; en?: string | null } | null;
type LocalizedRichText = { ar?: RichText | null; en?: RichText | null } | null;
type Data = {
  status?: Localized;
  headline?: Localized;
  role?: Localized;
  location?: Localized;
  richDescription?: LocalizedRichText;
  primaryButtonLabel?: Localized;
  primaryButtonHref?: string | null;
  secondaryButtonLabel?: Localized;
  secondaryButtonHref?: string | null;
  socialLinks?: Array<{ platform?: string | null; label?: Localized; url?: string }> | null;
};

const query = `*[_id == "homeHero"][0]{ status, headline, role, location, richDescription, primaryButtonLabel, primaryButtonHref, secondaryButtonLabel, secondaryButtonHref, socialLinks[]{ label, url } }`;

function text(value: unknown, locale: Locale) {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const selected = item[locale] || item.ar || item.en;
  return typeof selected === "string" && selected.trim() ? cleanSanityText(selected) : null;
}

function richText(value: LocalizedRichText | undefined, locale: Locale) {
  const selected = value?.[locale] || value?.ar || value?.en;
  return Array.isArray(selected) && selected.length ? selected : null;
}

export async function getHomeHero(locale: Locale): Promise<HomeHero> {
  const data = await querySanity<Data | null>({ query, params: { locale }, name: "home hero" });
  return {
    status: text(data?.status, locale),
    headline: text(data?.headline, locale),
    role: text(data?.role, locale),
    location: text(data?.location, locale),
    richDescription: richText(data?.richDescription, locale),
    primaryButtonLabel: text(data?.primaryButtonLabel, locale),
    primaryButtonHref: typeof data?.primaryButtonHref === "string" ? data.primaryButtonHref : null,
    secondaryButtonLabel: text(data?.secondaryButtonLabel, locale),
    secondaryButtonHref: typeof data?.secondaryButtonHref === "string" ? data.secondaryButtonHref : null,
    socialLinks: (data?.socialLinks || []).flatMap((link) => {
      const label = text(link.label, locale);
      return label && link.url ? [{ platform: link.platform || null, label, url: link.url }] : [];
    }),
  };
}
