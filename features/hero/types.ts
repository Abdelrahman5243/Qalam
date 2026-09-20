export type HeroImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
};

export type Hero = {
  _id: string;
  title: string;
  description: string;
  image: HeroImage;
  ctaText?: string;
};
