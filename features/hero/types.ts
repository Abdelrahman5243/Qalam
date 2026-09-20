export type HeroImage = {
  url: string;
  alt: string;
};

export type Hero = {
  _id: string;
  title: string;
  description: string;
  image: HeroImage;
  ctaText: string | null;
};
