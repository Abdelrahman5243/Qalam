import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "../types";
import { siteSettingsPath } from "@/lib/sanity/presentation";
import styles from "./placeholder-page.module.css";

export function PlaceholderPage({ locale, settings }: { locale: Locale; settings: SiteSettings | null }) {
  const arabic = locale === "ar";
  const company = settings?.companyName || (arabic ? "موقع جديد" : "New website");
  const otherLocale = arabic ? "en" : "ar";
  const headline = settings?.headline || (arabic ? "نجهّز شيئًا بسيطًا وجميلًا." : "Something simple is on the way.");
  const description = settings?.description || (arabic ? "هذه الصفحة قابلة للتعديل من Sanity ويمكن تخصيصها لكل عميل." : "This page is powered by Sanity and ready to customize for each client.");
  return <main className={styles.page} dir={arabic ? "rtl" : "ltr"}>
    <header className={styles.header}><Link href={`/${locale}`} className={styles.brand} data-sanity={siteSettingsPath(["companyName", locale])}>{company}</Link><Link href={`/${otherLocale}`} className={styles.language}>{arabic ? "English" : "العربية"}</Link></header>
    <section className={styles.content}><p className={styles.kicker}>{arabic ? "قريبًا" : "Coming soon"}</p><h1 data-sanity={siteSettingsPath(["headline", locale])}>{headline}</h1><p data-sanity={siteSettingsPath(["description", locale])}>{description}</p></section>
    <footer className={styles.footer}>{settings?.email ? <a href={`mailto:${settings.email}`} data-sanity={siteSettingsPath("email")}>{settings.email}</a> : <span>{company}</span>}</footer>
  </main>;
}
