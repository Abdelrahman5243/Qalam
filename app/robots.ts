import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (env.isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
