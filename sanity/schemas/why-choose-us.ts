import { defineField, defineType } from "sanity";

export const whyChooseUs = defineType({
  name: "whyChooseUs",
  title: "Why choose us",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localizedString",
      initialValue: { ar: "لماذا نحن", en: "Why choose us" },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      initialValue: { ar: "لماذا تختارنا؟", en: "Why Choose Us" },
    }),
    defineField({
      name: "items",
      title: "Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: ["shield", "award", "zap", "clock"] },
            }),
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
          ],
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
