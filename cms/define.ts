import {
  defineArrayMember,
  type FieldDefinition,
  type Rule,
  type ObjectInputProps,
  type SchemaTypeDefinition,
} from "sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { createElement, type ReactNode } from "react";
import { defaultLocale, locales, type Locale } from "../lib/i18n";
import type { Edit } from "./edit";

/**
 * Content is described once, as plain objects. The Studio schema and the
 * TypeScript types are both derived from that description.
 *
 * Localized (one value per language): "text", "paragraph", "richText", "link".
 * Plain: "string", "url", "email", "image", "boolean", "slug".
 * Nested: "list" (repeatable fields), "group" (collapsible fields, or a tab with `tab: true`), "blocks" (sections).
 *
 * Every field can have a `title` and a `description` (help text shown under the label).
 */
type Kind =
  | "text"
  | "paragraph"
  | "richText"
  | "link"
  | "string"
  | "url"
  | "email"
  | "image"
  | "boolean"
  | "slug";

/**
 * Validation shortcuts, plus `validation` for anything else (regex, custom...).
 * `recommended` warns when empty but still allows publishing.
 */
type Rules = {
  required?: boolean;
  recommended?: boolean;
  min?: number;
  max?: number;
  validation?: (rule: Rule) => Rule;
};

type Label = { title?: string; description?: string };

type Field =
  | Kind
  | ({ type: Kind; options?: readonly string[]; source?: string } & Label &
      Rules)
  | ({ type: "list"; fields: Fields } & Label & Rules)
  | ({ type: "group"; fields: Fields; tab?: boolean } & Label)
  | ({ type: "blocks"; of: readonly string[] } & Label);

type Fields = Record<string, Field>;

export type Image = { url: string; alt: string; caption?: string };
export type Link = { label: string | null; href: string | null };

type Value<F> = F extends { type: "list"; fields: infer Of extends Fields }
  ? Array<Data<Of> & { _key: string }> | null
  : F extends { type: "group"; fields: infer Of extends Fields }
    ? Data<Of> | null
    : F extends { type: "blocks" }
      ? Array<{ _type: string; _key: string; isHidden?: boolean }> | null
      : F extends { type: infer K extends Kind }
        ? Value<K>
        : F extends "richText"
          ? PortableTextBlock[] | null
          : F extends "link"
            ? Link | null
            : F extends "image"
              ? Image | null
              : F extends "boolean"
                ? boolean | null
                : string | null;

/** The shape a definition has on the website, after a language is picked. */
export type Data<F extends Fields> = { [K in keyof F]: Value<F[K]> };

type Definition<F extends Fields = Fields, N extends string = string> = {
  name: N;
  title: string;
  description?: string;
  fields: F;
};

/** A block editors can add to any page. */
export const defineSection = <const N extends string, const F extends Fields>(
  definition: Definition<F, N>,
) => definition;

/** A standalone document (page, settings...). Same format as a section. */
export const defineDocument = defineSection;

/** Props of a section component: its fields, the page language, and `edit` for click-to-edit on non-text elements. */
export type SectionProps<D extends Definition> = Data<D["fields"]> & {
  locale: Locale;
  edit: Edit;
};

/* ---------- definition → Sanity schema ---------- */

/**
 * How a quote looks inside the Studio editor. Sanity's default wraps the line in a <p> that
 * ends up containing a <div> (invalid HTML, a hydration warning in development).
 */
const EditorQuote = ({ children }: { children?: ReactNode }) =>
  createElement(
    "blockquote",
    { style: { margin: 0, paddingInlineStart: "0.75rem", borderInlineStart: "3px solid var(--card-border-color)" } },
    children,
  );

const richTextBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Paragraph", value: "normal" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Heading 4", value: "h4" },
    { title: "Quote", value: "blockquote", component: EditorQuote },
  ],
  marks: {
    annotations: [
      {
        name: "link",
        type: "object",
        fields: [
          {
            name: "href",
            title: "Link",
            type: "string",
            description:
              "/about for a page on this site, or a full https://… address.",
            validation: (rule) =>
              rule.required().regex(/^(\/|https?:\/\/|mailto:|tel:)/, {
                name: "link",
                invert: false,
              }),
          },
          {
            name: "blank",
            title: "Open in new tab",
            type: "boolean",
            initialValue: false,
          },
        ],
      },
    ],
  },
});

/** An image placed between paragraphs, with alt text and an optional caption. */
const richTextImage = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [
    { name: "alt", title: "Alt text", type: "string", description: "Describe the image for screen readers and Google." },
    { name: "caption", title: "Caption", type: "string" },
  ],
});

/** Turn the shortcuts into one Sanity validation function (undefined when there are none). */
function toValidation({ required, recommended, min, max, validation }: Rules) {
  if (
    !required &&
    !recommended &&
    min === undefined &&
    max === undefined &&
    !validation
  )
    return undefined;
  return (rule: Rule) => {
    let result = required
      ? rule.required()
      : recommended
        ? rule.required().warning("Recommended")
        : rule;
    if (min !== undefined) result = result.min(min);
    if (max !== undefined) result = result.max(max);
    return validation ? validation(result) : result;
  };
}

