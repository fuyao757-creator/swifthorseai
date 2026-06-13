"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { isValidLocale } from "@/lib/i18n";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const localeParam = params?.locale;
  const locale: Locale =
    typeof localeParam === "string" && isValidLocale(localeParam)
      ? localeParam
      : "zh-CN";
  const isZh = locale === "zh-CN";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16">
      <div className="glass max-w-md px-8 py-10 text-center">
        <p className="mono-label">{isZh ? "错误" : "ERROR"}</p>
        <h1 className="display-title mt-4 text-xl text-blue-900 dark:text-white">
          {isZh ? "页面加载出错" : "Page failed to load"}
        </h1>
        <p className="mt-3 text-sm text-blue-600 dark:text-stone-400">
          {isZh ? "请重试或返回首页。" : "Please try again or return home."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="btn-primary">
            {isZh ? "重试" : "Retry"}
          </button>
          <Link href={`/${locale}`} className="btn-ghost">
            {isZh ? "返回首页" : "Back to home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
