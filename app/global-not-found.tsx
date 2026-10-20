import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";
import { defaultLocale, direction } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = { title: "الصفحة غير موجودة" };

/** URLs that match no route at all (e.g. /xx). The site has several root layouts, so this page brings its own <html>. */
export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} dir={direction(defaultLocale)}>
      <body>
        <StatusPage label="404" title="الصفحة غير موجودة" message="تحقق من الرابط وحاول مرة أخرى." />
      </body>
    </html>
  );
}
