import type { SiteImage } from "@/features/site/types";

export type BrandItem = {
  name: string;
  logo: SiteImage;
  url: string | null;
};

export type BrandsSection = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: BrandItem[];
};
