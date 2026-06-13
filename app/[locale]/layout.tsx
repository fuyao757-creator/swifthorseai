import { Suspense } from "react";
import { Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, type Locale, isValidLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DocumentLang } from "@/components/DocumentLang";

const notoSC = Noto_Sans_SC({
  weight: ["400", "700"],
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const isZh = locale === "zh-CN";

  return (
    <ThemeProvider>
      <DocumentLang locale={locale} />
      <div
        lang={isZh ? "zh-Hans" : locale}
        className={`page-bg${isZh ? ` ${notoSC.variable}` : ""}`}
      >
        <Suspense fallback={null}>
          <Navbar locale={locale} dict={dict} />
        </Suspense>
        <div className="page-shell mx-auto grid max-w-[92rem] grid-cols-1 items-start gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
          <Suspense fallback={null}>
            <Sidebar locale={locale} dict={dict} />
          </Suspense>
          <div className="page-main min-w-0">
            <main className="min-h-screen pb-12 pt-1 lg:pb-16 lg:pt-2">{children}</main>
            <Footer dict={dict} locale={locale} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
