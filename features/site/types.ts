export type SiteImage = {
  url: string;
  alt: string;
};

export type SiteSettings = {
  logo: SiteImage;
  darkLogo: SiteImage | null;
  companyName: string;
  phone: string | null;
  whatsappUrl: string | null;
  email: string | null;
  address: string | null;
  mapUrl: string | null;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: SiteImage | null;
  };
};
