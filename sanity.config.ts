import { defineConfig } from "sanity";
import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const mainDocuments = defineDocuments([
  { route: "/ar", type: "homeHero" },
  { route: "/en", type: "homeHero" },
]);

const locations = {
  homeHero: defineLocations({
    select: {},
    resolve: () => ({
      locations: [
        { title: "Home (Arabic)", href: "/ar" },
        { title: "Home (English)", href: "/en" },
      ],
    }),
  }),
  siteSettings: defineLocations({
    select: {},
    resolve: () => ({
      locations: [
        { title: "Home (Arabic)", href: "/ar" },
        { title: "Home (English)", href: "/en" },
      ],
    }),
  }),
};

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
        mainDocuments,
        locations,
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website workspace")
          .items([
            S.listItem().title("Home hero").child(S.document().schemaType("homeHero").documentId("homeHero")),
            S.listItem()
              .title("Site settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
