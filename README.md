# Next Generation Elevators

A bilingual Arabic/English marketing website for an elevator and escalator company. The application is built with Next.js App Router, TypeScript, Sanity Studio, Framer Motion, and a feature-oriented frontend architecture.

## What is included

- Arabic RTL and English LTR routes under `/{locale}`.
- Sanity-powered hero, services, projects, about, brands, contact, and cabin gallery content.
- Embedded Sanity Studio at `/studio`.
- Draft Mode and Sanity Presentation Tool support.
- Localized metadata, canonical URLs, Open Graph, sitemap, robots, and JSON-LD.
- Responsive layouts with reduced-motion support.
- WhatsApp, phone, email, and contact-form flows.

## Requirements

- Node.js 22.12 or newer.
- npm 10 or newer.
- A Sanity project and dataset for CMS-backed content.

The current Next.js and Sanity dependency versions require Node 22.12+. Using Node 20 can make the development server appear to work while failing during production compilation.

## Getting started

```bash
npm install
npm run dev
```

Open:

- Website: `http://localhost:3000`
- Arabic home: `http://localhost:3000/ar`
- English home: `http://localhost:3000/en`
- Sanity Studio: `http://localhost:3000/studio`

The root route redirects to `/ar`.

## Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3000/studio
NEXT_PUBLIC_SANITY_PREVIEW_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Viewer-only token used by browser live preview.
NEXT_PUBLIC_SANITY_API_READ_TOKEN=viewer-only-token

# Server-only token used for draft content and must never be exposed to the browser.
SANITY_API_READ_TOKEN=server-only-token

# Optional public fallbacks and tracking.
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/your-number
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=
```

Public values are read through `config/public.ts`. Server-only values stay inside the Sanity infrastructure boundary.

## Architecture

```text
app/                  routes, layouts, metadata, JSON-LD
features/             domain-owned UI, services, schemas, and types
  site/               shared site chrome and page primitives
lib/                  Sanity, SEO, i18n, images, and cross-cutting adapters
config/               environment and public runtime configuration
styles/               design tokens, base rules, and shared layout foundations
sanity/               Sanity Studio schemas
```

The dependency direction is:

```text
app → features → lib/config
                    ↓
             Sanity / Next / browser APIs
```

Feature components receive UI-safe domain data. They do not create Sanity clients, read environment variables, or map CMS response objects.

### Sanity data access

All read-only Sanity queries use the small boundary below:

```ts
const data = await querySanity({
  query,
  params: { locale },
  schema,
  name: "feature content",
});
```

`lib/sanity/live.ts` owns configuration checks, live/draft fetching, optional Zod validation, and diagnostics. Each feature still owns its query, fallback content, mapper, and UI-safe types.

Sanity images use:

```ts
getImageUrl(source, { width: 1200, height: 900, fit: "crop" });
```

This keeps the Sanity image builder out of feature UI and gives each feature control over its intended crop and dimensions.

### CSS architecture

CSS is organized by ownership:

- `styles/tokens.css`: semantic colors, typography, spacing, containers, and motion values.
- `styles/base.css`: reset and document-level defaults.
- `styles/layout.css`: shared page geometry.
- `features/*/components/*.module.css`: feature-owned styles.
- `features/site/components/site.module.css`: shared site chrome and interior-page styles.
- `app/globals.css`: only Tailwind import, foundation imports, and genuinely global rules.

Feature modules currently use `:global(...)` selectors during migration so existing markup and visual behavior remain stable. This is intentional: ownership is separated first, then selectors can be converted to hashed `styles.*` APIs incrementally with browser comparison.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/CSS_ARCHITECTURE_AUDIT.md](docs/CSS_ARCHITECTURE_AUDIT.md) for detailed boundaries, migration decisions, and remaining CSS debt.

## Content workflow

1. Open `/studio`.
2. Create or edit the relevant document.
3. Publish the document for production content.
4. Use Presentation Tool/Draft Mode to preview unpublished content.

The primary Sanity schemas live in `sanity/schemas/`. Feature services validate and map external content before it reaches React components.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If npm executable links are disabled in the environment, run the installed binaries directly:

```bash
node node_modules/eslint/bin/eslint.js
node node_modules/typescript/bin/tsc --noEmit
node node_modules/next/dist/bin/next build --webpack
```

Before changing large CSS areas, verify Arabic and English routes at desktop and mobile widths. Preserve RTL/LTR behavior, reduced motion, keyboard focus, form states, and CMS fallback states.

## Useful scripts

```bash
npm run dev
npm run lint
npm run build
npm run sanity:seed
npm run sanity:prepare-import
```

## Further documentation

- [Architecture](docs/ARCHITECTURE.md)
- [CSS architecture audit](docs/CSS_ARCHITECTURE_AUDIT.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Client content guide](docs/CLIENT_CONTENT.md)
- [New section workflow](docs/NEW_SECTION_WORKFLOW.md)
