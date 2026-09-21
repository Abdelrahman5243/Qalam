import { defineField, defineType } from "sanity";

export const projects = defineType({
  name: "projects",
  title: "Projects section",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localizedString" }),
    defineField({ name: "title", title: "Title", type: "localizedString" }),
    defineField({ name: "linkText", title: "Projects link text", type: "localizedString" }),
    defineField({
      name: "items",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", title: "Category", type: "localizedString" }),
            defineField({ name: "title", title: "Project name", type: "localizedString" }),
            defineField({ name: "location", title: "Location", type: "localizedString" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
          ],
          preview: { select: { title: "title.ar", media: "image", subtitle: "category.ar" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
