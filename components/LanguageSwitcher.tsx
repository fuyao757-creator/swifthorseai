"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";

import { locales, switchLocalePath } from "@/lib/i18n";



const LOCALE_COOKIE = "NEXT_LOCALE";



const labels: Record<Locale, string> = {

  en: "EN",

  "zh-CN": "中文",

};



function persistLocaleChoice(targetLocale: Locale) {

  document.cookie = `${LOCALE_COOKIE}=${targetLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

}



export function LanguageSwitcher({ locale }: { locale: Locale }) {

  const pathname = usePathname() ?? "";



  return (

    <div className="relative z-20 flex rounded-lg border border-stone-200/90 bg-white/80 p-0.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">

      {locales.map((loc) => {

        const href = switchLocalePath(pathname, loc);

        const active = locale === loc;



        return (

          <Link

            key={loc}

            href={href}

            prefetch

            scroll={false}

            aria-current={active ? "page" : undefined}

            onClick={() => {

              if (!active) persistLocaleChoice(loc);

            }}

            className={`lang-switch-link relative z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all ${

              active

                ? "bg-ink text-white dark:bg-tech-cyan dark:text-[#06080f]"

                : "text-ink-muted hover:text-ink dark:text-stone-400"

            }`}

          >

            {labels[loc]}

          </Link>

        );

      })}

    </div>

  );

}


