import type { SiteImage } from "@/features/site/types";

export type ProjectItem = {
  category: string;
  title: string;
  location: string;
  image: SiteImage;
};

export type ProjectsSection = {
  eyebrow: string;
  title: string;
  linkText: string;
  items: ProjectItem[];
};
