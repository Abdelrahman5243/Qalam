import { defineSection } from "@/cms/define";

export const textImage = defineSection({
  name: "textImage",
  title: "Text + image",
  fields: {
    heading: { type: "text", required: true, max: 80 },
    body: "richText",
    image: "image",
    imageSide: { type: "string", title: "Image side", options: ["end", "start"] },
    button: "link",
  },
});
