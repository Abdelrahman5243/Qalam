import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/cms/sanity";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import styles from "./site-header.module.css";

type Props = { locale: Locale; logo: Settings["logo"]; menu: NonNullable<Settings["menu"]> };

export function SiteHeader({ locale, logo, menu }: Props) {
  return (
    <header className={styles.header}>
      {logo && (
        <Link href={`/${locale}`}>
          <Image className={styles.logo} src={logo.url} alt={logo.alt} width={180} height={56} priority />
        </Link>
      )}
      {menu.length > 0 && (
        <nav className={styles.menu}>
          {menu.map(({ _key, label, href }) => href && (
            <Link key={_key} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      )}
      <LanguageSwitch className={styles.languageSwitch} locale={locale} />
    </header>
  );
}
