export const environment = {
  isDevelopment: process.env.NODE_ENV !== "production",
  isPreview: process.env.VERCEL_ENV === "preview",
} as const;
