import type { ReactNode } from "react";
import type { SiteSettings } from "../types";
import { Logo } from "./logo";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

export function PageIntro({
  eyebrow,
  title,
  description,
  settings,
  breadcrumbs,
  locale,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  settings?: SiteSettings | null;
  breadcrumbs?: BreadcrumbItem[];
  locale?: "ar" | "en";
}) {
  const resolvedBreadcrumbs = breadcrumbs || (locale && typeof title === "string" ? [{ label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` }, { label: title }] : undefined);

  return (
    <section className="inner-page-intro">
      <div className="inner-page-pattern" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <Logo
        variant="color"
        layout="horizontal"
        settings={settings}
        className="inner-page-mark"
        decorative
      />
      <div className="inner-page-container">
        {resolvedBreadcrumbs?.length && locale ? <Breadcrumbs items={resolvedBreadcrumbs} locale={locale} /> : null}
        <p className="inner-page-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
