import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "companyName", title: "Company name", type: "localizedString" }),
    defineField({ name: "headline", title: "Placeholder headline", type: "localizedString" }),
    defineField({ name: "description", title: "Placeholder description", type: "localizedText" }),
    defineField({ name: "email", title: "Email", type: "email" }),
    defineField({ name: "branding", title: "Branding", type: "object", fields: [
      defineField({ name: "primaryColor", title: "Primary color", type: "string" }),
      defineField({ name: "accentColor", title: "Accent color", type: "string" }),
      defineField({ name: "darkColor", title: "Dark color", type: "string" }),
      defineField({ name: "bodyFont", title: "Body font family", type: "string" }),
      defineField({ name: "headingFont", title: "Heading font family", type: "string" }),
    ] }),
    defineField({ name: "seo", title: "SEO defaults", type: "object", fields: [
      defineField({ name: "title", title: "Title", type: "localizedString" }),
      defineField({ name: "description", title: "Description", type: "localizedText" }),
      defineField({ name: "ogImage", title: "Sharing image", type: "image", options: { hotspot: true } }),
    ] }),
  ],
});
