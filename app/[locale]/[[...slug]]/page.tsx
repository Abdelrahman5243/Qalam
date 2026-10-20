import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { getPage, getSettings } from "@/cms/sanity";
import { isLocale } from "@/lib/i18n";
import { homeSlug, pageMetadata } from "@/lib/seo";
import { Sections } from "@/sections/render";

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

/** /ar → "home", /ar/about → "about". */
async function resolve(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, slug: slug?.join("/") ?? homeSlug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await resolve(params);
  const [page, settings] = await Promise.all([
    getPage(slug, locale),
    getSettings(locale),
  ]);
  // Metadata is plain text: strip the invisible click-to-edit markers from the page title.
  return pageMetadata({ locale, slug, page: stegaClean(page), settings });
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await resolve(params);
  const [page, { isEnabled: isDraftMode }] = await Promise.all([getPage(slug, locale), draftMode()]);
  if (!page) notFound();
  return (
    <main>
      <Sections page={page} locale={locale} isDraftMode={isDraftMode} />
    </main>
  );
}
