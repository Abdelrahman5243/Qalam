"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/features/site/types";

export function FloatingContactActions({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";
  const whatsappUrl = settings?.whatsappUrl || process.env.NEXT_PUBLIC_WHATSAPP_URL;
  const phone = settings?.phone;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnPointerDown);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnPointerDown);
    };
  }, [isOpen]);

  if (!whatsappUrl && !phone) return null;

  return (
    <div
      ref={containerRef}
      className="floating-contact"
      data-open={String(isOpen)}
      dir={isArabic ? "rtl" : "ltr"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <div
        className="floating-contact-menu"
        id="floating-contact-menu"
        aria-hidden={!isOpen}
      >
        {whatsappUrl && (
          <a
            className="floating-contact-action floating-contact-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={isArabic ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            title={isArabic ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            tabIndex={isOpen ? 0 : -1}
          >
            <span className="floating-contact-icon" aria-hidden="true">
              <MessageCircle size={20} strokeWidth={1.8} />
            </span>
            <span>{isArabic ? "تواصل عبر واتساب" : "Chat on WhatsApp"}</span>
          </a>
        )}

        {phone && (
          <a
            className="floating-contact-action floating-contact-call"
            href={`tel:${phone}`}
            aria-label={isArabic ? "اتصل بنا" : "Call us"}
            title={isArabic ? "اتصل بنا" : "Call us"}
            tabIndex={isOpen ? 0 : -1}
          >
            <span className="floating-contact-icon" aria-hidden="true">
              <Phone size={19} strokeWidth={1.8} />
            </span>
            <span>{isArabic ? "اتصل بنا" : "Call us"}</span>
          </a>
        )}
      </div>

      <button
        className="floating-contact-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="floating-contact-menu"
        aria-label={
          isOpen
            ? isArabic
              ? "إغلاق خيارات التواصل"
              : "Close contact options"
            : isArabic
              ? "فتح خيارات التواصل"
              : "Open contact options"
        }
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? (
          <X size={21} strokeWidth={1.8} />
        ) : (
          <MessageCircle size={22} strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
