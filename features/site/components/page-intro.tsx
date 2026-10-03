import siteStyles from "./site.module.css";
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
  const resolvedBreadcrumbs =
    breadcrumbs ||
    (locale && typeof title === "string"
      ? [
          { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: title },
        ]
      : undefined);

  return (
    <section className={siteStyles["inner-page-intro"]}>
      <div className={siteStyles["inner-page-pattern"]} aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <Logo
        variant="color"
        layout="horizontal"
        settings={settings}
        className={siteStyles["inner-page-mark"]}
        decorative
      />
      <div className={siteStyles["inner-page-container"]}>
        {resolvedBreadcrumbs?.length && locale ? (
          <Breadcrumbs items={resolvedBreadcrumbs} locale={locale} />
        ) : null}
        <p className={siteStyles["inner-page-eyebrow"]}>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
