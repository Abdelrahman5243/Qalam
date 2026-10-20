import { defineSection } from "@/cms/define";

export const cta = defineSection({
  name: "cta",
  title: "Call to action",
  fields: {
    heading: { type: "text", required: true, max: 80 },
    text: "paragraph",
    button: { type: "link", required: true },
  },
});
