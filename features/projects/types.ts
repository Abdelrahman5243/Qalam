import type { SiteImage } from "@/features/site/types";

export type ProjectItem = {
  slug: string;
  category: string;
  title: string;
  location: string;
  image: SiteImage;
  featured: boolean;
  content: import("@/features/services/types").RichTextBlock[];
};

export type ProjectsSection = {
  eyebrow: string;
  title: string;
  linkText: string;
  items: ProjectItem[];
};
