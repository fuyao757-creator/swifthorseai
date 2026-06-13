"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteLogoBadge } from "./SiteLogo";
import { useTheme } from "./ThemeProvider";

export function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname() ?? "";
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: `/${locale}`, label: dict.nav.home, exact: true },
    { href: `/${locale}/models`, label: dict.nav.models },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/match`, label: dict.nav.match },
    { href: `/${locale}/prompts`, label: dict.nav.prompts },
    { href: `/${locale}/articles`, label: dict.nav.articles },
    { href: `/${locale}/disclaimer`, label: dict.nav.disclaimer },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) {
      return pathname === href || pathname === `${href}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const tagline =
    locale === "zh-CN" ? "中国 AI 模型索引" : "China AI Model Index";

  return (
    <header className="sticky top-0 z-50 px-4 pt-2 sm:px-6 lg:px-8">
      <div className="nav-float flex items-center justify-between gap-4 sm:gap-6">
        <Link
          href={`/${locale}`}
          className="group relative z-10 flex shrink-0 items-center gap-3.5 sm:gap-4"
        >
          <SiteLogoBadge size="sm" className="group-hover:scale-[1.02]" />
          <div className="hidden sm:block">
            <span className="block font-display text-[17px] font-semibold leading-tight tracking-[-0.02em] text-ink dark:text-white">
              {dict.siteName}
            </span>
            <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-ink-faint">
              {tagline}
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label={locale === "zh-CN" ? "主导航" : "Main navigation"}
        >
          {links.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={`nav-link ${active ? "nav-link-active" : "nav-link-idle"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span
            className="mono-label hidden rounded-md border border-slate-200/60 bg-slate-50/80 px-2 py-1 dark:border-white/[0.06] dark:bg-white/[0.03] sm:inline-block"
            aria-hidden
          >
            {locale === "zh-CN" ? "ZH" : "EN"}
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dict.theme.toggleLabel}
            className="relative z-20 flex h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg border border-slate-200/60 bg-white/80 text-sm text-ink-muted transition-all hover:border-slate-300/80 hover:text-ink dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:text-white"
          >
            {theme === "light" ? "◐" : "◑"}
          </button>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>

      <nav
        className="nav-float nav-mobile-scroll relative z-50 mx-auto mt-2 overflow-x-auto px-2 py-1.5 lg:hidden"
        aria-label={locale === "zh-CN" ? "主导航" : "Main navigation"}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex min-w-max justify-start gap-1 sm:justify-center sm:gap-0.5">
          {links.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={`nav-link nav-link-mobile ${active ? "nav-link-active" : "nav-link-idle"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
