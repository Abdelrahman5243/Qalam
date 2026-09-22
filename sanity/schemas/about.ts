import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About us",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localizedString",
      initialValue: { ar: "من نحن", en: "About us" },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      initialValue: { ar: "خبرة منذ 2010", en: "Experience Since 2010" },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "localizedString",
      initialValue: { ar: "اكتشف المزيد", en: "Discover More" },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { select: { title: "title.ar", media: "image" } },
});
