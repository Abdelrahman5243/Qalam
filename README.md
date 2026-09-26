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
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3000/studio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_API_READ_TOKEN=viewer-only-token
SANITY_API_READ_TOKEN=server-only-token
```

These values are read by `lib/sanity/config.ts` and `sanity.config.ts`. `SANITY_API_READ_TOKEN` stays server-only. `NEXT_PUBLIC_SANITY_API_READ_TOKEN` must be a separate Viewer-only token used for live preview in the browser.

## Visual editing

The embedded Studio includes Presentation Tool. It opens the app in Draft Mode, and the shared `sanityFetchData(query, params)` wrapper automatically switches to draft content. Add `<SanityLive />` and `<VisualEditing />` only through `app/layout.tsx`; new pages should use the wrapper instead of calling a Sanity client directly.

## 3. Create the Formspree form

1. Create a form at [formspree.io](https://formspree.io/).
2. Copy its form ID from the endpoint `https://formspree.io/f/YOUR_FORM_ID`.
3. Open Sanity Studio → **Site settings** → **Contact** and save the Formspree form ID there.

Formspree handles the submission endpoint, email notifications, dashboard storage, and spam controls. The contact form keeps the existing client-side validation and success/error UX.

## 4. Run the project

```bash
npm install
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio), create one **Hero** document, upload an image, and publish it. Then open [http://localhost:3000](http://localhost:3000) to see the published content.

## 5. Studio and checks

The Studio is embedded in the Next.js app, so there is no separate Studio server for this proof of concept. Edit the schemas in `sanity/schemas/` and the Studio config in `sanity.config.ts`.

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
  write-client.ts                  # Server-only client with write token
sanity/schemas/                    # Sanity Studio document schemas
sanity.config.ts                   # Studio configuration
```

The route does not import Sanity data or render the Hero markup directly. The service fetches and validates external content, then returns a UI-safe `Hero` model to the feature components. This keeps a future Strapi or another API data source isolated from the UI.
