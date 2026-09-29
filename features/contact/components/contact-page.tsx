"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail, MessageCircle, Phone, UserRound } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { PageIntro } from "@/features/site/components/page-intro";
import type { SiteSettings } from "@/features/site/types";

type SubmitStatus = "idle" | "success" | "error";
type FieldName = "name" | "company" | "email" | "phone" | "service" | "otherService" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;


type ContactPrefill = { type?: "service" | "project"; title?: string };

export function ContactPage({ locale, settings, prefill }: { locale: Locale; settings: SiteSettings | null; prefill?: ContactPrefill }) {
  const isArabic = locale === "ar";
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const fieldErrors: FieldErrors = {};
  const serviceFromSlug = prefill?.type === "service" && prefill.title
    ? prefill.title.toLowerCase().includes("maintenance") || prefill.title.includes("الصيانة")
      ? "maintenance"
      : prefill.title.toLowerCase().includes("after") || prefill.title.includes("ما بعد")
        ? "after_sales"
        : prefill.title.toLowerCase().includes("supply") || prefill.title.includes("توريد")
          ? "supply_installation"
          : "other"
    : "";
  const [selectedService, setSelectedService] = useState(serviceFromSlug || (prefill?.title ? "other" : ""));
  const prefilledMessage = prefill?.title
    ? isArabic
      ? `أرغب في الاستفسار عن ${prefill.type === "project" ? "المشروع" : "الخدمة"}: ${prefill.title}`
      : `I would like to inquire about this ${prefill.type === "project" ? "project" : "service"}: ${prefill.title}`
    : "";

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
        sent: "سيتم فتح واتساب برسالتك الجاهزة.",
        error: "حدث خطأ أثناء الإرسال، حاول مرة أخرى.",
        unavailable: "رقم واتساب غير مضاف حاليًا. حاول التواصل معنا هاتفيًا.",
        validation: "راجع البيانات المحددة وحاول مرة أخرى.",
        other: "أخرى",
        otherPlaceholder: "اكتب نوع الخدمة التي تحتاجها",
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
        sent: "WhatsApp will open with your message ready to send.",
        error: "Something went wrong. Please try again.",
        unavailable: "A WhatsApp number is not configured yet. Please call us instead.",
        validation: "Please review the highlighted fields and try again.",
        other: "Other",
        otherPlaceholder: "Tell us what service you need",
      };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fields = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      otherService: String(formData.get("otherService") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!settings?.whatsappUrl) {
      setNotice(copy.unavailable);
      setStatus("error");
      return;
    }

    const serviceLabels = {
      supply_installation: isArabic ? "توريد وتركيب" : "Supply & Installation",
      maintenance: isArabic ? "الصيانة والإصلاح" : "Maintenance & Repair",
      after_sales: isArabic ? "خدمات ما بعد البيع" : "After-Sales Services",
      other: fields.otherService || copy.other,
    };
    const serviceLabel = serviceLabels[fields.service as keyof typeof serviceLabels] || fields.service || copy.other;
    const whatsappMessage = isArabic
      ? [
          "مرحبًا، أرغب في التواصل معكم.",
          "",
          `الاسم: ${fields.name}`,
          `الشركة: ${fields.company || "غير مذكورة"}`,
          `البريد الإلكتروني: ${fields.email}`,
          `الهاتف: ${fields.phone || "غير مذكور"}`,
          `نوع الخدمة: ${serviceLabel}`,
          `الرسالة: ${fields.message}`,
        ].join("\n")
      : [
          "Hello, I would like to get in touch.",
          "",
          `Name: ${fields.name}`,
          `Company: ${fields.company || "Not provided"}`,
          `Email: ${fields.email}`,
          `Phone: ${fields.phone || "Not provided"}`,
          `Service: ${serviceLabel}`,
          `Message: ${fields.message}`,
        ].join("\n");

    const whatsappUrl = new URL(settings.whatsappUrl);
    whatsappUrl.searchParams.set("text", whatsappMessage);
    window.open(whatsappUrl.toString(), "_blank", "noopener,noreferrer");
    setNotice(copy.sent);
    setStatus("success");
  }

  return (
    <main className="contact-page" dir={isArabic ? "rtl" : "ltr"}>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} description={copy.intro} />

        <section className="contact-content" aria-labelledby="contact-form-title">
        <div className="contact-page-inner contact-content-inner">
          <aside className="contact-details">
            <p className="contact-eyebrow">{copy.getInTouch}</p>
            <div className="contact-detail-list">
              <div className="contact-detail"><span className="contact-detail-icon"><UserRound size={17} /></span><span><small>{copy.manager}</small><strong>{settings?.companyName || (isArabic ? "شركة المصاعد" : "Next Generation Elevators")}</strong></span></div>
              <a className="contact-detail" href={settings?.phone ? `tel:${settings.phone}` : "#contact-form"}><span className="contact-detail-icon"><Phone size={17} /></span><span><small>{copy.phone}</small><strong>{settings?.phone || (isArabic ? "سيتم الإضافة قريبًا" : "Coming soon")}</strong></span></a>
              <a className="contact-detail" href={settings?.whatsappUrl || "#contact-form"} target={settings?.whatsappUrl ? "_blank" : undefined} rel={settings?.whatsappUrl ? "noreferrer" : undefined}><span className="contact-detail-icon"><MessageCircle size={17} /></span><span><small>{copy.whatsapp}</small><strong>{settings?.whatsappUrl ? (isArabic ? "ابدأ محادثة" : "Start a chat") : (isArabic ? "سيتم الإضافة قريبًا" : "Coming soon")}</strong></span></a>
              <a className="contact-detail" href={settings?.email ? `mailto:${settings.email}` : "#contact-form"}><span className="contact-detail-icon"><Mail size={17} /></span><span><small>{copy.email}</small><strong>{settings?.email || (isArabic ? "سيتم الإضافة قريبًا" : "Coming soon")}</strong></span></a>
            </div>

            <div className="quick-contact">
              <div className="quick-contact-heading"><MessageCircle size={19} /><strong>{copy.quickTitle}</strong></div>
              <p>{copy.quickText}</p>
              <a href={settings?.whatsappUrl || "#contact-form"} target={settings?.whatsappUrl ? "_blank" : undefined} rel={settings?.whatsappUrl ? "noreferrer" : undefined}>{copy.quickLink}<ArrowRight size={17} /></a>
            </div>
          </aside>

          <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
            <h2 id="contact-form-title">{copy.formTitle}</h2>
            {status === "success" ? <p className="contact-success" role="status"><Check size={18} />{copy.sent}</p> : null}
            {status === "error" && notice ? <p className="contact-error" role="alert">{notice}</p> : null}
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, width: 0, opacity: 0 }}
            />
            <div className="contact-form-grid">
              <label htmlFor="contact-name"><span>{copy.fullName}</span><input id="contact-name" name="name" required maxLength={100} autoComplete="name" placeholder={copy.namePlaceholder} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "contact-name-error" : undefined} />{fieldErrors.name ? <span id="contact-name-error" className="contact-field-error" role="alert">{fieldErrors.name}</span> : null}</label>
              <label htmlFor="contact-company"><span>{copy.company}</span><input id="contact-company" name="company" maxLength={100} autoComplete="organization" placeholder={copy.companyPlaceholder} aria-invalid={Boolean(fieldErrors.company)} aria-describedby={fieldErrors.company ? "contact-company-error" : undefined} />{fieldErrors.company ? <span id="contact-company-error" className="contact-field-error" role="alert">{fieldErrors.company}</span> : null}</label>
              <label htmlFor="contact-email"><span>{copy.emailLabel}</span><input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder={copy.emailPlaceholder} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "contact-email-error" : undefined} />{fieldErrors.email ? <span id="contact-email-error" className="contact-field-error" role="alert">{fieldErrors.email}</span> : null}</label>
              <label htmlFor="contact-phone"><span>{copy.phoneLabel}</span><input id="contact-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder={copy.phonePlaceholder} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined} />{fieldErrors.phone ? <span id="contact-phone-error" className="contact-field-error" role="alert">{fieldErrors.phone}</span> : null}</label>
              <label className="contact-form-full" htmlFor="contact-service"><span>{copy.service}</span><select id="contact-service" name="service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} aria-invalid={Boolean(fieldErrors.service)} aria-describedby={fieldErrors.service ? "contact-service-error" : undefined}><option value="">{copy.servicePlaceholder}</option><option value="supply_installation">{isArabic ? "توريد وتركيب" : "Supply & Installation"}</option><option value="maintenance">{isArabic ? "الصيانة والإصلاح" : "Maintenance & Repair"}</option><option value="after_sales">{isArabic ? "خدمات ما بعد البيع" : "After-Sales Services"}</option><option value="other">{copy.other}</option></select>{fieldErrors.service ? <span id="contact-service-error" className="contact-field-error" role="alert">{fieldErrors.service}</span> : null}</label>
              {selectedService === "other" ? <label className="contact-form-full" htmlFor="contact-other-service"><span>{copy.other}</span><input id="contact-other-service" name="otherService" required maxLength={150} defaultValue={prefill?.title || ""} placeholder={copy.otherPlaceholder} aria-invalid={Boolean(fieldErrors.otherService)} aria-describedby={fieldErrors.otherService ? "contact-other-service-error" : undefined} />{fieldErrors.otherService ? <span id="contact-other-service-error" className="contact-field-error" role="alert">{fieldErrors.otherService}</span> : null}</label> : null}
              <label className="contact-form-full" htmlFor="contact-message"><span>{copy.message}</span><textarea id="contact-message" name="message" required minLength={10} maxLength={5000} defaultValue={prefilledMessage} placeholder={copy.messagePlaceholder} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "contact-message-error" : undefined} />{fieldErrors.message ? <span id="contact-message-error" className="contact-field-error" role="alert">{fieldErrors.message}</span> : null}</label>
            </div>
            <button type="submit">
              {copy.submit}
              <ArrowRight size={17} />
            </button>
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
