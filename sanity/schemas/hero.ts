import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "localizedString",
      initialValue: {
        ar: "مصاعد الجيل القادم",
        en: "Next generation elevators",
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      initialValue: {
        ar: "حلول مصاعد متقدمة مصممة لتلبية احتياجاتك",
        en: "Advanced Elevator Solutions Built Around Your Needs",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
      initialValue: {
        ar: "حلول متكاملة للمصاعد والسلالم المتحركة تجمع بين الجودة والأمان والكفاءة والتكنولوجيا الحديثة.",
        en: "Integrated elevator and escalator solutions combining quality, safety, efficiency, and modern technology.",
      },
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
      name: "ctaText",
      title: "CTA text",
      description: "Optional primary action text.",
      type: "localizedString",
      initialValue: { ar: "تواصل معنا", en: "Contact Us" },
    }),
    defineField({
      name: "secondaryCtaText",
      title: "Secondary CTA text",
      type: "localizedString",
      initialValue: { ar: "استكشف خدماتنا", en: "Explore our services" },
    }),
  ],
  preview: { select: { title: "title.ar", media: "image" } },
});
