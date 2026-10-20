"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { otherLocale, type Locale } from "@/lib/i18n";

const languageNames = { ar: "العربية", en: "English" } satisfies Record<
  Locale,
  string
>;

/** Links to the current page in the other language: /ar/about ↔ /en/about. */
export function LanguageSwitch({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const target = otherLocale(locale);
  const path = usePathname().replace(`/${locale}`, `/${target}`);
  return (
    <Link className={className} href={path} hrefLang={target}>
      <Languages aria-hidden size={16} />
      {languageNames[target]}
    </Link>
  );
}
