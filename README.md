# Minimal bilingual website starter

Next.js App Router + TypeScript + Sanity, with Arabic (RTL) and English (LTR).

## Structure

```
app/            routes only
cms/            the only place that knows about Sanity
  define.ts     field DSL → Studio schema + TypeScript types
  documents.ts  the "page" and "settings" documents
  sanity.ts     client, live fetching, getPage / getSettings
sections/       one folder per page section
  index.ts      section registry (what editors can add)
  render.tsx    section name → component
components/     site header, status pages
  ui/           shared pieces (Section, ButtonLink, RichText)
migrations/     content migrations (sanity migrations run <id>)
lib/            i18n, env, seo
```

## Adding a section

1. `sections/about/schema.ts`: describe the fields:

   ```ts
   export const about = defineSection({
     name: "about",
     title: "About",
     fields: {
       title: { type: "text", required: true, max: 80 },
       body: "richText",
       photo: "image",
     },
   });
   ```

2. `sections/about/about.tsx`: `export function About({ title, body, photo, locale }: SectionProps<typeof about>)`. Every field arrives as a typed prop, already in the current language.
3. Register it in `sections/index.ts` and `sections/render.tsx`. TypeScript fails if you forget the component.

Field types: `text`, `paragraph`, `richText`, `link` (localized), `string`, `url`, `email`, `image`, `boolean`, `slug`, `list` (repeatable `fields`), `group` (nested `fields`), `blocks` (sections).
Validation: `required`, `min`, `max`, or `validation: (rule) => …` for anything else. Localized fields apply it to every language.

## Included sections

| Section | Fields |
|---|---|
| `hero` | status, headline, role, location, description, two buttons, social links |
| `features` | heading, intro, cards (title + text) |
| `textImage` | heading, rich text, image (start/end), button |
| `faq` | heading, questions + answers |
| `cta` | heading, text, button |

Wrap a new section in `<Section heading intro>` from `components/ui/section` for the standard container and heading.

## Links

Write internal links without the language: `/about`. They become `/ar/about` or `/en/about` automatically (menu, buttons, rich text). Full URLs (`https://…`, `mailto:…`) are left as they are.

## Pages

Every page is a `page` document with a title, a slug and its own sections. The page with slug `home` is served at `/ar` and `/en`; any other slug at `/ar/<slug>` and `/en/<slug>`. Page SEO falls back to the site-wide SEO in Site settings. New pages appear in the sitemap automatically.

Text is click-to-edit in Presentation automatically (stega); no `data-sanity` attributes are needed.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. Never expose `SANITY_API_READ_TOKEN` through a `NEXT_PUBLIC_*` variable.
In `/admin`, create pages under **Pages** (add and reorder sections on each) and edit **Site settings**.

## Content migrations

Migrations live in `migrations/<id>/index.ts` and run with the Sanity CLI (after `npx sanity login`):

```bash
npx sanity migrations list
npx sanity migrations run example-pages               # dry run: shows the changes
npx sanity migrations run example-pages --no-dry-run  # applies them
```

`example-pages` adds an About page, a Services page and the header menu. It never overwrites existing content.

## Checks

```bash
npm run lint
npx tsc --noEmit
npx sanity schema validate
npm run build
```
