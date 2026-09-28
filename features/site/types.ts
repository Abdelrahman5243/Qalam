export type SiteImage = {
  url: string;
  alt: string;
};

export type SiteSettings = {
  logo: SiteImage;
  mobileLogo: SiteImage | null;
  footerLogo: SiteImage | null;
  companyName: string;
  nationalNumber: string | null;
  taxNumber: string | null;
  commercialRegistration: string | null;
  emergencyPhone: string | null;
  maintenancePhone: string | null;
  phone: string | null;
  whatsappUrl: string | null;
  email: string | null;
  address: string | null;
  mapUrl: string | null;
  formspreeFormId: string | null;
  socialLinks: Array<{ platform: string; url: string; icon: SiteImage | null }>;
  footerDescription: string | null;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: SiteImage | null;
  };
};
