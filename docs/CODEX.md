# Codex Project Instructions

This file describes how Codex should work on this project.

## Project context

This is a production website for an elevator company. The stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sanity CMS
- Vercel

The client-facing requirements and content brief are documented in [`CLIENT_CONTENT.md`](./CLIENT_CONTENT.md).

## Working rules

- Keep the site Arabic-first and RTL unless a task explicitly requires another language.
- Keep client content separate from application logic and reusable UI components.
- Prefer small, focused feature folders under `features/`.
- Validate external Sanity data before passing it to UI components.
- Do not add a dependency when the requirement can be handled with existing Next.js, TypeScript, or CSS features.
- Before deleting a file, search the repository for imports and references to it.
- Do not commit secrets, real client credentials, or private contact data.
- Preserve existing user changes and avoid unrelated refactors.

## Content workflow

When client data is provided:

1. Put the content model in the relevant Sanity schema.
2. Add or update the feature service and runtime validation schema.
3. Keep presentation in the feature components.
4. Update [`CLIENT_CONTENT.md`](./CLIENT_CONTENT.md) when the approved brief changes.

## Verification

Run these checks after implementation:

```bash
npm run lint
npm run build
```

If Turbopack fails because of the local environment, verify the production build with:

```bash
npx next build --webpack
```

