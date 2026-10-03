import { defineField, defineType } from "sanity";

export const projects = defineType({
  name: "projects",
  title: "Projects",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localizedString" }),
    defineField({ name: "title", title: "Title", type: "localizedString" }),
    defineField({
      name: "linkText",
      title: "Projects link text",
      type: "localizedString",
    }),
    defineField({
      name: "items",
      title: "Projects",
      type: "array",
      validation: (rule) =>
        rule.custom((items) => {
          if (!Array.isArray(items)) return true;
          const featuredCount = items.filter(
            (item) =>
              (item as { featured?: boolean } | null)?.featured === true,
          ).length;
          return featuredCount === 3
            ? true
            : "Select exactly 3 featured projects for the homepage.";
        }),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "slug",
              title: "URL slug / الرابط",
              type: "slug",
              options: { source: "title.ar", maxLength: 96 },
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "category",
              title: "Category",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Project name",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "content",
              title: "Project page content / محتوى صفحة المشروع",
              type: "localizedRichText",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text / وصف الصورة",
                  type: "string",
                  validation: (rule) => rule.required().min(8).max(140),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "featured",
              title: "Featured on homepage",
              description: "Select exactly 3 projects to show on the homepage.",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "title.ar",
              media: "image",
              subtitle: "category.ar",
            },
          },
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
