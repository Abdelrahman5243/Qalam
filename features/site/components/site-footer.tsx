"use client";

import Image from "next/image";
import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import { MessageCircle, Phone } from "lucide-react";
import type { SVGProps } from "react";

import type { Locale } from "@/lib/i18n";
import { sanityConfig } from "@/lib/sanity/config";
import type { SiteSettings } from "../types";
import { Logo } from "./logo";

const navigation = {
  en: ["Home", "About Us", "Services", "Projects", "Cabin Designs 2026", "Contact Us"],
  ar: ["الرئيسية", "من نحن", "الخدمات", "المشاريع", "ديكورات كبائن 2026", "تواصل معنا"],
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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.4L2.8 2h6.5l4.4 5.8L18.9 2Zm-1.1 17.3h1.7L8.2 4.6H6.4l11.4 14.7Z" /></svg>;
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...props}>
      <path d="M5.1 18.9 4 21l2.3-1.1A8.3 8.3 0 1 0 5.1 18.9Z" />
      <path d="M8.5 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.6.7c.7 1.2 1.6 2.1 2.8 2.8l.7-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1 .3-1.6.1-2.8-.8-5-3-5.8-5.8-.2-.6-.1-1.2.1-1.7Z" />
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
  whatsapp: WhatsAppIcon,
  call: Phone,
  x: XIcon,
};

const siteSettingsData = createDataAttribute({
  id: "siteSettings",
  type: "siteSettings",
  baseUrl: sanityConfig.studioUrl,
  dataset: sanityConfig.dataset,
  projectId: sanityConfig.projectId,
});

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
    `/${locale}/cabin-designs-2026`,
    `/${locale}/contact`,
  ];
  const fallbackSocials = [
    { platform: "facebook", url: "#", icon: null },
    { platform: "instagram", url: "#", icon: null },
    { platform: "tiktok", url: "#", icon: null },
  ];
  const socials = settings?.socialLinks.length
    ? settings.socialLinks
    : fallbackSocials;
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
            <div className="site-footer-brand-social" aria-label={isArabic ? "تابعنا" : "Connect"}>
              <p className="site-footer-label">{isArabic ? "تابعنا" : "Connect"}</p>
              <div className="site-footer-social-list">
                {socials.map((social, socialIndex) => {
                  const platform = social.platform.toLowerCase();
                  const Icon = socialIcons[platform as keyof typeof socialIcons] || MessageCircle;
                  return (
                    <a
                      key={social.platform}
                      className={`site-footer-social-link social-${platform}`}
                      href={social.url}
                      aria-label={social.platform}
                      title={social.platform}
                      data-sanity={siteSettingsData(`socialLinks[${socialIndex}].url`)}
                      target={social.url.startsWith("http") ? "_blank" : undefined}
                      rel={social.url.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {social.icon ? (
                    <Image
                      src={social.icon.url}
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                      className="site-footer-social-icon"
                      data-sanity={siteSettingsData(`socialLinks[${socialIndex}].icon`)}
                    />
                  ) : (
                    <Icon aria-hidden="true" width={24} height={24} />
                  )}
                    </a>
                  );
                })}
              </div>
            </div>
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

          {(settings?.nationalNumber || settings?.taxNumber || settings?.commercialRegistration || settings?.emergencyPhone || settings?.maintenancePhone) && (
            <div className="site-footer-column">
              <p className="site-footer-label">{isArabic ? "بيانات المنشأة" : "Company details"}</p>
              <div className="site-footer-legal" aria-label={isArabic ? "بيانات المنشأة" : "Company details"}>
                {settings.nationalNumber && (
                  <span data-sanity={siteSettingsData("nationalNumber")}>
                    {isArabic ? "الرقم الوطني" : "National number"}: {settings.nationalNumber}
                  </span>
                )}
                {settings.taxNumber && (
                  <span data-sanity={siteSettingsData("taxNumber")}>
                    {isArabic ? "الرقم الضريبي" : "Tax number"}: {settings.taxNumber}
                  </span>
                )}
                {settings.commercialRegistration && (
                  <span data-sanity={siteSettingsData("commercialRegistration")}>
                    {isArabic ? "السجل التجاري" : "Commercial registration"}: {settings.commercialRegistration}
                  </span>
                )}
                {settings.emergencyPhone && (
                  <span data-sanity={siteSettingsData("emergencyPhone")}>
                    {isArabic ? "خط الطوارئ" : "Emergency line"}: {settings.emergencyPhone}
                  </span>
                )}
                {settings.maintenancePhone && (
                  <span data-sanity={siteSettingsData("maintenancePhone")}>
                    {isArabic ? "خط الصيانة" : "Maintenance line"}: {settings.maintenancePhone}
                  </span>
                )}
              </div>
            </div>
          )}

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
