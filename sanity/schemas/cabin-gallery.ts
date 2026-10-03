import { defineField, defineType } from "sanity";

export const cabinGallery = defineType({
  name: "cabinGallery",
  title: "Cabin Designs 2026 / ديكورات كبائن 2026",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title / عنوان الصفحة",
      type: "localizedString",
      initialValue: { ar: "ديكورات كبائن 2026", en: "Cabin Designs 2026" },
    }),
    defineField({
      name: "description",
      title: "Page description / وصف الصفحة",
      type: "localizedText",
      initialValue: {
        ar: "استكشف مجموعة مختارة من تصاميم وتشطيبات كبائن المصاعد.",
        en: "Explore a curated collection of elevator cabin designs and finishes.",
      },
    }),
    defineField({
      name: "items",
      title: "Cabin designs / تصميمات الكبائن",
      description: "ارفع الصور بالترتيب الذي تريد ظهوره في الصفحة.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Cabin image / صورة الكابينة",
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
          ],
          preview: { select: { title: "image.alt", media: "image" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title.ar" } },
});
