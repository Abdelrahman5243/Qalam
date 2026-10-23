import { defineSection } from "@/cms/define";

export const textImage = defineSection({
  name: "textImage",
  title: "Text + image",
  description: "A content section combining rich text with an image and optional link.",
  fields: {
    heading: { type: "text", required: true, max: 80 },
    body: "richText",
    image: "image",
    imageSide: {
      type: "string",
      title: "Image side",
      options: ["end", "start"],
    },
    button: "link",
  },
});
