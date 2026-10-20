import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { Locale } from "@/lib/i18n";
import { getOtherLocale } from "@/lib/i18n";
import { homeSectionPath, siteSettingsPath } from "@/lib/sanity/presentation";
import type { HomeHero, SiteImage } from "../types";
import styles from "./landing-page.module.css";
import { ArrowDown, AtSign, BriefcaseBusiness, Code2, ExternalLink, Globe2, Languages, Mail, MapPin, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const fallbackSocials = [
  { platform: "email", label: "Email", url: "#" },
  { platform: "linkedin", label: "LinkedIn", url: "#" },
  { platform: "message", label: "Message", url: "#" },
  { platform: "github", label: "GitHub", url: "#" },
  { platform: "code", label: "Code", url: "#" },
];

function socialIcon(platform: string | null, index: number): LucideIcon {
  if (platform === "email") return Mail;
  if (platform === "linkedin") return BriefcaseBusiness;
  if (platform === "message") return MessageCircle;
  if (platform === "github") return AtSign;
  if (platform === "code") return Code2;
  if (platform === "globe") return Globe2;
  return [Mail, BriefcaseBusiness, MessageCircle, AtSign, Code2][index % 5];
}

export function LandingPage({ locale, hero, logo }: { locale: Locale; hero: HomeHero; logo: SiteImage | null }) {
  const arabic = locale === "ar";
  const content = {
    status: hero.status || (arabic ? "متاح للعمل" : "Open to Work"),
    headline: hero.headline || (arabic ? "عبدالرحمن رجب عبدالباقي" : "Abdelrahman Ragab Abdelbaky"),
    role: hero.role || (arabic ? "مطوّر واجهات أمامية" : "Front-End Developer"),
    location: hero.location || (arabic ? "القاهرة، مصر" : "Cairo, Egypt"),
    primaryLabel: hero.primaryButtonLabel || (arabic ? "شاهد المشاريع" : "View Projects"),
    primaryHref: hero.primaryButtonHref || "#projects",
    secondaryLabel: hero.secondaryButtonLabel || (arabic ? "معاينة السيرة الذاتية" : "Preview CV"),
    secondaryHref: hero.secondaryButtonHref || "#cv",
  };
  const nextLocale = getOtherLocale(locale);
  const languageLabel = arabic ? "English" : "العربية";
  return (
    <main className={styles.page} dir={arabic ? "rtl" : "ltr"}>
      <section className={styles.hero}>
        {logo ? (
          <Image className={styles.logo} src={logo.url} alt={logo.alt} width={180} height={56} priority data-sanity={siteSettingsPath(["logo"])} />
        ) : null}
        <Link className={styles.languageSwitch} href={`/${nextLocale}`} aria-label={languageLabel}>
          <Languages aria-hidden="true" size={16} />
          <span>{languageLabel}</span>
        </Link>
        <div className={styles.status} data-sanity={homeSectionPath("homeHero", ["status", locale])}><span />{content.status}</div>
        <h1 data-sanity={homeSectionPath("homeHero", ["headline", locale])}>{content.headline}</h1>
        <h2 data-sanity={homeSectionPath("homeHero", ["role", locale])}>{content.role}</h2>
        <p className={styles.location} data-sanity={homeSectionPath("homeHero", ["location", locale])}><MapPin aria-hidden="true" size={15} strokeWidth={2} /> {content.location}</p>
        {hero.richDescription ? (
          <div className={styles.description} data-sanity={homeSectionPath("homeHero", ["richDescription", locale])}>
            <PortableText value={hero.richDescription} />
          </div>
        ) : null}
        <div className={styles.actions}>
          <a className={styles.primaryButton} href={content.primaryHref} data-sanity={homeSectionPath("homeHero", ["primaryButtonLabel", locale])}>{content.primaryLabel}<ArrowDown aria-hidden="true" size={16} /></a>
          <a className={styles.secondaryButton} href={content.secondaryHref} data-sanity={homeSectionPath("homeHero", ["secondaryButtonLabel", locale])}>{content.secondaryLabel}<ExternalLink aria-hidden="true" size={15} /></a>
        </div>
        <div className={styles.socials} aria-label={arabic ? "روابط التواصل" : "Social links"}>
          {(hero.socialLinks.length ? hero.socialLinks : fallbackSocials).map((social, index) => { const Icon = socialIcon(social.platform, index); return <a key={`${social.label}-${index}`} href={social.url} aria-label={social.label} data-sanity={hero.socialLinks.length ? homeSectionPath("homeHero", ["socialLinks", index, "label", locale]) : undefined}><Icon aria-hidden="true" size={22} strokeWidth={1.8} /></a>; })}
        </div>
      </section>
    </main>
  );
}
