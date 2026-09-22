import Image from "next/image";
import Link from "next/link";

import type { SiteSettings } from "../types";
import { siteAssets } from "@/lib/site-assets";
import type { Locale } from "@/lib/i18n";

export type LogoVariant = "light" | "color";
type LogoLayout = "horizontal" | "stacked" | "mark";

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
      mark: settings?.mobileLogo?.url,
    },
    color: {
      horizontal: undefined,
      stacked: undefined,
      mark: undefined,
    },
  } as const;
  const fallbackMark =
    variant === "light" ? siteAssets.iconLight : siteAssets.iconColor;
  const src =
    dynamicSources[variant][layout] ||
    (layout === "mark" ? fallbackMark : fallbackSources[variant][layout]);
  const alt = decorative
    ? ""
    : settings?.companyName || "Next Generation Elevators";
  const image = (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={layout === "stacked" ? 180 : layout === "mark" ? 48 : 240}
      height={layout === "stacked" ? 140 : layout === "mark" ? 48 : 90}
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
