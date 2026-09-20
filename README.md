# موقع شركة مصاعد — Next.js + Sanity

مشروع موقع إلكتروني احترافي لشركة متخصصة في المصاعد، مبني باستخدام Next.js وTypeScript وTailwind CSS وSanity CMS.

## 1. Create the Sanity project

Create a project at [sanity.io/manage](https://www.sanity.io/manage), or run `npx sanity@latest init`. Choose the existing project directory when prompted. Copy the project ID and dataset name from Sanity Manage.

## 2. Add environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

These values are read by `lib/sanity/config.ts` and `sanity.config.ts`.

## 3. Run the project

```bash
npm install
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio), create one **Hero** document, upload an image, and publish it. Then open [http://localhost:3000](http://localhost:3000) to see the published content.

## 4. Studio and checks

The Studio is embedded in the Next.js app, so there is no separate Studio server for this proof of concept. Edit the schema in `sanity/schemas/hero.ts` and the Studio config in `sanity.config.ts`.

```bash
npm run lint
npm run build
```

The page reads the newest published `hero` document from Sanity and uses Sanity's image URL builder for the hero image.

## Project structure

```text
app/
  page.tsx                         # Route composition only
  studio/[[...tool]]/page.tsx      # Embedded Sanity Studio route
features/hero/
  components/                      # Hero UI components
  schemas/                         # Runtime validation for Sanity responses
  services/                        # Hero data access and mapping
  types.ts                         # UI/domain types
lib/sanity/
  config.ts                        # Sanity client configuration
  image.ts                         # Sanity image URL helper
sanity/
  schemas/                         # Sanity Studio document schemas
sanity.config.ts                   # Studio configuration
```

The route does not import Sanity data or render the Hero markup directly. The service fetches and validates external content, then returns a UI-safe `Hero` model to the feature components. This keeps a future Strapi or another API data source isolated from the UI.
