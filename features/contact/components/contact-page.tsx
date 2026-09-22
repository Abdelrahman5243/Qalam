"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail, MessageCircle, Phone, UserRound } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { PageIntro } from "@/features/site/components/page-intro";
import type { SiteSettings } from "@/features/site/types";

export function ContactPage({ locale, settings }: { locale: Locale; settings: SiteSettings | null }) {
  const isArabic = locale === "ar";
  const [sent, setSent] = useState(false);

  const copy = isArabic
    ? {
        eyebrow: "تواصل معنا",
        title: "لديك مشروع مصاعد؟",
        intro: "تواصل مع فريقنا وسنساعدك في اختيار حل المصاعد المناسب لمساحتك.",
        getInTouch: "ابقَ على تواصل",
        manager: "المدير التنفيذي",
        phone: "الهاتف",
        whatsapp: "واتساب",
        email: "البريد الإلكتروني",
        quickTitle: "تواصل سريع",
        quickText: "تحدث معنا مباشرة عبر واتساب للاستفسارات ومناقشة تفاصيل مشروعك.",
        quickLink: "ابدأ محادثة على واتساب",
        formTitle: "أرسل لنا رسالة",
        fullName: "الاسم بالكامل",
        company: "الشركة",
        emailLabel: "البريد الإلكتروني",
        phoneLabel: "الهاتف",
        service: "نوع الخدمة",
        message: "رسالتك",
        namePlaceholder: "اكتب اسمك بالكامل",
        companyPlaceholder: "اسم الشركة (اختياري)",
        emailPlaceholder: "your@email.com",
        phonePlaceholder: "+966 5xx xxx xxxx",
        servicePlaceholder: "اختر نوع الخدمة",
        messagePlaceholder: "حدثنا عن مشروعك...",
        submit: "إرسال الرسالة",
        sent: "تم استلام رسالتك، وسنتواصل معك قريبًا.",
      }
    : {
        eyebrow: "Contact Us",
        title: "Have an Elevator Project in Mind?",
        intro: "Reach out to our team and we'll help you find the right elevator solution for your space.",
        getInTouch: "Get in touch",
        manager: "Executive Manager",
        phone: "Phone",
        whatsapp: "WhatsApp",
        email: "Email",
        quickTitle: "Quick Contact",
        quickText: "Chat with us directly via WhatsApp for quick inquiries and project discussions.",
        quickLink: "Start on WhatsApp",
        formTitle: "Send Us a Message",
        fullName: "Full Name",
        company: "Company",
        emailLabel: "Email",
        phoneLabel: "Phone",
        service: "Service",
        message: "Message",
        namePlaceholder: "Your full name",
        companyPlaceholder: "Company name (optional)",
        emailPlaceholder: "your@email.com",
        phonePlaceholder: "+966 5xx xxx xxxx",
        servicePlaceholder: "Select service type",
        messagePlaceholder: "Tell us about your project...",
        submit: "Send Message",
        sent: "Your message has been received. We'll be in touch soon.",
      };

  return (
    <main className="contact-page" dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro settings={settings} eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />

        <section className="contact-content" aria-labelledby="contact-form-title">
        <div className="contact-page-inner contact-content-inner">
          <aside className="contact-details">
            <p className="contact-eyebrow">{copy.getInTouch}</p>
            <div className="contact-detail-list">
              <div className="contact-detail"><span className="contact-detail-icon"><UserRound size={17} /></span><span><small>{copy.manager}</small><strong>{settings?.companyName || (isArabic ? "شركة المصاعد" : "Next Generation Elevators")}</strong></span></div>
              <a className="contact-detail" href={settings?.phone ? `tel:${settings.phone}` : "#contact-form"}><span className="contact-detail-icon"><Phone size={17} /></span><span><small>{copy.phone}</small><strong>{settings?.phone || (isArabic ? "سيتم الإضافة قريبًا" : "Coming soon")}</strong></span></a>
              <a className="contact-detail" href={settings?.whatsappUrl || "#contact-form"} target={settings?.whatsappUrl ? "_blank" : undefined} rel={settings?.whatsappUrl ? "noreferrer" : undefined}><span className="contact-detail-icon"><MessageCircle size={17} /></span><span><small>{copy.whatsapp}</small><strong>{settings?.phone || (isArabic ? "سيتم الإضافة قريبًا" : "Coming soon")}</strong></span></a>
              <a className="contact-detail" href={settings?.email ? `mailto:${settings.email}` : "#contact-form"} target={settings?.email ? "_blank" : undefined} rel={settings?.email ? "noreferrer" : undefined}><span className="contact-detail-icon"><Mail size={17} /></span><span><small>{copy.email}</small><strong>{settings?.email || (isArabic ? "سيتم الإضافة قريبًا" : "Coming soon")}</strong></span></a>
            </div>

            <div className="quick-contact">
              <div className="quick-contact-heading"><MessageCircle size={19} /><strong>{copy.quickTitle}</strong></div>
              <p>{copy.quickText}</p>
              <a href={settings?.whatsappUrl || "#contact-form"} target={settings?.whatsappUrl ? "_blank" : undefined} rel={settings?.whatsappUrl ? "noreferrer" : undefined}>{copy.quickLink}<ArrowRight size={17} /></a>
            </div>
          </aside>

          <form id="contact-form" className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <h2 id="contact-form-title">{copy.formTitle}</h2>
            {sent ? <p className="contact-success"><Check size={18} />{copy.sent}</p> : null}
            <div className="contact-form-grid">
              <label><span>{copy.fullName}</span><input name="name" required placeholder={copy.namePlaceholder} /></label>
              <label><span>{copy.company}</span><input name="company" placeholder={copy.companyPlaceholder} /></label>
              <label><span>{copy.emailLabel}</span><input name="email" type="email" required placeholder={copy.emailPlaceholder} /></label>
              <label><span>{copy.phoneLabel}</span><input name="phone" type="tel" placeholder={copy.phonePlaceholder} /></label>
              <label className="contact-form-full"><span>{copy.service}</span><select name="service" defaultValue=""><option value="" disabled>{copy.servicePlaceholder}</option><option>{isArabic ? "توريد وتركيب" : "Supply & Installation"}</option><option>{isArabic ? "الصيانة والإصلاح" : "Maintenance & Repair"}</option><option>{isArabic ? "خدمات ما بعد البيع" : "After-Sales Services"}</option></select></label>
              <label className="contact-form-full"><span>{copy.message}</span><textarea name="message" required placeholder={copy.messagePlaceholder} /></label>
            </div>
            <button type="submit">{copy.submit}<ArrowRight size={17} /></button>
          </form>
          </div>
        </section>

        <section className="contact-location" aria-labelledby="contact-location-title">
          <div className="contact-page-inner">
            <div className="contact-location-heading">
              <div>
                <p className="contact-eyebrow">{isArabic ? "موقعنا" : "Our location"}</p>
                <h2 id="contact-location-title">{isArabic ? "نحن هنا لمساعدتك" : "Find us where you need us"}</h2>
              </div>
              {settings?.address ? <p>{settings.address}</p> : null}
            </div>

            <div className="contact-map-frame">
              <iframe
                title={isArabic ? "موقع الشركة على الخريطة" : "Company location map"}
                src={settings?.mapUrl || "https://www.openstreetmap.org/export/embed.html?bbox=46.638%2C24.684%2C46.704%2C24.735&layer=mapnik&marker=24.7136%2C46.6753"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {settings?.mapUrl ? <a className="contact-map-link" href={settings.mapUrl} target="_blank" rel="noreferrer">{isArabic ? "فتح في الخرائط" : "Open in Maps"}</a> : null}
            </div>
          </div>
        </section>
      </main>
  );
}
