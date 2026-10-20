const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const env = {
  siteUrl,
  isPreview: process.env.VERCEL_ENV === "preview",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "",
  googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "",
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01",
    // Both default to this site: the dashboard lives at /admin on the same domain.
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || `${siteUrl}/admin`,
    previewUrl: process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL || siteUrl,
    readToken: process.env.SANITY_API_READ_TOKEN,
  },
};
