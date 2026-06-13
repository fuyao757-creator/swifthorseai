import type { LocalizedString, Model } from "./data";
import { getLocalizedValue } from "./i18n";

export type ScenarioCategoryId =
  | "coding"
  | "reasoning"
  | "writing"
  | "analysis"
  | "translation"
  | "image-gen"
  | "video-gen"
  | "search";

export type ScenarioFilter = ScenarioCategoryId | "all";

export interface ScenarioCategory {
  id: ScenarioCategoryId;
  labels: LocalizedString;
  accent: string;
}

export const SCENARIO_CATEGORIES: ScenarioCategory[] = [
  {
    id: "coding",
    labels: { "zh-CN": "代码开发", en: "Code Development" },
    accent: "#2563eb",
  },
  {
    id: "reasoning",
    labels: { "zh-CN": "逻辑推理", en: "Logical Reasoning" },
    accent: "#7c3aed",
  },
  {
    id: "writing",
    labels: { "zh-CN": "内容写作", en: "Content Writing" },
    accent: "#e11d48",
  },
  {
    id: "analysis",
    labels: { "zh-CN": "数据分析", en: "Data Analysis" },
    accent: "#0d9488",
  },
  {
    id: "search",
    labels: { "zh-CN": "智能搜索", en: "AI Search" },
    accent: "#0284c7",
  },
  {
    id: "translation",
    labels: { "zh-CN": "翻译处理", en: "Translation" },
    accent: "#d97706",
  },
  {
    id: "image-gen",
    labels: { "zh-CN": "图像生成", en: "Image Generation" },
    accent: "#db2777",
  },
  {
    id: "video-gen",
    labels: { "zh-CN": "视频生成", en: "Video Generation" },
    accent: "#4f46e5",
  },
];

/** 场景关键词：useCase 标签或模型文案需命中其一才归入该场景 */
const SCENARIO_SIGNALS: Record<ScenarioCategoryId, string[]> = {
  coding: [
    "代码",
    "编程",
    "程序",
    "开发",
    "code",
    "coding",
    "program",
    "agentic coding",
    "software",
  ],
  reasoning: [
    "推理",
    "逻辑",
    "reasoning",
    "思维",
    "对话",
    "dialogue",
    "问答",
    "q&a",
    "agent",
    "智能体",
    "assistant",
    "助手",
  ],
  writing: [
    "写作",
    "文案",
    "内容创作",
    "内容生成",
    "内容写作",
    "writing",
    "copy",
    "文档",
    "ppt",
    "presentation",
  ],
  analysis: [
    "数据分析",
    "data analysis",
    "analytics",
    "报表",
    "统计",
    "表格处理",
    "spreadsheet",
  ],
  search: [
    "搜索",
    "search",
    "检索",
    "信息精炼",
    "来源标注",
    "智能扫描",
  ],
  translation: [
    "翻译",
    "translation",
    "多语言",
    "multilingual",
    "本地化",
    "localization",
    "语音交互",
    "voice",
  ],
  "image-gen": [
    "图像生成",
    "image gen",
    "文生图",
    "视觉设计",
    "visual design",
    "多模态理解",
    "multimodal",
    "图像",
    "image",
  ],
  "video-gen": [
    "视频生成",
    "video gen",
    "文生视频",
    "video production",
    "视频",
    "video",
  ],
};

const GENERIC_USE_CASE_LABELS = new Set([
  "逻辑推理",
  "logical reasoning",
  "代码编程",
  "code programming",
  "数据分析",
  "data analysis",
  "内容写作",
  "content writing",
  "翻译任务",
  "translation",
]);

function getModelContentText(model: Model): string {
  const chunks: string[] = [
    model.tagline["zh-CN"],
    model.tagline.en,
    model.name["zh-CN"],
    model.name.en,
    ...model.description.flatMap((d) => [d["zh-CN"], d.en]),
  ];
  return chunks.join(" ").toLowerCase();
}

function textMatchesSignals(text: string, signals: string[]): boolean {
  const lower = text.toLowerCase();
  return signals.some((s) => lower.includes(s.toLowerCase()));
}

function useCaseMatchesScenario(
  model: Model,
  useCaseId: ScenarioCategoryId,
  scenario: ScenarioCategoryId
): boolean {
  if (useCaseId !== scenario) return false;

  const uc = model.useCases.find((u) => u.id === useCaseId);
  if (!uc) return false;

  const labelText = `${uc.label["zh-CN"]} ${uc.label.en}`;
  const contentText = getModelContentText(model);
  const signals = SCENARIO_SIGNALS[scenario];

  const labelIsGeneric =
    GENERIC_USE_CASE_LABELS.has(uc.label["zh-CN"].trim()) ||
    GENERIC_USE_CASE_LABELS.has(uc.label.en.trim().toLowerCase());

  const labelMatch = textMatchesSignals(labelText, signals);
  const contentMatch = textMatchesSignals(contentText, signals);

  if (labelIsGeneric) {
    return contentMatch;
  }

  if (scenario === "image-gen" && uc.category === "image") {
    return labelMatch || contentMatch;
  }
  if (scenario === "video-gen" && uc.category === "video") {
    return labelMatch || contentMatch;
  }

  return labelMatch || contentMatch;
}

export function modelHasScenario(
  model: Model,
  scenario: ScenarioFilter
): boolean {
  if (scenario === "all") return true;
  return model.useCases.some((uc) =>
    useCaseMatchesScenario(model, uc.id as ScenarioCategoryId, scenario)
  );
}

export function filterModelsByScenario(
  models: Model[],
  scenario: ScenarioFilter
): Model[] {
  if (scenario === "all") return models;
  return models.filter((m) => modelHasScenario(m, scenario));
}

export interface ScenarioGroup {
  id: ScenarioCategoryId;
  labels: LocalizedString;
  accent: string;
  models: Model[];
}

export function groupModelsByScenario(
  models: Model[],
  onlyScenario?: ScenarioFilter
): ScenarioGroup[] {
  if (onlyScenario && onlyScenario !== "all") {
    const cat = SCENARIO_CATEGORIES.find((c) => c.id === onlyScenario);
    if (!cat || models.length === 0) return [];
    return [
      {
        id: cat.id,
        labels: cat.labels,
        accent: cat.accent,
        models,
      },
    ];
  }

  return SCENARIO_CATEGORIES.map((cat) => ({
    id: cat.id,
    labels: cat.labels,
    accent: cat.accent,
    models: models.filter((m) => modelHasScenario(m, cat.id)),
  })).filter((g) => g.models.length > 0);
}

export function getScenarioCategory(
  id: ScenarioCategoryId
): ScenarioCategory | undefined {
  return SCENARIO_CATEGORIES.find((c) => c.id === id);
}

/** 模型详情页展示的主要场景（去重、按相关性） */
export function getModelScenarios(model: Model): ScenarioCategoryId[] {
  return SCENARIO_CATEGORIES.filter((cat) => modelHasScenario(model, cat.id)).map(
    (c) => c.id
  );
}

export function getScenarioLabel(
  id: ScenarioCategoryId,
  locale: "zh-CN" | "en"
): string {
  const cat = getScenarioCategory(id);
  return cat ? getLocalizedValue(cat.labels, locale) : id;
}
