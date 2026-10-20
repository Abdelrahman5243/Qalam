import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";
import styles from "./status-page.module.css";

type Props = {
  label: string;
  title: string;
  message: string;
  onRetry?: () => void;
};

/** Full-screen message for 404 and error pages (Arabic, the default locale). */
export function StatusPage({ label, title, message, onRetry }: Props) {
  return (
    <main className={styles.page} lang="ar" dir="rtl">
      <section className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className={styles.actions}>
          {onRetry && (
            <button className={styles.button} onClick={onRetry}>
              إعادة المحاولة
            </button>
          )}
          <Link className={styles.button} href={`/${defaultLocale}`}>
            العودة للرئيسية
          </Link>
        </div>
      </section>
    </main>
  );
}
