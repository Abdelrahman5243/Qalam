import type { SiteImage } from "@/features/site/types";

export type ServiceItem = {
  title: string;
  description: string;
  image: SiteImage;
  featured: boolean;
};

export type ServicesSection = {
  eyebrow: string;
  title: string;
  linkText: string;
  items: ServiceItem[];
};
