import Link from "next/link";

import type { Dictionary } from "@/lib/dictionary";

import { SiteLogoBadge } from "./SiteLogo";



export function Footer({

  dict,

  locale,

}: {

  dict: Dictionary;

  locale: string;

}) {

  return (

    <footer className="mt-12 border-t border-slate-200/50 pt-10 dark:border-white/[0.05] lg:mt-14 lg:pt-12">

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-16">

        <div className="flex items-start gap-4">

          <SiteLogoBadge size="md" />

          <div>

            <p className="font-display text-lg font-semibold tracking-[-0.02em] text-ink dark:text-white">

              {dict.siteName}

            </p>

            <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-ink-faint">

              {dict.footer.indexLabel}

            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted dark:text-slate-400">

              {dict.footer.indexTagline}

            </p>

          </div>

        </div>



        <div className="flex flex-col gap-4 sm:items-end">

          <p className="mono-label">{dict.footer.siteNavLabel}</p>

          <div className="flex flex-wrap gap-3 sm:justify-end">

            <Link href={`/${locale}/about`} prefetch className="btn-ghost text-sm">

              {dict.nav.about}

            </Link>

            <Link href={`/${locale}/articles`} prefetch className="btn-ghost text-sm">

              {dict.nav.articles}

            </Link>

            <Link href={`/${locale}/disclaimer`} prefetch className="btn-ghost text-sm">

              {dict.nav.disclaimer}

            </Link>

          </div>

        </div>

      </div>



      <div className="tech-divider !my-8" />



      <div className="flex flex-col gap-3 text-xs leading-relaxed text-ink-faint sm:flex-row sm:items-center sm:justify-between">

        <div className="space-y-1.5">

          <p>{dict.footer.trademark}</p>

          <p>{dict.footer.dataDisclaimer}</p>

        </div>

        <p className="shrink-0 font-mono text-[10px] tracking-wide text-ink-faint/80">

          {dict.footer.copyright}

        </p>

      </div>

    </footer>

  );

}


