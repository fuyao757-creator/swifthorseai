"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { getHtmlLang } from "@/lib/seo";

export function DocumentLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = getHtmlLang(locale);
  }, [locale]);

  return null;
}
