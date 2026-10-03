import type { SiteImage } from "@/features/site/types";

export type RichTextBlock = {
  _type?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{ text?: string; marks?: string[] }>;
};

export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  image: SiteImage;
  icon: SiteImage | null;
  mobileImage: SiteImage | null;
  featured: boolean;
  content: RichTextBlock[];
};

export type ServicesSection = {
  eyebrow: string;
  title: string;
  linkText: string;
  items: ServiceItem[];
};
