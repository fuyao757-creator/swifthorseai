/** Featured guide slugs for internal linking (SEO / GEO cluster). */
export const HOMEPAGE_GUIDE_SLUGS = [
  "china-ai-llm-guide-2026",
  "chinese-llms-global-guide-2026",
  "access-china-llm-api-overseas",
  "china-llm-api-pricing-2026",
  "top-chinese-ai-models-2026",
  "china-llm-agent-tool-calling-2026",
] as const;

export const MATCH_PAGE_GUIDE_SLUGS = [
  "china-ai-llm-guide-2026",
  "top-chinese-ai-models-2026",
  "deepseek-vs-qwen-selection-guide",
  "kimi-vs-glm-selection-guide-2026",
] as const;

const RELATED_GUIDE_POOL = [
  "china-ai-llm-guide-2026",
  "chinese-llms-global-guide-2026",
  "access-china-llm-api-overseas",
  "china-llm-api-pricing-2026",
  "top-chinese-ai-models-2026",
  "china-llm-agent-tool-calling-2026",
  "kimi-vs-glm-selection-guide-2026",
  "china-llm-compliance-overseas-2026",
  "deepseek-api-overseas-quickstart-2026",
  "chinese-llm-self-hosting-guide-2026",
  "deepseek-vs-qwen-selection-guide",
  "china-llm-rag-selection-guide",
] as const;

export function getRelatedGuideSlugs(currentSlug: string, limit = 4): string[] {
  return RELATED_GUIDE_POOL.filter((slug) => slug !== currentSlug).slice(0, limit);
}
