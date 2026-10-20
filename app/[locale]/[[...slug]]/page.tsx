import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { getPage, getSettings } from "@/cms/sanity";
import { isLocale } from "@/lib/i18n";
import { homeSlug, pageJsonLd, pageMetadata } from "@/lib/seo";
import { Sections } from "@/sections/render";

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

/** /ar → "home", /ar/about → "about". */
async function resolve(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, slug: slug?.join("/") ?? homeSlug };
}

/** Page and settings for SEO. Metadata is plain text, so the invisible click-to-edit markers are stripped. */
async function getSeoData(params: Props["params"]) {
  const { locale, slug } = await resolve(params);
  const [page, settings] = await Promise.all([getPage(slug, locale), getSettings(locale)]);
  return { locale, slug, page: stegaClean(page), settings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(await getSeoData(params));
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await resolve(params);
  const [page, seo, { isEnabled: isDraftMode }] = await Promise.all([getPage(slug, locale), getSeoData(params), draftMode()]);
  if (!page) notFound();
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd(seo)) }} />
      <Sections page={page} locale={locale} isDraftMode={isDraftMode} />
    </main>
  );
}
