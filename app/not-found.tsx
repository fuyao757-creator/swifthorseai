import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: true },
};

const copy = {
  en: {
    code: "ERROR · 404",
    title: "Page not found",
    subtitle: "The page you requested does not exist or has moved.",
    cta: "Back to home",
    home: "/en",
  },
  "zh-CN": {
    code: "错误 · 404",
    title: "页面未找到",
    subtitle: "您访问的页面不存在或已迁移。",
    cta: "返回首页",
    home: "/zh-CN",
  },
} as const;

export default function NotFound() {
  const t = copy[defaultLocale];

  return (
    <div className="not-found-page page-bg flex min-h-screen flex-col items-center justify-center px-6">
      <div className="not-found-shell text-center">
        <p className="mono-label">{t.code}</p>
        <p className="not-found-code gradient-text">404</p>
        <h1 className="not-found-title">{t.title}</h1>
        <p className="not-found-subtitle">{t.subtitle}</p>
        <Link href={t.home} className="btn-primary not-found-cta">
          {t.cta} →
        </Link>
        <p className="mt-6 text-sm text-ink-muted">
          <Link href={copy["zh-CN"].home} className="hover:underline">
            中文
          </Link>
          {" · "}
          <Link href={copy.en.home} className="hover:underline">
            English
          </Link>
        </p>
      </div>
    </div>
  );
}
