"use client";

import Link from "next/link";
import styles from "./placeholder-page.module.css";

export function StatusPage({ kind, onRetry }: { kind: "error" | "not-found"; onRetry?: () => void }) {
  const notFound = kind === "not-found";
  return <main className={styles.page} dir="rtl"><section className={styles.content}><p className={styles.kicker}>{notFound ? "404" : "خطأ"}</p><h1>{notFound ? "الصفحة غير موجودة" : "حدث خطأ غير متوقع"}</h1><p>{notFound ? "تحقق من الرابط وحاول مرة أخرى." : "حاول تحديث الصفحة."}</p><div className={styles.actions}>{onRetry ? <button className={styles.button} onClick={onRetry}>إعادة المحاولة</button> : null}<Link className={styles.button} href="/ar">العودة للرئيسية</Link></div></section></main>;
}
