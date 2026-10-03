import type { MetadataRoute } from "next";
import { publicConfig } from "@/config/public";
import { environment } from "@/config/environment";

export default function robots(): MetadataRoute.Robots {
  const isPreview = environment.isPreview;

  if (isPreview) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const siteUrl = publicConfig.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
