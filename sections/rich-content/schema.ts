import { defineSection } from "@/cms/define";

/** Long-form text for simple pages: privacy policy, terms, articles, "about" copy. */
export const richContent = defineSection({
  name: "richContent",
  title: "Rich content",
  fields: {
    heading: { type: "text", max: 100, description: "Optional. Shown above the content as the page heading." },
    body: {
      type: "richText",
      required: true,
      description: "Headings, lists, quotes, links, bold / italic / code, and images with captions.",
    },
  },
});
