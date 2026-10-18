export type SiteImage = {
  url: string;
  alt: string;
};

export type SiteSettings = {
  logo: SiteImage | null;
  footerLogo: SiteImage | null;
  companyName: string;
  headline: string | null;
  description: string | null;
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
  socialLinks: Array<{ platform: string; url: string; icon: SiteImage | null }>;
  footerDescription: string | null;
  seo: {
    title: string | null;
    description: string | null;
    ogImage: SiteImage | null;
  };
  branding: {
    primaryColor: string | null;
    accentColor: string | null;
    darkColor: string | null;
    bodyFont: string | null;
    headingFont: string | null;
  };
};
