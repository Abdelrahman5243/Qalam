import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = { title: "الصفحة غير موجودة" };

/** A missing page inside /ar or /en: keeps the site layout, so Presentation stays connected. */
export default function NotFoundPage() {
  return (
    <StatusPage
      label="404"
      title="الصفحة غير موجودة"
      message="تحقق من الرابط وحاول مرة أخرى."
    />
  );
}
