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

/** Redirect common locale typos (e.g. /zh-cn/...) before prefix injection causes 404. */
function normalizeLocalePathname(pathname: string): string | null {
  // Already canonical — do not redirect (case-insensitive regex would loop on /zh-CN).
  if (pathname === "/zh-CN" || pathname.startsWith("/zh-CN/")) {
    return null;
  }

  const match = pathname.match(/^\/(zh-cn|zh_cn|zh-hans|zh-hant)(\/|$)/i);
  if (!match) return null;

  const rest = pathname.slice(match[0].length);
  const normalized = `/zh-CN${rest ? (rest.startsWith("/") ? rest : `/${rest}`) : ""}`;
  return normalized === pathname ? null : normalized;
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

  const normalizedPath = normalizeLocalePathname(pathname);
  if (normalizedPath) {
    const url = request.nextUrl.clone();
    url.pathname = normalizedPath;
    return NextResponse.redirect(url, 308);
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
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|llms.txt|locales|logos|videos|swift-horse-logo|6f8e4a2b9c1d3e5f7a8b9c0d1e2f3a4).*)",
  ],
};
