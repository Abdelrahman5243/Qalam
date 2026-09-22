import type { MetadataRoute } from "next";

import { siteAssets } from "@/lib/site-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next Generation Elevators",
    short_name: "NGE",
    description:
      "Elevator installation, maintenance, and modern mobility solutions.",
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
