# Minimal bilingual website starter

A small Next.js App Router + TypeScript + Sanity starter with Arabic RTL and English LTR support.

## What it does

- Shows a simple dynamic placeholder at `/ar` and `/en`.
- Reads company name, email, branding tokens, and SEO defaults from the `siteSettings` document.
- Keeps Sanity Studio at `/studio`, Draft Mode, live Sanity fetching, metadata, sitemap, and robots support.
- Uses one independent deployment and Sanity project per client.

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the Sanity project, dataset, API version, site URL, and server-only `SANITY_API_READ_TOKEN`. Never expose that token through a `NEXT_PUBLIC_*` variable.

In `/studio`, create a document with ID `siteSettings`. Add the company name in Arabic and English, then optionally add email, logo, colors, fonts, and SEO defaults. Missing data falls back to the built-in placeholder.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
