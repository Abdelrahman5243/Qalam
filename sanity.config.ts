import { defineConfig } from "sanity";
import { defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./cms/documents";
import { env } from "./lib/env";
import { defaultLocale, locales } from "./lib/i18n";
import { homeSlug, pagePath } from "./lib/seo";

export default defineConfig({
  name: "default",
  title: "Website",
  basePath: "/admin",
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  schema: { types: schemaTypes },
  // Presentation comes first, so editors land on the live page and edit in place.
  plugins: [
    presentationTool({
      // Sites the preview may load from: this deployment, plus local development.
      // Each one must also be a CORS origin (with credentials) in the Sanity project.
      allowOrigins: [...new Set([new URL(env.sanity.previewUrl).origin, new URL(env.siteUrl).origin, "http://localhost:3000"])],
      previewUrl: {
        initial: env.sanity.previewUrl,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        // Open the right document when the preview navigates to a URL.
        mainDocuments: [
          {
            route: "/:locale",
            filter: `_type == "page" && slug.current == "${homeSlug}"`,
          },
          {
            route: "/:locale/:slug",
            filter: `_type == "page" && slug.current == $slug`,
          },
        ],
        // Show where a document appears on the site.
        locations: {
          page: defineLocations({
            select: { title: `title.${defaultLocale}`, slug: "slug.current" },
            resolve: (doc) => ({
              locations: locales.map((locale) => ({
                title: `${doc?.title} (${locale})`,
                href: pagePath(locale, doc?.slug ?? homeSlug),
              })),
            }),
          }),
        },
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website")
          .items([
            S.documentTypeListItem("page").title("Pages"),
            S.listItem()
              .title("Site settings")
              .child(
                S.document().schemaType("settings").documentId("settings"),
              ),
          ]),
    }),
  ],
});
