"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, direction, isLocale, type Locale } from "@/lib/i18n";
import styles from "./status-page.module.css";

const messages = {
  ar: {
    "not-found": {
      label: "404",
      title: "الصفحة غير موجودة",
      message: "تحقق من الرابط وحاول مرة أخرى.",
    },
    error: {
      label: "خطأ",
      title: "حدث خطأ غير متوقع",
      message: "حاول تحديث الصفحة.",
    },
    retry: "إعادة المحاولة",
    home: "العودة للرئيسية",
  },
  en: {
    "not-found": {
      label: "404",
      title: "Page not found",
      message: "Check the address and try again.",
    },
    error: {
      label: "Error",
      title: "Something went wrong",
      message: "Try reloading the page.",
    },
    retry: "Try again",
    home: "Back to home",
  },
} satisfies Record<Locale, unknown>;

/** Full-screen 404 / error message, in the language of the current URL (/en/… → English). */
export function StatusPage({
  kind,
  onRetry,
}: {
  kind: "not-found" | "error";
  onRetry?: () => void;
}) {
  const segment = usePathname()?.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const text = messages[locale];
  return (
    <main className={styles.page} lang={locale} dir={direction(locale)}>
      <section className={styles.content}>
        <p className={styles.label}>{text[kind].label}</p>
        <h1>{text[kind].title}</h1>
        <p>{text[kind].message}</p>
        <div className={styles.actions}>
          {onRetry && (
            <button className={styles.button} onClick={onRetry}>
              {text.retry}
            </button>
          )}
          <Link className={styles.button} href={`/${locale}`}>
            {text.home}
          </Link>
        </div>
      </section>
    </main>
  );
}
