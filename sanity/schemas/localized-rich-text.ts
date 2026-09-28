import { defineField, defineType } from "sanity";

const richTextBlock = {
  type: "array",
  of: [{
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }],
    marks: { decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }] },
  }],
};

export const localizedRichText = defineType({
  name: "localizedRichText", title: "Localized rich text", type: "object",
  fields: [defineField({ name: "ar", title: "Arabic", ...richTextBlock }), defineField({ name: "en", title: "English", ...richTextBlock })],
});
