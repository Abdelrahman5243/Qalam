import { defineField, defineType } from "sanity";

const portableTextBlock = {
  type: "block",
  styles: [
    { title: "Paragraph", value: "normal" },
    { title: "Heading 3", value: "h3" },
    { title: "Heading 4", value: "h4" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Underline", value: "underline" },
      { title: "Strike", value: "strike-through" },
    ],
    annotations: [
      {
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.required() }),
          defineField({ name: "blank", title: "Open in new tab", type: "boolean", initialValue: true }),
        ],
      },
    ],
  },
};

export const localizedRichText = defineType({
  name: "localizedRichText",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({ name: "ar", title: "Arabic", type: "array", of: [portableTextBlock] }),
    defineField({ name: "en", title: "English", type: "array", of: [portableTextBlock] }),
  ],
});
