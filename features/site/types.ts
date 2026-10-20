export type SiteImage = {
  url: string;
  alt: string;
};

export type SiteSettings = {
  logo: SiteImage | null;
  companyName: string;
  email: string | null;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: SiteImage | null;
  };
  branding: {
    primaryColor: string | null;
    accentColor: string | null;
    darkColor: string | null;
    bodyFont: string | null;
    headingFont: string | null;
  };
};

export type HomeHero = {
  status: string | null;
  headline: string | null;
  role: string | null;
  location: string | null;
  richDescription: RichText | null;
  primaryButtonLabel: string | null;
  primaryButtonHref: string | null;
  secondaryButtonLabel: string | null;
  secondaryButtonHref: string | null;
  socialLinks: Array<{ platform: string | null; label: string; url: string }>;
};

export type RichText = Array<{
  _key?: string;
  _type: "block";
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{ _key?: string; _type: "span"; text?: string; marks?: string[] }>;
  markDefs?: Array<{ _key?: string; _type: "link"; href?: string; blank?: boolean }>;
}>;
