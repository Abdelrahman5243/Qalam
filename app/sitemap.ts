import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
const routes = ["", "/about", "/services", "/projects", "/contact"];
export default function sitemap(): MetadataRoute.Sitemap {
  return ["ar", "en"].flatMap((locale) => routes.map((route) => ({ url: absoluteUrl(`/${locale}${route}`), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.7 })));
}
