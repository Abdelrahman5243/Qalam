import { defineField, defineType } from "sanity";

export const homeHero = defineType({
  name: "homeHero",
  title: "Home hero",
  type: "document",
  preview: { prepare: () => ({ title: "Home hero" }) },
  fields: [
    defineField({ name: "status", title: "Availability badge", type: "localizedString" }),
    defineField({ name: "headline", title: "Name / headline", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role / subtitle", type: "localizedString" }),
    defineField({ name: "location", title: "Location", type: "localizedString" }),
    defineField({ name: "richDescription", title: "Introduction", type: "localizedRichText" }),
    defineField({ name: "primaryButtonLabel", title: "Primary button label", type: "localizedString" }),
    defineField({ name: "primaryButtonHref", title: "Primary button link", type: "string" }),
    defineField({ name: "secondaryButtonLabel", title: "Secondary button label", type: "localizedString" }),
    defineField({ name: "secondaryButtonHref", title: "Secondary button link", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      validation: (rule) => rule.max(6),
      of: [{ type: "object", fields: [
        defineField({ name: "platform", title: "Icon", type: "string", options: { list: ["email", "linkedin", "message", "github", "code", "globe"] } }),
        defineField({ name: "label", title: "Accessible label", type: "localizedString" }),
        defineField({ name: "url", title: "URL", type: "url" }),
      ] }],
    }),
  ],
});
