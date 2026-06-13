/** Editorial reference metrics for comparison table — not certified benchmarks */
export const MODEL_COMPARE_METRICS: Record<
  string,
  {
    speed: { en: string; "zh-CN": string };
    chinese: { en: string; "zh-CN": string };
    coding: { en: string; "zh-CN": string };
    cost: { en: string; "zh-CN": string };
  }
> = {
  "deepseek-v3": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "Mid-high", "zh-CN": "中高" },
    coding: { en: "High", "zh-CN": "高" },
    cost: { en: "Low", "zh-CN": "低" },
  },
  "glm-4": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "High", "zh-CN": "高" },
    coding: { en: "Mid-high", "zh-CN": "中高" },
    cost: { en: "Mid", "zh-CN": "中" },
  },
  qwen: {
    speed: { en: "Mid-high", "zh-CN": "中高" },
    chinese: { en: "High", "zh-CN": "高" },
    coding: { en: "Mid", "zh-CN": "中" },
    cost: { en: "Mid", "zh-CN": "中" },
  },
  "ernie-4": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "High", "zh-CN": "高" },
    coding: { en: "Mid", "zh-CN": "中" },
    cost: { en: "Mid", "zh-CN": "中" },
  },
  "chatglm3-6b": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "Mid-high", "zh-CN": "中高" },
    coding: { en: "Mid", "zh-CN": "中" },
    cost: { en: "Low (self-host)", "zh-CN": "低（自建）" },
  },
  "qwen-7b": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "Mid-high", "zh-CN": "中高" },
    coding: { en: "Mid", "zh-CN": "中" },
    cost: { en: "Low (self-host)", "zh-CN": "低（自建）" },
  },
  "kling-ai": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "Mid-high", "zh-CN": "中高" },
    coding: { en: "Low", "zh-CN": "低" },
    cost: { en: "Mid", "zh-CN": "中" },
  },
  "hailuo-ai": {
    speed: { en: "Mid", "zh-CN": "中" },
    chinese: { en: "Mid", "zh-CN": "中" },
    coding: { en: "Low", "zh-CN": "低" },
    cost: { en: "Mid", "zh-CN": "中" },
  },
  "jimeng-ai": {
    speed: { en: "Mid-high", "zh-CN": "中高" },
    chinese: { en: "Mid-high", "zh-CN": "中高" },
    coding: { en: "Low", "zh-CN": "低" },
    cost: { en: "Mid", "zh-CN": "中" },
  },
};
