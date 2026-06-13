import { COMMERCIAL_INDEX_MODELS } from "@/lib/commercial-index/data";
import { getModelById } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import type { Scenario } from "@/lib/match-reference/engine";
import type { SceneId } from "@/lib/prompt-tool/types";

/** 工作流模块：浏览 → 对比 → 匹配 → 提示词 */
export type WorkflowModule = "models" | "services" | "match" | "prompts";

export const WORKFLOW_MODULES: WorkflowModule[] = [
  "models",
  "services",
  "match",
  "prompts",
];

const COMPARABLE_IDS = new Set(
  COMMERCIAL_INDEX_MODELS.map((m) => m.id)
);

/** 后期新增模型：写入 models.json，并在 commercial-index/data.ts 增加对比条目 */
export function getComparableModelIds(): string[] {
  return COMMERCIAL_INDEX_MODELS.map((m) => m.id);
}

export function isComparableModel(id: string): boolean {
  return COMPARABLE_IDS.has(id);
}

export function parseModelIdsParam(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((id) => COMPARABLE_IDS.has(id));
}

export function filterComparableIds(ids: string[]): string[] {
  return ids.filter((id) => COMPARABLE_IDS.has(id));
}

export function buildServicesUrl(locale: Locale, modelIds?: string[]): string {
  const base = `/${locale}/services`;
  const ids = filterComparableIds(modelIds ?? []).slice(0, 3);
  if (!ids.length) return base;
  return `${base}?models=${ids.join(",")}`;
}

export function buildMatchUrl(
  locale: Locale,
  opts?: { scenario?: Scenario }
): string {
  const base = `/${locale}/match`;
  if (!opts?.scenario) return base;
  return `${base}?scenario=${opts.scenario}`;
}

export function buildPromptsUrl(
  locale: Locale,
  opts?: { scene?: SceneId; models?: string[] }
): string {
  const params = new URLSearchParams();
  if (opts?.scene) params.set("scene", opts.scene);
  const ids = filterComparableIds(opts?.models ?? []);
  if (ids.length) params.set("models", ids.join(","));
  const q = params.toString();
  return `/${locale}/prompts${q ? `?${q}` : ""}`;
}

export function buildModelUrl(locale: Locale, id: string): string {
  return `/${locale}/models/${id}`;
}

const USE_CASE_TO_MATCH: Partial<Record<string, Scenario>> = {
  coding: "coding",
  reasoning: "general",
  writing: "content",
  analysis: "data-analysis",
  translation: "translation",
  search: "general",
  "image-gen": "content",
  "video-gen": "content",
};

const USE_CASE_TO_PROMPT: Partial<Record<string, SceneId>> = {
  coding: "code",
  writing: "writing",
  analysis: "analysis",
  translation: "translation",
  reasoning: "general",
};

const MATCH_TO_PROMPT: Partial<Record<Scenario, SceneId>> = {
  "customer-service": "customer_service",
  coding: "code",
  content: "writing",
  translation: "translation",
  "data-analysis": "analysis",
  general: "general",
};

export function inferMatchScenarioFromModel(modelId: string): Scenario | undefined {
  const model = getModelById(modelId);
  if (!model) return undefined;
  for (const uc of model.useCases) {
    const scenario = USE_CASE_TO_MATCH[uc.id];
    if (scenario) return scenario;
  }
  return "general";
}

export function inferPromptSceneFromModel(modelId: string): SceneId | undefined {
  const model = getModelById(modelId);
  if (!model) return undefined;
  for (const uc of model.useCases) {
    const scene = USE_CASE_TO_PROMPT[uc.id];
    if (scene) return scene;
  }
  return "general";
}

export function matchScenarioToPromptScene(scenario: Scenario): SceneId {
  return MATCH_TO_PROMPT[scenario] ?? "general";
}

export function parseScenarioParam(raw: string | null | undefined): Scenario | undefined {
  const valid: Scenario[] = [
    "customer-service",
    "coding",
    "content",
    "translation",
    "data-analysis",
    "general",
  ];
  if (!raw || !valid.includes(raw as Scenario)) return undefined;
  return raw as Scenario;
}

export function parseSceneParam(raw: string | null | undefined): SceneId | undefined {
  const valid: SceneId[] = [
    "customer_service",
    "code",
    "writing",
    "translation",
    "analysis",
    "meeting",
    "email",
    "resume",
    "tutoring",
    "brainstorm",
    "general",
  ];
  if (!raw || !valid.includes(raw as SceneId)) return undefined;
  return raw as SceneId;
}
