import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Elevator Company",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .id("siteSettings")
              .title("Site settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.listItem()
              .id("brands")
              .title("Brands & partners")
              .child(S.document().schemaType("brands").documentId("brands")),
            ...S.documentTypeListItems().filter(
              (item) =>
                !["siteSettings", "brands"].includes(
                  item.getId() || "",
                ),
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
