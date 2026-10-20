import { defineSection } from "@/cms/define";

export const features = defineSection({
  name: "features",
  title: "Features",
  fields: {
    heading: { type: "text", required: true, max: 80 },
    intro: "paragraph",
    items: {
      type: "list",
      min: 1,
      max: 12,
      fields: {
        title: { type: "text", required: true, max: 60 },
        text: "paragraph",
      },
    },
  },
});
