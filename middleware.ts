import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, getLocaleFromPathname, locales } from "./lib/i18n";

const LOCALE_COOKIE = "NEXT_LOCALE";

function getPreferredLocale(request: NextRequest): string {
  const cookieLocale = request.cookies?.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.includes("zh")) {
    return "zh-CN";
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  const activeLocale = getLocaleFromPathname(pathname);

  if (activeLocale) {
    const response = NextResponse.next();
    response.headers.set("x-locale", activeLocale);
    response.cookies.set(LOCALE_COOKIE, activeLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = getPreferredLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|locales|logos|videos|swift-horse-logo).*)",
  ],
};
