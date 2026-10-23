import { defineDocument } from "./define";

export const project = defineDocument({
  name: "project",
  title: "Project",
  description: "A portfolio item with a summary, cover image and detailed story.",
  fields: {
    title: { type: "text", required: true, max: 100 },
    slug: {
      type: "slug",
      source: "title.en",
      required: true,
      description: 'The project address, for example "brand-refresh".',
    },
    summary: { type: "paragraph", required: true, max: 220 },
    cover: {
      type: "image",
      required: true,
      description: "The image shown on project cards and at the top of the detail page.",
    },
    body: {
      type: "richText",
      required: true,
      description: "The full project story, process, services and results.",
    },
    featured: {
      type: "boolean",
      title: "Featured project",
      description: "Use this to highlight the project on the listing page.",
    },
  },
});
