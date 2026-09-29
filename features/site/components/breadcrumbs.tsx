import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, locale }: { items: BreadcrumbItem[]; locale: "ar" | "en" }) {
  const structuredData = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: item.href ? absoluteUrl(item.href) : undefined })) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav className="breadcrumbs" aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumbs"}>
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href && index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
      </nav>
    </>
  );
}
