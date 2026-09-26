import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Elevator Company",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    presentationTool({
      previewUrl: {
        initial:
          process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL ??
          process.env.NEXT_PUBLIC_SITE_URL ??
          "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        locations: {
          hero: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "Home", href: "/ar" },
                { title: "Home (English)", href: "/en" },
              ],
            }),
          },
          about: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "About", href: "/ar/about" },
                { title: "About (English)", href: "/en/about" },
              ],
            }),
          },
          services: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "Services", href: "/ar/services" },
                { title: "Services (English)", href: "/en/services" },
              ],
            }),
          },
          projects: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "Projects", href: "/ar/projects" },
                { title: "Projects (English)", href: "/en/projects" },
              ],
            }),
          },
          brands: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "Home", href: "/ar" },
                { title: "Home (English)", href: "/en" },
              ],
            }),
          },
          whyChooseUs: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "Home", href: "/ar" },
                { title: "Home (English)", href: "/en" },
              ],
            }),
          },
          siteSettings: {
            select: {},
            resolve: () => ({
              locations: [
                { title: "Home", href: "/ar" },
                { title: "Home (English)", href: "/en" },
              ],
            }),
          },
          vision: {
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/ar/about" }] }),
          },
          mission: {
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/ar/about" }] }),
          },
          qualitySafety: {
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/ar/about" }] }),
          },
          values: {
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/ar/about" }] }),
          },
          clients: {
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/ar/about" }] }),
          },
        },
      },
    }),
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
              .id("aboutSections")
              .title("About sections")
              .child(
                S.list()
                  .title("About sections")
                  .items([
                    S.documentTypeListItem("about").title("About us"),
                    S.listItem()
                      .id("vision")
                      .title("Our vision")
                      .child(
                        S.document()
                          .schemaType("vision")
                          .documentId("vision"),
                      ),
                    S.listItem()
                      .id("mission")
                      .title("Our mission")
                      .child(S.document().schemaType("mission").documentId("mission")),
                    S.listItem()
                      .id("qualitySafety")
                      .title("Quality & safety")
                      .child(S.document().schemaType("qualitySafety").documentId("qualitySafety")),
                    S.listItem()
                      .id("values")
                      .title("Our values")
                      .child(S.document().schemaType("values").documentId("values")),
                    S.listItem()
                      .id("clients")
                      .title("Our clients")
                      .child(S.document().schemaType("clients").documentId("clients")),
                  ]),
              ),
            ...S.documentTypeListItems().filter(
              (item) =>
                ![
                  "siteSettings",
                  "brands",
                  "about",
                  "vision",
                  "mission",
                  "qualitySafety",
                  "values",
                  "clients",
                ].includes(
                  item.getId() || "",
                ),
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
