export type SiteImage = {
  url: string;
  alt: string;
};

export type SiteSettings = {
  logo: SiteImage;
  mobileLogo: SiteImage | null;
  footerLogo: SiteImage | null;
  companyName: string;
  phone: string | null;
  whatsappUrl: string | null;
  email: string | null;
  address: string | null;
  mapUrl: string | null;
  formspreeFormId: string | null;
  socialLinks: Array<{ platform: string; url: string }>;
  footerDescription: string | null;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: SiteImage | null;
  };
};
