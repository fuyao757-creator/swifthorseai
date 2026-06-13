import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const models = JSON.parse(
  readFileSync(join(root, "data", "models.json"), "utf8")
).models;

const scores = {
  "deepseek-v4-pro": [93, 94, 95, 84, 92, 98],
  "deepseek-v4-flash": [92, 91, 94, 96, 99, 98],
  "deepseek-v3": [91, 90, 89, 88, 95, 88],
  "deepseek-r1": [90, 96, 98, 76, 94, 88],
  "qwen3-7-max": [94, 93, 92, 82, 90, 99],
  "qwen3-max": [95, 88, 90, 86, 88, 92],
  "qwen-plus-flash": [92, 85, 86, 94, 96, 86],
  "qwen-long": [93, 78, 85, 80, 91, 99],
  "ernie-5-1": [94, 86, 91, 85, 93, 88],
  "ernie-4-5-turbo": [93, 82, 86, 90, 89, 92],
  "ernie-x1": [94, 86, 93, 82, 90, 85],
  "glm-4-7": [93, 94, 90, 84, 88, 88],
  "glm-5": [94, 88, 91, 87, 89, 90],
  "glm-4v": [90, 75, 85, 86, 87, 82],
  "kimi-k2-6": [94, 93, 92, 80, 88, 92],
  "kimi-k2-thinking": [93, 90, 95, 76, 89, 88],
  "hunyuan-hy3-preview": [93, 95, 94, 88, 91, 98],
  "baichuan-m3-plus": [93, 78, 92, 88, 94, 82],
  "yi-large": [91, 84, 94, 80, 88, 72],
  "360-zhinao-turbo-seed-1-8": [90, 88, 91, 96, 93, 80],
  "skyclaw-v1": [86, 96, 90, 84, 90, 82],
  "skyclaw-v1-lite": [84, 92, 86, 94, 96, 78],
  "sensenova-6-7-flash-lite": [90, 85, 88, 97, 94, 82],
  "jd-480b-open": [92, 88, 89, 82, 93, 88],
  "jd-jingyan-enterprise": [93, 86, 88, 85, 92, 86],
  "hunyuan-hy2": [91, 78, 84, 85, 88, 84],
  "doubao-seed-1-8": [95, 92, 93, 86, 91, 88],
  "doubao-seed-1-6": [92, 87, 91, 90, 93, 85],
  seedream: [88, 70, 80, 90, 93, 78],
};

const benchmarks = models.map((m) => {
  const [chineseUnderstanding, coding, reasoning, responseSpeed, valueForMoney, contextLength] =
    scores[m.id] ?? [85, 80, 82, 85, 88, 80];
  return {
    modelId: m.id,
    modelName: m.name,
    chineseUnderstanding,
    coding,
    reasoning,
    responseSpeed,
    valueForMoney,
    contextLength,
  };
});

const data = JSON.parse(readFileSync(join(root, "data", "benchmarks.json"), "utf8"));

data.benchmarks = benchmarks;
data.meta = {
  lastReviewed: new Date().toISOString().slice(0, 10),
  scoreType: "editorial_reference",
  scaleMax: 100,
};
data.recommendations = [
  {
    scenarioId: "coding",
    category: "text",
    primaryModelId: "deepseek-r1",
    reason: {
      en: "DeepSeek-R1 exposes chain-of-thought reasoning for mathematics, programming, and complex logic.",
      "zh-CN": "DeepSeek-R1 展示思维链推理，面向数学、编程与复杂逻辑任务。",
    },
  },
  {
    scenarioId: "writing",
    category: "text",
    primaryModelId: "qwen-plus-flash",
    reason: {
      en: "Qwen-Plus / Qwen-Flash balances cost performance and low latency for everyday content and RAG workloads.",
      "zh-CN": "Qwen-Plus / Qwen-Flash 在性价比与低延迟之间取得平衡，适合日常内容与 RAG 场景。",
    },
  },
  {
    scenarioId: "translation",
    category: "text",
    primaryModelId: "qwen3-max",
    reason: {
      en: "Qwen3-Max / Qwen-Max offers strong overall capability for enterprise multilingual workflows.",
      "zh-CN": "Qwen3-Max / Qwen-Max 综合能力强，适合企业级多语言工作流。",
    },
  },
  {
    scenarioId: "reasoning",
    category: "text",
    primaryModelId: "deepseek-r1",
    reason: {
      en: "DeepSeek-R1 is built for reasoning-first tasks with visible internal thinking.",
      "zh-CN": "DeepSeek-R1 面向推理优先任务，可呈现内部思考过程。",
    },
  },
  {
    scenarioId: "analysis",
    category: "text",
    primaryModelId: "qwen-long",
    reason: {
      en: "Qwen-Long's 1M-token context supports long documents, filings, and contract review in one pass.",
      "zh-CN": "Qwen-Long 的 100 万 token 上下文可一次性处理长文档、财报与合同审查。",
    },
  },
  {
    scenarioId: "image-gen",
    category: "image",
    primaryModelId: "seedream",
    reason: {
      en: "Doubao-Seedream 4.5 supports multi-round edit, reference-image edit, and variant generation.",
      "zh-CN": "Doubao-Seedream 4.5 支持多轮编辑、参考图编辑与变体生成。",
    },
  },
  {
    scenarioId: "video-gen",
    category: "video",
    primaryModelId: "hunyuan-hy2",
    reason: {
      en: "Hy2.0 covers text-to-image and text-to-video generation for creative marketing scenarios.",
      "zh-CN": "Hy2.0 涵盖文生图与文生视频，面向创意营销场景。",
    },
  },
];

writeFileSync(
  join(root, "data", "benchmarks.json"),
  JSON.stringify(data, null, 2) + "\n",
  "utf8"
);
console.log("Wrote", benchmarks.length, "benchmark rows");
