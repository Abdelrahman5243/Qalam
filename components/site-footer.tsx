import Image from "next/image";
import Link from "next/link";
import type { Edit } from "@/cms/edit";
import type { Settings } from "@/cms/sanity";
import type { Locale } from "@/lib/i18n";
import styles from "./site-footer.module.css";

type Props = {
  locale: Locale;
  settings: Settings | null;
  edit: Edit;
};

function profileLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SiteFooter({ locale, settings, edit }: Props) {
  const menu = settings?.menu ?? [];
  const profiles = settings?.seo?.profiles ?? [];
  const companyName = settings?.companyName ?? "";
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {settings?.logo ? (
            <Link href={`/${locale}`} aria-label={companyName}>
              <Image
                className={styles.logo}
                src={settings.logo.url}
                alt={settings.logo.alt}
                width={150}
                height={48}
                data-sanity={edit("logo")}
              />
            </Link>
          ) : (
            companyName && (
              <Link className={styles.name} href={`/${locale}`}>
                <span data-sanity={edit("companyName")}>{companyName}</span>
              </Link>
            )
          )}
          {settings?.email && (
            <a className={styles.email} href={`mailto:${settings.email}`}>
              <span data-sanity={edit("email")}>{settings.email}</span>
            </a>
          )}
        </div>

        {menu.length > 0 && (
          <nav className={styles.links} aria-label={locale === "ar" ? "روابط الموقع" : "Site links"}>
            {menu.map(
              ({ _key, label, href }) =>
                href && (
                  <Link key={_key} href={href}>
                    <span data-sanity={edit("menu", { _key })}>{label}</span>
                  </Link>
                ),
            )}
          </nav>
        )}

        {profiles.length > 0 && (
          <nav className={styles.profiles} aria-label={locale === "ar" ? "روابط التواصل" : "Social links"}>
            {profiles.map(
              ({ _key, url }) =>
                url && (
                  <a key={_key} href={url} target="_blank" rel="noreferrer">
                    <span data-sanity={edit("seo", "profiles", { _key })}>
                      {profileLabel(url)}
                    </span>
                  </a>
                ),
            )}
          </nav>
        )}
      </div>

      <div className={styles.bottom}>
        {companyName && (
          <span data-sanity={edit("companyName")}>© {year} {companyName}</span>
        )}
      </div>
    </footer>
  );
}
