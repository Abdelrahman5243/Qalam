import { defineSection } from "@/cms/define";

export const hero = defineSection({
  name: "hero",
  title: "Hero",
  fields: {
    status: { type: "text", max: 40 },
    headline: { type: "text", required: true, min: 2, max: 80 },
    role: { type: "text", max: 80 },
    location: "text",
    description: "richText",
    primaryButton: { type: "link", required: true },
    secondaryButton: "link",
    socials: {
      type: "list",
      max: 6,
      fields: {
        icon: {
          type: "string",
          required: true,
          options: ["email", "linkedin", "message", "github", "code", "globe"],
        },
        label: { type: "text", required: true },
        url: {
          type: "url",
          required: true,
          validation: (rule) => rule.uri({ scheme: ["https", "mailto"] }),
        },
      },
    },
  },
});
