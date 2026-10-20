import { defineSection } from "@/cms/define";

export const faq = defineSection({
  name: "faq",
  title: "FAQ",
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
