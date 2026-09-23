"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";

type StatusPageProps = {
  kind: "not-found" | "error";
  onRetry?: () => void;
};

export function StatusPage({ kind, onRetry }: StatusPageProps) {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en") ?? false;
  const locale = isEnglish ? "en" : "ar";
  const isNotFound = kind === "not-found";
  const copy = isEnglish
    ? {
        eyebrow: isNotFound ? "Page not found" : "System interruption",
        title: isNotFound ? "This lift doesn’t stop here." : "The lift needs a moment.",
        description: isNotFound
          ? "The page may have moved, or the address may be incorrect. Let’s get you back to a working floor."
          : "An unexpected error interrupted this page. You can try again or return to the home floor.",
        home: "Back to home",
        retry: "Try again",
        mark: isNotFound ? "Route 404" : "Route 500",
      }
    : {
        eyebrow: isNotFound ? "الصفحة غير موجودة" : "توقف مؤقت في النظام",
        title: isNotFound ? "هذا المصعد لا يتوقف هنا." : "المصعد يحتاج لحظة.",
        description: isNotFound
          ? "ربما انتقلت الصفحة أو أن العنوان غير صحيح. دعنا نعيدك إلى صفحة متاحة."
          : "حدث خطأ غير متوقع أثناء تحميل الصفحة. يمكنك المحاولة مرة أخرى أو العودة إلى الرئيسية.",
        home: "العودة إلى الرئيسية",
        retry: "المحاولة مرة أخرى",
        mark: isNotFound ? "المسار 404" : "المسار 500",
      };

  return (
    <main className={"status-page " + (isEnglish ? "locale-en" : "locale-ar")} dir={isEnglish ? "ltr" : "rtl"} lang={locale}>
      <div className="status-page-grid" aria-hidden="true" />
        <SiteHeader locale={locale} settings={null} />

      <div className="status-page-content">
        <section className="status-page-copy" aria-labelledby="status-title">
          <p className="status-page-kicker">{copy.eyebrow}</p>
          <h1 id="status-title">{copy.title}</h1>
          <p className="status-page-description">{copy.description}</p>
          <div className="status-page-actions">
            <Link className="status-page-primary" href={`/${locale}`}>
              {copy.home}
            </Link>
            {onRetry ? (
              <button className="status-page-secondary" type="button" onClick={onRetry}>
                {copy.retry}
              </button>
            ) : null}
          </div>
        </section>

        <div className="status-page-visual" aria-hidden="true">
          <div className="status-page-code">{isNotFound ? "404" : "500"}</div>
          <div className="status-page-shaft">
            <div className="status-page-cabin">
              <span />
              <span />
            </div>
            <div className="status-page-floor status-page-floor-top" />
            <div className="status-page-floor status-page-floor-bottom" />
          </div>
        </div>
      </div>

      <SiteFooter locale={locale} settings={null} />
    </main>
  );
}
