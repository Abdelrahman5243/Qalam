import { defineField, defineType } from "sanity";

export const brands = defineType({
  name: "brands",
  title: "Brands & partners",
  type: "document",
  fields: [
    defineField({ name: "enabled", title: "Show section", type: "boolean", initialValue: false }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localizedString" }),
    defineField({ name: "title", title: "Title", type: "localizedString" }),
    defineField({ name: "description", title: "Description", type: "localizedText" }),
    defineField({
      name: "items",
      title: "Brands and partners",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "localizedString" }),
            defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
            defineField({ name: "url", title: "Website URL", type: "url" }),
          ],
          preview: { select: { title: "name.ar", media: "logo" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar", media: "items.0.logo" } },
});
