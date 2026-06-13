import type { Company, Model } from "./data";

import type { Locale } from "./i18n";

import { getLocalizedValue } from "./i18n";



export type SubgroupLabels = { en: string; "zh-CN": string };



type SubgroupRule = {

  id: string;

  labels: SubgroupLabels;

  match: (model: Model) => boolean;

};



const VENDOR_ORDER: Company[] = [

  "deepseek",

  "alibaba",

  "baidu",

  "baichuan",

  "lingyi",

  "bytedance",

  "zhipu",

  "moonshot",

  "tencent",

  "qihoo",

  "kunlun",

  "sensetime",

  "jd",

  "other",

];



const defaultRule = (en: string, zh: string): SubgroupRule[] => [

  { id: "main", labels: { en, "zh-CN": zh }, match: () => true },

];



/** 各厂商内的子模块规则（按顺序匹配，未命中归入 other） */

const SUBGROUP_RULES: Record<Company, SubgroupRule[]> = {

  deepseek: [

    {

      id: "v4",

      labels: { en: "V4 Series", "zh-CN": "V4 系列" },

      match: (m) => m.id.includes("v4"),

    },

    {

      id: "reasoning",

      labels: { en: "Reasoning", "zh-CN": "推理增强" },

      match: (m) => m.id === "deepseek-r1",

    },

    {

      id: "moe",

      labels: { en: "MoE Flagship", "zh-CN": "MoE 旗舰" },

      match: (m) => m.id === "deepseek-v3",

    },

  ],

  alibaba: [

    {

      id: "qwen3-7",

      labels: { en: "Qwen3.7", "zh-CN": "Qwen3.7" },

      match: (m) => m.id === "qwen3-7-max",

    },

    {

      id: "qwen3-max",

      labels: { en: "Qwen3-Max", "zh-CN": "Qwen3-Max" },

      match: (m) => m.id === "qwen3-max",

    },

    {

      id: "qwen-plus-flash",

      labels: { en: "Qwen-Plus / Flash", "zh-CN": "Qwen-Plus / Flash" },

      match: (m) => m.id === "qwen-plus-flash",

    },

    {

      id: "qwen-long",

      labels: { en: "Qwen-Long", "zh-CN": "Qwen-Long" },

      match: (m) => m.id === "qwen-long",

    },

    {

      id: "quark-app",

      labels: { en: "Quark", "zh-CN": "夸克" },

      match: (m) => m.id === "quark-ai",

    },

  ],

  baidu: [

    {

      id: "ernie-5",

      labels: { en: "ERNIE 5.x", "zh-CN": "ERNIE 5.x" },

      match: (m) => m.id === "ernie-5-1",

    },

    {

      id: "ernie-4",

      labels: { en: "ERNIE 4.x", "zh-CN": "ERNIE 4.x" },

      match: (m) => m.id === "ernie-4-5-turbo",

    },

    {

      id: "ernie-x1",

      labels: { en: "ERNIE-X1", "zh-CN": "ERNIE-X1" },

      match: (m) => m.id === "ernie-x1",

    },

  ],

  baichuan: defaultRule("Medical", "医疗垂类"),

  lingyi: defaultRule("Yi Series", "Yi 系列"),

  bytedance: [

    {

      id: "seed-media",

      labels: { en: "Seed · Image", "zh-CN": "Seed · 图像" },

      match: (m) => m.id === "seedream",

    },

    {

      id: "seed-1",

      labels: { en: "Seed 1.x", "zh-CN": "Seed 1.x 系列" },

      match: (m) => m.id.startsWith("doubao-seed-1-"),

    },

    {

      id: "jimeng-app",

      labels: { en: "Jimeng AI", "zh-CN": "即梦 AI" },

      match: (m) => m.id === "jimeng-ai",

    },

  ],

  zhipu: [

    {

      id: "glm-5",

      labels: { en: "GLM-5", "zh-CN": "GLM-5" },

      match: (m) => m.id === "glm-5",

    },

    {

      id: "glm-4.7",

      labels: { en: "GLM-4.7", "zh-CN": "GLM-4.7" },

      match: (m) => m.id === "glm-4-7",

    },

    {

      id: "glm-4v",

      labels: { en: "GLM-4V", "zh-CN": "GLM-4V 多模态" },

      match: (m) => m.id === "glm-4v",

    },

    {

      id: "chatglm-app",

      labels: { en: "ChatGLM", "zh-CN": "智谱清言" },

      match: (m) => m.id === "chatglm-app",

    },

  ],

  moonshot: [

    {

      id: "kimi-k2",

      labels: { en: "Kimi K2", "zh-CN": "Kimi K2 系列" },

      match: (m) => m.id.startsWith("kimi-k2"),

    },

  ],

  tencent: [

    {

      id: "hy3",

      labels: { en: "Hunyuan 3", "zh-CN": "混元 3 系列" },

      match: (m) => m.id.includes("hy3"),

    },

    {

      id: "hy2",

      labels: { en: "Hunyuan 2", "zh-CN": "混元 2 系列" },

      match: (m) => m.id.includes("hy2"),

    },

  ],

  qihoo: [

    {

      id: "zhinao-api",

      labels: { en: "360 AI Brain API", "zh-CN": "360 智脑 API" },

      match: (m) => m.id === "360-zhinao-turbo-seed-1-8",

    },

    {

      id: "nano-app",

      labels: { en: "Nomi AI", "zh-CN": "纳米 AI" },

      match: (m) => m.id === "nano-ai",

    },

  ],

  kunlun: [

    {

      id: "skyclaw-flagship",

      labels: { en: "SkyClaw Flagship", "zh-CN": "SkyClaw 旗舰" },

      match: (m) => m.id === "skyclaw-v1",

    },

    {

      id: "skyclaw-lite",

      labels: { en: "SkyClaw Lite", "zh-CN": "SkyClaw 轻量" },

      match: (m) => m.id === "skyclaw-v1-lite",

    },

    {

      id: "tiangong-app",

      labels: { en: "Tiangong AI", "zh-CN": "天工 AI" },

      match: (m) => m.id === "tiangong-ai",

    },

  ],

  sensetime: defaultRule("SenseNova", "SenseNova"),

  jd: [

    {

      id: "open",

      labels: { en: "Open Source", "zh-CN": "开源" },

      match: (m) => m.id === "jd-480b-open",

    },

    {

      id: "enterprise",

      labels: { en: "Enterprise", "zh-CN": "企业版" },

      match: (m) => m.id === "jd-jingyan-enterprise",

    },

  ],

  other: [

    {

      id: "general",

      labels: { en: "General", "zh-CN": "通用" },

      match: () => true,

    },

  ],

};



