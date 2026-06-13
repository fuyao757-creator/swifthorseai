import modelsData from "@/data/models.json";
import type { Locale } from "./i18n";
import { getLocalizedValue } from "./i18n";

export type Company =
  | "deepseek"
  | "alibaba"
  | "baidu"
  | "baichuan"
  | "lingyi"
  | "bytedance"
  | "zhipu"
  | "moonshot"
  | "tencent"
  | "qihoo"
  | "kunlun"
  | "sensetime"
  | "jd"
  | "other";

export interface LocalizedString {
  en: string;
  "zh-CN": string;
}

export interface Model {
  id: string;
  company: Company;
  companyName: LocalizedString;
  name: LocalizedString;
  tagline: LocalizedString;
  logo: string;
  parameters: LocalizedString;
  contextWindow: LocalizedString;
  knowledgeCutoff: LocalizedString;
  description: LocalizedString[];
  useCases: {
    id: string;
    label: LocalizedString;
    category: "text" | "image" | "video";
  }[];
  pricing: {
    tier: LocalizedString;
    inputPrice: LocalizedString;
    outputPrice: LocalizedString;
  }[];
  updates: {
    date: string;
    title: LocalizedString;
    summary: LocalizedString;
  }[];
}

export function getModels(): Model[] {
  return modelsData.models as Model[];
}

export function getModelById(id: string): Model | undefined {
  return getModels().find((m) => m.id === id);
}

export function localizeModel(model: Model, locale: Locale) {
  return {
    id: model.id,
    company: model.company,
    companyName: getLocalizedValue(model.companyName, locale),
    name: getLocalizedValue(model.name, locale),
    tagline: getLocalizedValue(model.tagline, locale),
    logo: model.logo,
    parameters: getLocalizedValue(model.parameters, locale),
    contextWindow: getLocalizedValue(model.contextWindow, locale),
    knowledgeCutoff: getLocalizedValue(model.knowledgeCutoff, locale),
    description: model.description.map((d) => getLocalizedValue(d, locale)),
    useCases: model.useCases.map((uc) => ({
      id: uc.id,
      label: getLocalizedValue(uc.label, locale),
      category: uc.category,
    })),
    pricing: model.pricing.map((p) => ({
      tier: getLocalizedValue(p.tier, locale),
      inputPrice: getLocalizedValue(p.inputPrice, locale),
      outputPrice: getLocalizedValue(p.outputPrice, locale),
    })),
    updates: model.updates.map((u) => ({
      date: u.date,
      title: getLocalizedValue(u.title, locale),
      summary: getLocalizedValue(u.summary, locale),
    })),
  };
}
