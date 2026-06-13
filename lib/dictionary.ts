import type { Locale } from "./i18n";
import en from "@/messages/en.json";
import zhCN from "@/messages/zh-CN.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "zh-CN": zhCN,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