function assignSubgroup(company: Company, model: Model): string {

  const rules = SUBGROUP_RULES[company] ?? SUBGROUP_RULES.other;

  for (const rule of rules) {

    if (rule.match(model)) return rule.id;

  }

  return rules[rules.length - 1]?.id ?? "general";

}



export interface ModelSubgroup {

  id: string;

  labels: SubgroupLabels;

  models: Model[];

}



export interface VendorModuleGroup {

  company: Company;

  subgroups: ModelSubgroup[];

}



export function groupModelsByVendor(models: Model[]): VendorModuleGroup[] {

  const byCompany = new Map<Company, Model[]>();

  for (const m of models) {

    const list = byCompany.get(m.company) ?? [];

    list.push(m);

    byCompany.set(m.company, list);

  }



  return VENDOR_ORDER.filter((c) => byCompany.has(c)).map((company) => {

    const companyModels = byCompany.get(company)!;

    const rules = SUBGROUP_RULES[company] ?? SUBGROUP_RULES.other;

    const subgroupMap = new Map<string, Model[]>();



    for (const m of companyModels) {

      const sgId = assignSubgroup(company, m);

      const list = subgroupMap.get(sgId) ?? [];

      list.push(m);

      subgroupMap.set(sgId, list);

    }



    const subgroups: ModelSubgroup[] = rules

      .filter((r) => subgroupMap.has(r.id))

      .map((r) => ({

        id: r.id,

        labels: r.labels,

        models: subgroupMap.get(r.id)!,

      }));



    return { company, subgroups };

  });

}



export function getSubgroupLabel(

  labels: SubgroupLabels,

  locale: Locale

): string {

  return getLocalizedValue(labels, locale);

}


