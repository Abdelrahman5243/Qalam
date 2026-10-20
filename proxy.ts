import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

/** Paths without a language go to the default one: "/" → "/ar", "/about" → "/ar/about". */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    locales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    )
  )
    return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Skip the dashboard, API routes, Next internals and files (favicon.svg, sitemap.xml...).
export const config = { matcher: ["/((?!admin|api|_next|.*\\..*).*)"] };
