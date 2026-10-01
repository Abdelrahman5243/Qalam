import type { MetadataRoute } from "next";

import { siteAssets } from "@/lib/site-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مصاعد الجيل القادم",
    short_name: "مصاعد الجيل القادم",
    description:
      "حلول المصاعد من توريد وتركيب وصيانة وخدمات ما بعد البيع في الرياض",
    start_url: "/ar",
    display: "standalone",
    background_color: "#f7f8f3",
    theme_color: "#1d4034",
    icons: [
      { src: siteAssets.icon192, sizes: "192x192", type: "image/png" },
      { src: siteAssets.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
}
