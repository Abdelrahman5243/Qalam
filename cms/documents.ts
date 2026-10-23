import type { Rule } from "sanity";
import { defineDocument, toSchema } from "./define";
import { sections } from "../sections";
import { project } from "./project";

/** Length guidance as warnings: editors are told, publishing is not blocked. */
const maxLength = (max: number) => (rule: Rule) =>
  rule
    .max(max)
    .warning(`Search engines usually cut this after ${max} characters.`);

/** Search & sharing fields, used by every page and by the site-wide defaults. */
const seoFields = {
  title: {
    type: "text",
    title: "Meta title",
    description:
      "Shown in Google results and the browser tab. Leave empty to use the page title.",
    validation: maxLength(60),
  },
  description: {
    type: "paragraph",
    title: "Meta description",
    description:
      "One or two sentences shown under the title in Google. Aim for 120–160 characters.",
    recommended: true,
    validation: maxLength(160),
  },
  image: {
    type: "image",
    title: "Share image",
    description:
      "Shown when the link is shared on WhatsApp, LinkedIn, X… Best size: 1200×630.",
  },
} as const;

export const page = defineDocument({
  name: "page",
  title: "Page",
  fields: {
    title: { type: "text", required: true },
    slug: {
      type: "slug",
      source: "title.en",
      required: true,
      description:
        'The page address: "about" → /ar/about. Use "home" for the home page.',
    },
    sections: { type: "blocks", of: sections.map((section) => section.name) },
    seo: {
      type: "group",
      tab: true,
      title: "SEO",
      fields: {
        ...seoFields,
        noIndex: {
          type: "boolean",
          title: "Hide from search engines",
          description:
            "For thank-you pages, drafts or private pages. Also removes the page from the sitemap.",
        },
        canonical: {
          type: "url",
          title: "Canonical URL",
          description:
            "Advanced. Only if this content was first published at another address.",
        },
      },
    },
  },
});

export const settings = defineDocument({
  name: "settings",
  title: "Site settings",
  fields: {
    logo: "image",
    favicon: {
      type: "image",
      description:
        "The small icon in the browser tab. Square PNG or SVG, at least 512×512.",
    },
    companyName: "text",
    email: "email",
    menu: {
      type: "list",
      max: 8,
      fields: {
        label: { type: "text", required: true },
        href: {
          type: "string",
          title: "Link",
          description:
            "/about for a page on this site, or a full https://… address.",
          required: true,
        },
      },
    },
    seo: {
      type: "group",
      tab: true,
      title: "SEO",
      description:
        "Defaults for every page. A page's own SEO tab overrides them.",
      fields: {
        ...seoFields,
        title: {
          ...seoFields.title,
          title: "Site title",
          description: 'Added after every page title: "About | Site title".',
        },
        profiles: {
          type: "list",
          title: "Social profiles",
          description:
            "LinkedIn, GitHub, X… Helps Google connect the site to your profiles.",
          fields: { url: { type: "url", required: true } },
        },
        googleVerification: {
          type: "string",
          title: "Google Search Console code",
          description:
            'Advanced. The content value of the "google-site-verification" meta tag.',
        },
      },
    },
    branding: {
      type: "group",
      tab: true,
      fields: {
        primaryColor: {
          type: "string",
          description:
            "Buttons, links and highlights. Any CSS color, e.g. #ffbd25.",
        },
        accentColor: {
          type: "string",
          description: "Hover state of the primary color.",
        },
        bodyFont: {
          type: "string",
          description: 'A CSS font-family, e.g. "Cairo", sans-serif.',
        },
      },
    },
  },
});

export const schemaTypes = [
  toSchema(page, "document"),
  toSchema(settings, "document"),
  toSchema(project, "document"),
  ...sections.map((section) => toSchema(section)),
];
