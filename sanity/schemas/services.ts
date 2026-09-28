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
          const featuredCount = items.filter(
            (item) => (item as { featured?: boolean } | null)?.featured === true,
          ).length;
          return featuredCount === 4
            ? true
            : "Select exactly 4 featured services for the homepage.";
        }),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "slug", title: "URL slug / الرابط", type: "slug", options: { source: "title.ar", maxLength: 96 }, validation: (rule) => rule.required() }),

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
            defineField({ name: "content", title: "Service page content / محتوى صفحة الخدمة", type: "localizedRichText" }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Mobile icon / أيقونة الموبايل",
              description: "اختياري: ارفع SVG أو PNG مربعًا 128×128 تقريبًا. يظهر بدل الصورة على الموبايل.",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "featured",
              title: "Featured on homepage",
              description: "Select exactly 4 services to show on the homepage.",
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
