export const locales = ["en", "zh-CN"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/** Parse locale prefix from an App Router pathname like `/en/models`. */
export function getLocaleFromPathname(pathname: string): Locale | null {
  for (const loc of locales) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      return loc;
    }
  }
  return null;
}

/** Build the same path under another locale, preserving the rest of the route. */
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;

  if (isValidLocale(segments[0])) {
    segments[0] = targetLocale;
    return `/${segments.join("/")}`;
  }

  return `/${targetLocale}/${segments.join("/")}`;
}

export function getLocalizedValue<T>(
  obj: { en: T; "zh-CN": T },
  locale: Locale
): T {
  return obj[locale] ?? obj.en;
}
