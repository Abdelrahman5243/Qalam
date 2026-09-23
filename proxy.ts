import { NextResponse, type NextRequest } from "next/server";

const locales = new Set(["ar", "en"]);
const publicRoutes = new Set(["about", "services", "projects", "contact"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (
    segments.length > 0 &&
    !locales.has(firstSegment) &&
    segments.length === 1 &&
    publicRoutes.has(firstSegment)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/ar" + pathname;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|studio|.*\..*).*)"],
};
