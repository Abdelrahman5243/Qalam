import { defineField, defineType } from "sanity";

export const clients = defineType({
  name: "clients",
  title: "Our clients",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
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
      name: "items",
      title: "Clients",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "name.ar", media: "logo" } },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
