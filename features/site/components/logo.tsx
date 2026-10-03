import Image from "next/image";
import Link from "next/link";

import type { SiteSettings } from "../types";
import { siteSettingsPath } from "@/lib/sanity/presentation";
import { siteAssets } from "@/lib/site-assets";
import type { Locale } from "@/lib/i18n";

export type LogoVariant = "light" | "color";
type LogoLayout = "horizontal" | "stacked";

type LogoProps = {
  variant: LogoVariant;
  layout: LogoLayout;
  locale?: Locale;
  settings?: SiteSettings | null;
  className?: string;
  linkClassName?: string;
  priority?: boolean;
  decorative?: boolean;
};

const fallbackSources = {
  light: {
    horizontal: siteAssets.logoHorizontalLight,
    stacked: siteAssets.logoStackedLight,
  },
  color: { horizontal: siteAssets.iconColor, stacked: siteAssets.iconColor },
} as const;

export function Logo({
  variant,
  layout,
  locale,
  settings,
  className,
  linkClassName,
  priority = false,
  decorative = false,
}: LogoProps) {
  const dynamicSources = {
    light: {
      horizontal: settings?.logo?.url,
      stacked: settings?.footerLogo?.url,
    },
    color: {
      horizontal: undefined,
      stacked: undefined,
    },
  } as const;
  const src =
    dynamicSources[variant][layout] || fallbackSources[variant][layout];
  const editableField = layout === "horizontal" ? "logo" : "footerLogo";
  const alt = decorative
    ? ""
    : settings?.companyName || "Next Generation Elevators";
  const image = (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={layout === "stacked" ? 180 : 480}
      height={layout === "stacked" ? 140 : 108}
      sizes={
        layout === "horizontal" ? "(max-width: 1023px) 42vw, 190px" : "180px"
      }
      data-sanity={settings ? siteSettingsPath(editableField) : undefined}
      priority={priority}
      unoptimized={src.startsWith("http")}
      aria-hidden={decorative}
    />
  );

  if (!locale) return image;

  return (
    <Link
      className={linkClassName}
      href={`/${locale}`}
      aria-label={`${settings?.companyName || "Next Generation Elevators"} home`}
    >
      {image}
    </Link>
  );
}
