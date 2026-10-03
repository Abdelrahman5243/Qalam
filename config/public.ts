/** Public runtime configuration shared by the app and client components. */
export const publicConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || "",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "",
  googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "",
} as const;
