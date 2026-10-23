import { defineSection } from "@/cms/define";

export const cta = defineSection({
  name: "cta",
  title: "Call to action",
  description: "A focused prompt that guides visitors to take the next step.",
  fields: {
    heading: { type: "text", required: true, max: 80 },
    text: "paragraph",
    button: { type: "link", required: true },
  },
});
