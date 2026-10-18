import type { MetadataRoute } from "next";


export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "New website",
    short_name: "Website",
    description: "A simple bilingual website starter.",
    start_url: "/ar",
    display: "standalone",
    background_color: "#f7f8f3",
    theme_color: "#1d4034",
  };
}
