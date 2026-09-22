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
      initialValue: { ar: "خدماتنا", en: "Our services" },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      initialValue: {
        ar: "حلول مصاعد لكل مساحة",
        en: "Elevator Solutions for Every Space",
      },
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
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "localizedText",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