const localizedTypes = {
  text: { type: "string" },
  paragraph: { type: "text", rows: 4 },
  richText: { type: "array", of: [richTextBlock, richTextImage] },
};

const isLocalized = (type: string): type is keyof typeof localizedTypes =>
  type in localizedTypes;

const titleOf = (name: string) =>
  name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

/** One sub-field per language, side by side. */
const localized = (kind: keyof typeof localizedTypes, rules: Rules = {}) => ({
  type: "object",
  options: { columns: 2 },
  fields: locales.map((locale) => ({
    name: locale,
    title: locale.toUpperCase(),
    ...localizedTypes[kind],
    validation: toValidation(rules),
  })),
});

function toShape(field: Exclude<Field, Kind>): object {
  switch (field.type) {
    case "list":
      return {
        type: "array",
        of: [
          {
            type: "object",
            fields: toFields(field.fields),
            // Show "مواقع شركات" for a list item, not the raw {ar, en} object.
            preview: { select: { title: labelPath(field.fields) ?? "_key" } },
          },
        ],
        validation: toValidation(field),
      };
    case "group":
      return {
        type: "object",
        options: field.tab ? undefined : { collapsible: true, collapsed: true },
        fields: toFields(field.fields),
      };
    case "blocks":
      return { type: "array", of: field.of.map((type) => ({ type })) };
    case "link":
      return {
        type: "object",
        fields: [
          { name: "label", ...localized("text", { required: field.required }) },
          {
            name: "href",
            type: "string",
            validation: toValidation({ required: field.required }),
          },
        ],
      };
    case "slug":
      return {
        type: "slug",
        options: { source: field.source },
        validation: toValidation(field),
      };
    case "image":
      return {
        type: "image",
        options: { hotspot: true },
        fields: [{ name: "alt", title: "Alt text", type: "string" }],
        validation: toValidation(field),
      };
    default:
      if (isLocalized(field.type)) return localized(field.type, field);
      return {
        type: field.type,
        options: field.options ? { list: [...field.options] } : undefined,
        validation: toValidation(field),
      };
  }
}

const toField = (name: string, field: Field): FieldDefinition => {
  const object = typeof field === "string" ? { type: field } : field;
  return {
    name,
    title: object.title ?? titleOf(name),
    description: "description" in object ? object.description : undefined,
    group: isTab(object) ? name : undefined,
    ...toShape(object),
  } as FieldDefinition;
};

const isTab = (field: Field) =>
  typeof field === "object" && field.type === "group" && !!field.tab;

const toFields = (fields: Fields): FieldDefinition[] =>
  Object.entries(fields).map(([name, field]) => toField(name, field));

const sectionVisibilityField: FieldDefinition = {
  name: "isHidden",
  title: "Hide this section",
  type: "boolean",
  initialValue: false,
  description: "Keep the content, but temporarily remove this section from the website.",
};

/** Show a section's author-facing description above its fields in Studio. */
function SectionInput(props: ObjectInputProps) {
  const description = props.schemaType.description;
  return createElement(
    "div",
    null,
    description &&
      createElement(
        "p",
        {
          style: {
            margin: "0 1rem 1rem",
            padding: "0.75rem 1rem",
            borderInlineStart: "3px solid var(--card-accent-color)",
            color: "var(--card-muted-fg-color)",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          },
        },
        description,
      ),
    props.renderDefault(props),
  );
}

const kindOf = (field: Field) => (typeof field === "string" ? field : field.type);

/** Path of the first field that can label an item: text in the default language, or a plain string / URL. */
function labelPath(fields: Fields) {
  const [name, field] = Object.entries(fields).find(([, f]) => ["text", "string", "url"].includes(kindOf(f))) ?? [];
  if (!name || !field) return undefined;
  return kindOf(field) === "text" ? `${name}.${defaultLocale}` : name;
}

/**
 * Studio preview. Sections show their type ("Hero") with their first text underneath;
 * documents show their own title ("Home", "About") with the type underneath.
 */
function toPreview({ title, fields }: Definition, type: "object" | "document") {
  const path = labelPath(fields);
  return {
    select: path ? { label: path } : {},
    prepare: ({ label }: { label?: string }) =>
      type === "object"
        ? { title, subtitle: label }
        : { title: label || title, subtitle: title },
  };
}

/** Tabs at the top of the form: "Content" for regular fields, plus one per `tab: true` group. */
function toTabs({ fields }: Definition) {
  const tabs = Object.entries(fields).filter(([, field]) => isTab(field));
  if (!tabs.length) return {};
  return {
    groups: [
      { name: "content", title: "Content", default: true },
      ...tabs.map(([name, field]) => ({
        name,
        title: (field as Label).title ?? titleOf(name),
      })),
    ],
    fields: toFields(fields).map((field) => ({
      ...field,
      group: field.group ?? "content",
    })),
  };
}

export const toSchema = (
  definition: Definition,
  type: "object" | "document" = "object",
) =>
  ({
    name: definition.name,
    title: definition.title,
    description: definition.description,
    type,
    fields:
      type === "object"
        ? [...toFields(definition.fields), sectionVisibilityField]
        : toFields(definition.fields),
    components: type === "object" ? { input: SectionInput } : undefined,
    ...toTabs(definition),
    preview: toPreview(definition, type),
  }) as SchemaTypeDefinition;
