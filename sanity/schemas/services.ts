import { defineField, defineType } from "sanity";

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localizedString",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
    }),
    defineField({
      name: "linkText",
      title: "Link text",
      type: "localizedString",
      initialValue: { ar: "عرض كل الخدمات", en: "View All Services" },
    }),
    defineField({
      name: "items",
      title: "Services",
      type: "array",
      validation: (rule) =>
        rule.custom((items) => {
          if (!Array.isArray(items)) return true;
          const featuredCount = items.filter((item) => item?.featured === true).length;
          return featuredCount === 3
            ? true
            : "Select exactly 3 featured services for the homepage.";
        }),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "featured",
              title: "Featured on homepage",
              description: "Select exactly 3 services to show on the homepage.",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
