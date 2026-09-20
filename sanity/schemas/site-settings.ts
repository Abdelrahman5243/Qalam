import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "darkLogo", title: "Dark background logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "companyName", title: "Company name", type: "localizedString" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp URL", type: "url" }),
    defineField({ name: "email", title: "Email", type: "email" }),
    defineField({ name: "address", title: "Address", type: "localizedString" }),
    defineField({ name: "mapUrl", title: "Google Maps URL", type: "url" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "SEO title", type: "localizedString" }),
        defineField({ name: "description", title: "SEO description", type: "localizedText" }),
        defineField({ name: "ogImage", title: "Open Graph image", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "companyName.ar", media: "logo" } },
});
