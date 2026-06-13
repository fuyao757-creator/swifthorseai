"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";

const navIndex = ["01", "02", "03", "04", "05", "06", "07", "08"];

export function Sidebar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname() ?? "";

  const links = [
    { href: `/${locale}`, label: dict.nav.home, key: "home", exact: true },
    { href: `/${locale}/models`, label: dict.nav.models, key: "models" },
    { href: `/${locale}/services`, label: dict.nav.services, key: "services" },
    { href: `/${locale}/match`, label: dict.nav.match, key: "match" },
    { href: `/${locale}/prompts`, label: dict.nav.prompts, key: "prompts" },
    { href: `/${locale}/articles`, label: dict.nav.articles, key: "articles" },
    { href: `/${locale}/disclaimer`, label: dict.nav.disclaimer, key: "disclaimer" },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) {
      return pathname === href || pathname === `${href}/`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="sidebar-nav sticky top-28 hidden w-full shrink-0 lg:block">
      <div className="glass p-3">
        <p className="section-eyebrow mb-4 px-3 pt-1">
          {locale === "zh-CN" ? "导航" : "Navigate"}
        </p>
        <nav className="flex flex-col gap-0.5" aria-label={locale === "zh-CN" ? "系统导航" : "Site navigation"}>
          {links.map((link, i) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.key}
                href={link.href}
                prefetch
                className={`relative z-10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  active
                    ? "nav-side-active pl-[10px]"
                    : "text-ink-muted hover:bg-slate-100/70 hover:text-ink dark:hover:bg-white/[0.04] dark:hover:text-slate-200"
                }`}
              >
                <span className="pointer-events-none font-mono text-[10px] tabular-nums text-ink-faint/80">
                  {navIndex[i]}
                </span>
                <span className="pointer-events-none text-[14px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-5 border-t border-slate-200/60 px-3 pt-4 dark:border-white/[0.06]">
          <p className="mono-label">
            {locale === "zh-CN" ? "开放索引" : "Open Index"}
          </p>
          <p className="sidebar-tagline mt-2.5 text-xs leading-[1.6] text-ink-faint">
            {locale === "zh-CN" ? (
              <>
                <span className="sidebar-tagline-line">面向全球</span>
                <span className="sidebar-tagline-line text-[11px] tracking-[0.02em]">
                  中国大模型公开索引
                </span>
              </>
            ) : (
              <>
                <span className="sidebar-tagline-line">China AI model open index</span>
                <span className="sidebar-tagline-line text-[11px] tracking-[0.02em]">
                  For a global audience
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </aside>
  );
}
