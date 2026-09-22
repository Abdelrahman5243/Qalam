import { defineField, defineType } from "sanity";

export const mission = defineType({
  name: "mission",
  title: "Our mission",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "value",
            title: "Paragraph",
            type: "localizedText",
            validation: (rule) => rule.required(),
          }),
        ],
        preview: { select: { title: "value.ar" } },
      }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "title.ar", media: "image" } },
});
