"use client";

import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { SVGProps } from "react";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "../types";
import { Logo } from "./logo";

const navigation = {
  en: ["Home", "About Us", "Services", "Projects", "Contact Us"],
  ar: ["الرئيسية", "من نحن", "الخدمات", "المشاريع", "تواصل معنا"],
} as const;

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.32-.04-1.42-.14-2.7-.14-2.67 0-4.5 1.63-4.5 4.63V10H6.6v3h3v8h3.9Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.7" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.6" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.1 3h3.1c.2 1.3.9 2.4 2 3.1.6.4 1.2.6 1.8.7v3.2a8.1 8.1 0 0 1-3.8-1.1v6.3c0 3.8-2.6 5.8-5.5 5.8a5.7 5.7 0 0 1-5.8-5.7c0-3.2 2.4-5.7 5.8-5.7.3 0 .6 0 .9.1V13a2.8 2.8 0 0 0-.9-.2c-1.2 0-2.3.9-2.3 2.4s1.1 2.4 2.3 2.4c1.2 0 2.4-.7 2.4-2.6V3Z" />
    </svg>
  );
}

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

export function SiteFooter({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const isArabic = locale === "ar";
  const labels = navigation[locale];
  const navigationLinks = [
    `/${locale}`,
    `/${locale}/about`,
    `/${locale}/services`,
    `/${locale}/projects`,
    `/${locale}/contact`,
  ];
  const fallbackSocials = [
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "tiktok", url: "#" },
  ];
  const socials = settings?.socialLinks.length
    ? settings.socialLinks
    : fallbackSocials;
  const whatsappUrl =
    settings?.whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL || null;
  const contactLabel = isArabic ? "تواصل معنا" : "Contact";

  return (
    <footer className="site-footer" dir={isArabic ? "rtl" : "ltr"}>
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Logo
              variant="light"
              layout="stacked"
              locale={locale}
              settings={settings}
              className="site-footer-logo"
            />
            <p>
              {settings?.footerDescription ||
                (isArabic
                  ? "حلول متكاملة للمصاعد والسلالم المتحركة تجمع بين الجودة والأمان والكفاءة والتكنولوجيا الحديثة."
                  : "Integrated elevator and escalator solutions combining quality, safety, efficiency, and modern technology.")}
            </p>
          </div>

          <div className="site-footer-column">
            <p className="site-footer-label">
              {isArabic ? "التنقل" : "Navigation"}
            </p>
            <nav aria-label={isArabic ? "روابط التذييل" : "Footer navigation"}>
              {labels.map((label, index) => (
                <Link key={label} href={navigationLinks[index]}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer-column">
            <p className="site-footer-label">{contactLabel}</p>
            <a
              className={!settings?.phone ? "is-placeholder" : undefined}
              href={settings?.phone ? `tel:${settings.phone}` : "#contact"}
            >
              <Phone aria-hidden="true" size={15} />
              {settings?.phone ||
                (isArabic
                  ? "رقم الهاتف يضاف قريبًا"
                  : "Phone number coming soon")}
            </a>
            <a
              className={!settings?.email ? "is-placeholder" : undefined}
              href={settings?.email ? `mailto:${settings.email}` : "#contact"}
              target={settings?.email ? "_blank" : undefined}
              rel={settings?.email ? "noreferrer" : undefined}
            >
              <Mail aria-hidden="true" size={15} />
              {settings?.email ||
                (isArabic
                  ? "البريد الإلكتروني يضاف قريبًا"
                  : "Email coming soon")}
            </a>
            <a
              className={!whatsappUrl ? "is-placeholder" : undefined}
              href={whatsappUrl || "#contact"}
              target={whatsappUrl ? "_blank" : undefined}
              rel={whatsappUrl ? "noreferrer" : undefined}
            >
              <MessageCircle aria-hidden="true" size={15} />
              {whatsappUrl
                ? isArabic
                  ? "واتساب"
                  : "WhatsApp"
                : isArabic
                  ? "واتساب يضاف قريبًا"
                  : "WhatsApp coming soon"}
            </a>
          </div>

          <div className="site-footer-column">
            <p className="site-footer-label">
              {isArabic ? "تابعنا" : "Connect"}
            </p>
            {socials.map((social) => {
              const Icon =
                socialIcons[
                  social.platform.toLowerCase() as keyof typeof socialIcons
                ] || MessageCircle;
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target={social.url.startsWith("http") ? "_blank" : undefined}
                  rel={social.url.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon aria-hidden="true" width={15} height={15} />
                  {social.platform}
                </a>
              );
            })}
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.companyName || "Next Generation Elevators"}.{" "}
            {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <p>{isArabic ? "تأسست عام 2010" : "Established 2010"}</p>
        </div>
      </div>
    </footer>
  );
}
