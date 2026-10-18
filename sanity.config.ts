import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Website starter",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    presentationTool({
      allowOrigins: ["http://localhost:3000", "http://preview.localhost:3000"],
      previewUrl: {
        initial: process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable", disable: "/api/draft-mode/disable" },
      },
      resolve: {
        locations: {
          siteSettings: {
            select: {},
            resolve: () => ({ locations: [{ title: "Home", href: "/ar" }, { title: "Home (English)", href: "/en" }] }),
          },
        },
      },
    }),
    structureTool(),
  ],
  schema: { types: schemaTypes },
});
