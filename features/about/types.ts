import type { SiteImage } from "@/features/site/types";

export type About = {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  image: SiteImage;
};

export type Vision = {
  eyebrow: string;
  title: string;
  description: string;
};

export type Mission = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: SiteImage;
};

export type QualitySafety = {
  eyebrow: string;
  title: string;
  description: string;
  items: AboutListItem[];
};

export type AboutValues = {
  eyebrow: string;
  title: string;
  items: Array<AboutListItem & { icon: "shield" | "award" | "zap" | "eye" }>;
};

export type AboutClients = {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{ name: string; logo: SiteImage }>;
};

export type AboutListItem = {
  title: string;
  description: string;
};
