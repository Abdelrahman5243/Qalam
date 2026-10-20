export const env = {
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, ""),
  isPreview: process.env.VERCEL_ENV === "preview",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "",
  googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "",
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01",
    studioUrl:
      process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ??
      "http://localhost:3000/admin",
    previewUrl:
      process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000",
    readToken: process.env.SANITY_API_READ_TOKEN,
  },
};
