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
  "china-llm-vs-chatgpt-2026",
  "qwen-api-overseas-quickstart-2026",
  "china-llm-coding-assistant-2026",
  "glm-api-overseas-quickstart-2026",
  "kimi-api-overseas-quickstart-2026",
  "china-llm-openai-compatible-sdk-2026",
  "china-llm-latency-failover-2026",
  "best-chinese-llm-2026",
  "china-llm-vs-claude-2026",
  "china-llm-benchmarks-guide-2026",
  "china-llm-multimodal-vision-2026",
  "china-llm-json-structured-output-2026",
  "glm-4-selection-guide-2026",
  "china-llm-optimization-guide-2026",
  "deepseek-r1-reasoning-guide-2026",
  "china-llm-embedding-rag-setup-2026",
  "china-llm-enterprise-buyers-guide-2026",
  "deepseek-vs-qwen-selection-guide",
  "china-llm-rag-selection-guide",
] as const;

export function getRelatedGuideSlugs(currentSlug: string, limit = 4): string[] {
  return RELATED_GUIDE_POOL.filter((slug) => slug !== currentSlug).slice(0, limit);
}
