import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "../types";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SitePageProps = {
  locale: Locale;
  settings: SiteSettings | null;
  active?: "home" | "about" | "services" | "projects" | "contact";
  children: ReactNode;
};

/** Shared chrome for routes outside the homepage hero composition. */
export function SitePage({
  locale,
  settings,
  active,
  children,
}: SitePageProps) {
  return (
    <>
      <SiteHeader locale={locale} settings={settings} active={active} />
      {children}
      <SiteFooter locale={locale} settings={settings} />
    </>
  );
}
