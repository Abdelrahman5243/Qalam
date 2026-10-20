# Minimal bilingual website starter

A small Next.js App Router + TypeScript + Sanity starter with Arabic RTL and English LTR support.

## What it does

- Shows a complete editable landing page at `/ar` and `/en`.
- Reads the single dynamic Home hero (status, name, role, location, introduction, actions, and social links) from the `homeHero` document. Global identity, branding, and SEO stay in `siteSettings`.
- Keeps Sanity Studio at `/studio`, Draft Mode, live Sanity fetching, metadata, sitemap, and robots support.
- Uses one independent deployment and Sanity project per client.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the Sanity project, dataset, API version, site URL, and server-only `SANITY_API_READ_TOKEN`. Never expose that token through a `NEXT_PUBLIC_*` variable.

In `/studio`, create singleton documents with IDs `siteSettings` and `homeHero`. Edit the complete single-screen hero from `Home hero`; each label, link, and localized text has its own field. Branding and SEO remain optional advanced settings in `Site settings`.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
