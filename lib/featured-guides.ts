import { getArticles } from "./articles";

/** Homepage strip — aligned to GSC queries that already have impressions. */
export const HOMEPAGE_GUIDE_SLUGS = [
  "best-chinese-llm-2026",
  "china-ai-llm-guide-2026",
  "glm-4-selection-guide-2026",
  "access-china-llm-api-overseas",
  "top-chinese-ai-models-2026",
  "china-llm-api-pricing-2026",
] as const;

export const MATCH_PAGE_GUIDE_SLUGS = [
  "best-chinese-llm-2026",
  "glm-4-selection-guide-2026",
  "top-chinese-ai-models-2026",
  "kimi-vs-glm-selection-guide-2026",
] as const;

/** Hub pages that should receive internal links from other articles. */
const RELATED_PRIORITY_SLUGS = [
  "best-chinese-llm-2026",
  "glm-4-selection-guide-2026",
  "china-ai-llm-guide-2026",
  "access-china-llm-api-overseas",
  "top-chinese-ai-models-2026",
  "china-llm-api-pricing-2026",
] as const;

const RELATED_GUIDE_POOL = [
  ...RELATED_PRIORITY_SLUGS,
  "chinese-llms-global-guide-2026",
  "china-llm-agent-tool-calling-2026",
  "kimi-vs-glm-selection-guide-2026",
  "china-llm-compliance-overseas-2026",
  "deepseek-api-overseas-quickstart-2026",
  "chinese-llm-self-hosting-guide-2026",
  "china-llm-vs-chatgpt-2026",
  "qwen-api-overseas-quickstart-2026",
  "china-llm-coding-assistant-2026",
  "glm-api-overseas-quickstart-2026",
  "kimi-api-overseas-quickstart-2026",
  "china-llm-openai-compatible-sdk-2026",
  "china-llm-latency-failover-2026",
  "china-llm-vs-claude-2026",
  "china-llm-benchmarks-guide-2026",
  "china-llm-multimodal-vision-2026",
  "china-llm-json-structured-output-2026",
  "china-llm-optimization-guide-2026",
  "deepseek-r1-reasoning-guide-2026",
  "china-llm-embedding-rag-setup-2026",
  "china-llm-enterprise-buyers-guide-2026",
  "deepseek-vs-qwen-selection-guide",
  "china-llm-rag-selection-guide",
] as const;

const prioritySet = new Set<string>(RELATED_PRIORITY_SLUGS);

export function getRelatedGuideSlugs(currentSlug: string, limit = 4): string[] {
  const rest = RELATED_GUIDE_POOL.filter(
    (slug) => slug !== currentSlug && !prioritySet.has(slug)
  );
  const priority = RELATED_PRIORITY_SLUGS.filter((slug) => slug !== currentSlug);
  return [...priority, ...rest].slice(0, limit);
}

/** Guides that list this model — used on model detail pages. */
export function getGuideSlugsForModel(modelId: string, limit = 3): string[] {
  const related = getArticles()
    .filter((article) => article.relatedModelIds?.includes(modelId))
    .map((article) => article.slug);

  const ranked = [
    ...RELATED_PRIORITY_SLUGS.filter((slug) => related.includes(slug)),
    ...related.filter((slug) => !prioritySet.has(slug)),
  ];

  return [...new Set(ranked)].slice(0, limit);
}
