import { defineSection } from "@/cms/define";

export const faq = defineSection({
  name: "faq",
  title: "FAQ",
  description: "Frequently asked questions displayed with their answers.",
  fields: {
    heading: { type: "text", required: true, max: 80 },
    items: {
      type: "list",
      min: 1,
      fields: {
        question: { type: "text", required: true },
        answer: { type: "paragraph", required: true },
      },
    },
  },
});
