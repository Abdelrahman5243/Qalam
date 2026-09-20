export type HeroImage = {
  url: string;
  alt: string;
};

export type Hero = {
  _id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: HeroImage;
  ctaText: string | null;
  secondaryCtaText: string;
};
