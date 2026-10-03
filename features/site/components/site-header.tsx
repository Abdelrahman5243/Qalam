"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  Home,
  ImageIcon,
  Mail,
  PanelsTopLeft,
  Settings2,
  UsersRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";

import { getOtherLocale, switchLocalePath, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "../types";
import { Logo } from "./logo";
import styles from "./site-header.module.css";
import "./site.module.css";

type HeaderProps = {
  locale: Locale;
  settings: SiteSettings | null;
  /** Kept temporarily so existing pages can migrate without a breaking prop change. */
  active?: "home" | "about" | "services" | "projects" | "contact";
};

const navigation = {
  en: [
    { label: "Home", href: "/en", icon: Home },
    { label: "About Us", href: "/en/about", icon: UsersRound },
    { label: "Services", href: "/en/services", icon: Settings2 },
    { label: "Projects", href: "/en/projects", icon: PanelsTopLeft },
    {
      label: "Cabin Designs 2026",
      href: "/en/cabin-designs-2026",
      icon: ImageIcon,
    },
  ],
  ar: [
    { label: "الرئيسية", href: "/ar", icon: Home },
    { label: "من نحن", href: "/ar/about", icon: UsersRound },
    { label: "الخدمات", href: "/ar/services", icon: Settings2 },
    { label: "المشاريع", href: "/ar/projects", icon: PanelsTopLeft },
    {
      label: "ديكورات كبائن 2026",
      href: "/ar/cabin-designs-2026",
      icon: ImageIcon,
    },
  ],
} as const;

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function BrandMark({
  locale,
  settings,
}: Pick<HeaderProps, "locale" | "settings">) {
  return (
    <>
      <Logo
        variant="light"
        layout="horizontal"
        locale={locale}
        settings={settings}
        className={`${styles.brandImage} ${styles.desktopBrandImage}`}
        linkClassName={`${styles.brand} ${styles.desktopBrand}`}
        priority
      />
      <Logo
        variant="light"
        layout="horizontal"
        locale={locale}
        settings={settings}
        className={`${styles.brandImage} ${styles.mobileBrandImage}`}
        linkClassName={`${styles.brand} ${styles.mobileBrand}`}
      />
    </>
  );
}

function LanguageSwitch({
  locale,
  pathname,
}: Pick<HeaderProps, "locale"> & { pathname?: string }) {
  const otherLocale = getOtherLocale(locale);
  const targetPath = switchLocalePath(pathname, otherLocale);

  return (
    <Link
      className={styles.language}
      href={targetPath}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <Globe2 aria-hidden="true" size={18} strokeWidth={1.8} />
      <span>{otherLocale.toUpperCase()}</span>
    </Link>
  );
}

type MobileMenuProps = HeaderProps & {
  menuId: string;
  open: boolean;
  pathname: string;
  panelRef: RefObject<HTMLElement | null>;
  onClose: () => void;
};

function MobileMenu({
  locale,
  settings,
  menuId,
  open,
  pathname,
  panelRef,
  onClose,
}: MobileMenuProps) {
  const items = navigation[locale];
  const contactLabel = locale === "ar" ? "تواصل معنا" : "Contact Us";
  const DirectionChevron = locale === "ar" ? ChevronLeft : ChevronRight;

  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  if (!mounted) return null;

  return createPortal(
    <div className={styles.menuLayer} data-open={open} aria-hidden={!open}>
      <button
        className={styles.backdrop}
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        id={menuId}
        className={styles.mobilePanel}
        dir={locale === "ar" ? "rtl" : "ltr"}
        aria-label={locale === "ar" ? "القائمة الرئيسية" : "Main menu"}
        aria-modal="true"
        role="dialog"
        inert={!open}
      >
        <div className={styles.mobileTopbar}>
          <BrandMark locale={locale} settings={settings} />
          <div className={styles.mobileTools}>
            <LanguageSwitch locale={locale} pathname={pathname} />
            <button
              className={styles.closeButton}
              type="button"
              onClick={onClose}
              aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          className={styles.mobileNav}
          aria-label={locale === "ar" ? "روابط الموقع" : "Site links"}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isCurrent = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={styles.mobileLink}
                data-current={isCurrent ? "true" : undefined}
                href={item.href}
                onClick={onClose}
              >
                <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                <span>{item.label}</span>
                <DirectionChevron
                  aria-hidden="true"
                  size={19}
                  strokeWidth={1.8}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          className={styles.mobileContact}
          data-current={pathname === `/${locale}/contact` ? "true" : undefined}
          href={`/${locale}/contact`}
          onClick={onClose}
        >
          <Mail aria-hidden="true" size={19} strokeWidth={1.8} />
          {contactLabel}
        </Link>
      </aside>
    </div>,
    document.body,
  );
}

export function SiteHeader({ locale, settings }: HeaderProps) {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const items = navigation[locale];
  const contactLabel = locale === "ar" ? "تواصل معنا" : "Contact Us";

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const animationFrame = requestAnimationFrame(() =>
      menuRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus(),
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const controls = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (!controls.length) return;

      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <header className={styles.header} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.inner}>
        <BrandMark locale={locale} settings={settings} />

        <nav
          className={styles.desktopNav}
          aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              className={styles.desktopLink}
              data-current={pathname === item.href ? "true" : undefined}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.desktopActions}>
          <LanguageSwitch locale={locale} pathname={pathname} />
          <span className={styles.divider} aria-hidden="true" />
          <Link
            className={styles.desktopContact}
            href={`/${locale}/contact`}
            data-current={
              pathname === `/${locale}/contact` ? "true" : undefined
            }
          >
            {contactLabel}
          </Link>
        </div>

        <div className={styles.mobileActions}>
          <LanguageSwitch locale={locale} pathname={pathname} />
          <button
            ref={toggleRef}
            className={styles.menuButton}
            type="button"
            data-open={menuOpen}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={
              menuOpen
                ? locale === "ar"
                  ? "إغلاق القائمة"
                  : "Close menu"
                : locale === "ar"
                  ? "فتح القائمة"
                  : "Open menu"
            }
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu
        locale={locale}
        settings={settings}
        menuId={menuId}
        open={menuOpen}
        pathname={pathname}
        panelRef={menuRef}
        onClose={closeMenu}
      />
    </header>
  );
}
