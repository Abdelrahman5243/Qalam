<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Puck
- Strapi

## Architecture

- Use feature-based architecture
- Keep business logic outside UI components
- Prefer Server Components by default
- Use Client Components only when required
- Keep Puck configuration isolated from pages
- Keep portfolio data separate from rendering
- Use strict TypeScript
- Never use `any` unless absolutely necessary

## Components

- Use shadcn/ui for generic UI primitives
- Create reusable components instead of duplicating UI
- Keep components small and focused

## Naming

- Components: PascalCase
- Hooks: useCamelCase
- Utilities: camelCase
- Types: descriptive names

## Styling

- Tailwind CSS
- Use existing shadcn components before creating new primitives
- Avoid inline styles unless required

## Data

- Validate external data with Zod
- Do not expose secrets to the client
- Use `NEXT_PUBLIC_` only for values that are safe to expose

## Code Quality

- Do not modify unrelated files
- Do not install dependencies without a reason
- Run lint/typecheck after meaningful changes
- Fix errors instead of suppressing them

## API Architecture

- Build the frontend against an API layer from the beginning
- Use Next.js Route Handlers as the temporary backend during development
- Use mock data behind the API layer
- UI components must never depend directly on mock data
- Keep API calls in a dedicated service/data-access layer
- Keep domain types independent from the mock implementation
- The future Strapi integration should replace the data source without requiring UI rewrites
- Do not import mock data directly into components
