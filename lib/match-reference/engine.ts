export type Scenario =

  | "customer-service"

  | "coding"

  | "content"

  | "translation"

  | "data-analysis"

  | "general";



export type Language = "zh" | "en" | "multilingual" | "ja-ko";

export type Volume = "lt1k" | "1k-10k" | "10k-100k" | "gt100k";

export type Budget = "lt50" | "50-200" | "200-1000" | "unlimited";

export type Deployment = "cloud-api" | "private" | "both";

export type MediaFocus = "video" | "image" | "text" | "search" | "voice";

export interface MatchAnswers {

  scenario: Scenario;

  language: Language;

  volume: Volume;

  budget: Budget;

  deployment: Deployment;

  mediaFocus?: MediaFocus;

}



export type MatchLevel = "high" | "mid-high" | "mid";



export interface ModelRef {

  id: string;

  name: { en: string; "zh-CN": string };

  vendor: { en: string; "zh-CN": string };

  description: { en: string; "zh-CN": string };

  scenes: { en: string; "zh-CN": string }[];

  dataSource: { en: string; "zh-CN": string };

  dataSourceDetail: { en: string; "zh-CN": string };

  costRef: { en: string; "zh-CN": string };

  catalogId?: string;

}



export interface MatchResult extends ModelRef {

  matchLevel: MatchLevel;

  score: number;

}



interface ModelCapabilities {

  scenarios: Scenario[];

  languages: Language[];

  volumes: Volume[];

  budgets: Budget[];

  /** cloud-api / private / both (supports either mode) */

  deployments: Deployment[];

  /** When set, model is suited to specific content modalities (video, image, etc.) */

  mediaFocus?: MediaFocus[];

}



interface ModelEntry extends ModelRef {

  capabilities: ModelCapabilities;

}



const MODELS: Record<string, ModelEntry> = {

  "deepseek-v3": {

    id: "deepseek-v3",

    name: { en: "DeepSeek-V3", "zh-CN": "DeepSeek-V3" },

    vendor: { en: "DeepSeek", "zh-CN": "深度求索" },

    description: {

      en: "Strong code generation with competitive HumanEval references; cost-effective API pricing for high-volume workloads.",

      "zh-CN": "代码生成能力强，HumanEval 公开参考表现领先，API 调用性价比高。",

    },

    scenes: [

      { en: "Code generation", "zh-CN": "代码生成" },

      { en: "Debug & tech Q&A", "zh-CN": "Debug、技术问答" },

      { en: "Technical translation", "zh-CN": "技术文档翻译" },

    ],

    dataSource: {

      en: "Official tech report + community feedback",

      "zh-CN": "官方技术报告 + 社区反馈",

    },

    dataSourceDetail: {

      en: "Compiled from DeepSeek public technical reports, API pricing pages, and aggregated developer community discussions (2025–2026).",

      "zh-CN": "整理自深度求索公开技术报告、API 定价页及开发者社区讨论（2025–2026）。",

    },

    costRef: {

      en: "≈ ¥0.5–2 / 1M input tokens (official ref.)",

      "zh-CN": "约 ¥0.5–2 / 百万 input tokens（官方参考）",

    },

    catalogId: "deepseek-v3",

    capabilities: {

      scenarios: ["coding", "translation", "data-analysis", "general"],

      languages: ["zh", "en", "multilingual"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

  "glm-4": {

    id: "glm-4",

    name: { en: "GLM-4", "zh-CN": "GLM-4" },

    vendor: { en: "Zhipu AI", "zh-CN": "智谱AI" },

    description: {

      en: "Solid multi-turn dialogue and tool-calling; suitable for compliant conversational systems.",

      "zh-CN": "多轮对话能力强，工具调用方便，适合合规对话系统。",

    },

    scenes: [

      { en: "Customer bots", "zh-CN": "客服机器人" },

      { en: "Dialogue systems", "zh-CN": "对话系统" },

    ],

    dataSource: {

      en: "Vendor docs + public benchmarks",

      "zh-CN": "厂商文档 + 公开基准参考",

    },

    dataSourceDetail: {

      en: "Based on Zhipu open-platform documentation and publicly cited benchmark summaries.",

      "zh-CN": "基于智谱开放平台文档及公开引用的基准摘要。",

    },

    costRef: {

      en: "≈ ¥5–15 / 1M tokens (official ref.)",

      "zh-CN": "约 ¥5–15 / 百万 tokens（官方参考）",

    },

    catalogId: "glm-4-7",

    capabilities: {

      scenarios: ["customer-service", "data-analysis", "general"],

      languages: ["zh", "en"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

  qwen: {

    id: "qwen",

    name: { en: "Qwen (Tongyi Qianwen)", "zh-CN": "通义千问" },

    vendor: { en: "Alibaba Cloud", "zh-CN": "阿里云" },

    description: {

      en: "Broad multilingual coverage; balanced for e-commerce dialogue, long-form content, and translation.",

      "zh-CN": "多语言支持广，适合电商对话、长文本创作与翻译场景。",

    },

    scenes: [

      { en: "E-commerce support", "zh-CN": "电商客服" },

      { en: "Multilingual tasks", "zh-CN": "多语言处理" },

      { en: "Long-form writing", "zh-CN": "长文本创作" },

    ],

    dataSource: {

      en: "Official docs + industry reports",

      "zh-CN": "官方文档 + 行业公开资料",

    },

    dataSourceDetail: {

      en: "From Alibaba DashScope / Bailian public documentation and industry comparison reports.",

      "zh-CN": "来自阿里云百炼/DashScope 公开文档及行业对比公开资料。",

    },

    costRef: {

      en: "≈ ¥2–8 / 1M tokens (official ref.)",

      "zh-CN": "约 ¥2–8 / 百万 tokens（官方参考）",

    },

    catalogId: "qwen3-max",

    capabilities: {

      scenarios: [

        "customer-service",

        "content",

        "translation",

        "data-analysis",

        "general",

      ],

      languages: ["zh", "en", "multilingual", "ja-ko"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

  "ernie-4": {

    id: "ernie-4",

    name: { en: "ERNIE 4.0", "zh-CN": "文心 4.0" },

    vendor: { en: "Baidu AI Cloud", "zh-CN": "百度智能云" },

    description: {

      en: "Strong Chinese creative writing with diverse stylistic control for marketing and storytelling.",

      "zh-CN": "中文创意写作能力强，风格多样，适合营销与故事类内容。",

    },

    scenes: [

      { en: "Marketing copy", "zh-CN": "营销文案" },

      { en: "Story creation", "zh-CN": "故事创作" },

    ],

    dataSource: {

      en: "Baidu Qianfan docs + public reviews",

      "zh-CN": "百度千帆文档 + 公开评测参考",

    },

    dataSourceDetail: {

      en: "Compiled from Baidu Wenxin / Qianfan official pages and third-party review summaries.",

      "zh-CN": "整理自百度文心/千帆官方页面及第三方评测摘要。",

    },

    costRef: {

      en: "≈ ¥4–12 / 1M tokens (official ref.)",

      "zh-CN": "约 ¥4–12 / 百万 tokens（官方参考）",

    },

    catalogId: "ernie-4-5-turbo",

    capabilities: {

      scenarios: ["content", "general"],

      languages: ["zh"],

      volumes: ["lt1k", "1k-10k", "10k-100k"],

      budgets: ["50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

  "chatglm3-6b": {

    id: "chatglm3-6b",

    name: { en: "ChatGLM3-6B", "zh-CN": "ChatGLM3-6B" },

    vendor: { en: "Zhipu AI", "zh-CN": "智谱AI" },

    description: {

      en: "Open-weight model with commercial license; moderate GPU requirements for on-prem deployment.",

      "zh-CN": "开源可商用，6B 参数量显存要求相对较低，适合私有化部署。",

    },

    scenes: [

      { en: "On-prem chat", "zh-CN": "私有化对话" },

      { en: "Internal assistants", "zh-CN": "内部助手" },

    ],

    dataSource: {

      en: "Open-source repo + license docs",

      "zh-CN": "开源仓库 + 许可文档",

    },

    dataSourceDetail: {

      en: "From Zhipu open-source releases and published model license terms.",

      "zh-CN": "来自智谱开源发布说明及模型许可条款。",

    },

    costRef: {

      en: "Self-hosted infra cost only",

      "zh-CN": "仅自建算力成本",

    },

    capabilities: {

      scenarios: ["customer-service", "general"],

      languages: ["zh", "en"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["private", "both"],

    },

  },

  "qwen-7b": {

    id: "qwen-7b",

    name: { en: "Qwen-7B", "zh-CN": "Qwen-7B" },

    vendor: { en: "Alibaba Cloud", "zh-CN": "阿里云" },

    description: {

      en: "Open Qwen variant with balanced capability for private deployment and fine-tuning.",

      "zh-CN": "开源版本，性能均衡，适合私有化部署与微调。",

    },

    scenes: [

      { en: "Private deployment", "zh-CN": "私有化部署" },

      { en: "Fine-tuning", "zh-CN": "模型微调" },

    ],

    dataSource: {

      en: "Qwen open-source docs",

      "zh-CN": "Qwen 开源文档",

    },

    dataSourceDetail: {

      en: "From Alibaba Qwen GitHub releases and model cards.",

      "zh-CN": "来自阿里云 Qwen GitHub 发布与模型卡片。",

    },

    costRef: {

      en: "Self-hosted infra cost only",

      "zh-CN": "仅自建算力成本",

    },

    capabilities: {

      scenarios: ["coding", "data-analysis", "general"],

      languages: ["zh", "en", "multilingual"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["private"],

    },

  },

  "kling-ai": {

    id: "kling-ai",

    name: { en: "Kling AI", "zh-CN": "可灵AI" },

    vendor: { en: "Kuaishou", "zh-CN": "快手" },

    description: {

      en: "Cloud AI video generation and visual design for multilingual creative workflows.",

      "zh-CN": "云端 AI 视频生成与视觉设计，适合多语言创意内容工作流。",

    },

    scenes: [

      { en: "AI video production", "zh-CN": "AI 视频制作" },

      { en: "Visual design", "zh-CN": "视觉设计" },

    ],

    dataSource: {

      en: "Product pages + public capability summaries",

      "zh-CN": "产品页面 + 公开能力摘要",

    },

    dataSourceDetail: {

      en: "Compiled from Kling AI official product pages and publicly described features.",

      "zh-CN": "整理自可灵 AI 官方产品页及公开功能说明。",

    },

    costRef: {

      en: "Per official product pricing",

      "zh-CN": "以官方产品定价为准",

    },

    catalogId: "kling-ai",

    capabilities: {

      scenarios: ["content"],

      mediaFocus: ["video", "image"],

      languages: ["zh", "en", "multilingual"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

  "hailuo-ai": {

    id: "hailuo-ai",

    name: { en: "Hailuo AI", "zh-CN": "海螺AI" },

    vendor: { en: "MiniMax", "zh-CN": "MiniMax" },

    description: {

      en: "Video generation, creative content, and dialogue in a cloud consumer product.",

      "zh-CN": "视频生成、内容创作与对话，云端应用产品形态。",

    },

    scenes: [

      { en: "Video generation", "zh-CN": "视频生成" },

      { en: "Creative content", "zh-CN": "内容创作" },

    ],

    dataSource: {

      en: "Product pages + public capability summaries",

      "zh-CN": "产品页面 + 公开能力摘要",

    },

    dataSourceDetail: {

      en: "Compiled from Hailuo AI official product pages and publicly described features.",

      "zh-CN": "整理自海螺 AI 官方产品页及公开功能说明。",

    },

    costRef: {

      en: "Per official product pricing",

      "zh-CN": "以官方产品定价为准",

    },

    catalogId: "hailuo-ai",

    capabilities: {

      scenarios: ["content"],

      mediaFocus: ["video"],

      languages: ["zh", "en", "multilingual"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

  "jimeng-ai": {

    id: "jimeng-ai",

    name: { en: "Jimeng AI", "zh-CN": "即梦AI" },

    vendor: { en: "ByteDance", "zh-CN": "字节跳动" },

    description: {

      en: "AI image and video generation for creative production on cloud.",

      "zh-CN": "云端 AI 图像与视频生成，适合创意内容制作。",

    },

    scenes: [

      { en: "AI video production", "zh-CN": "AI 视频制作" },

      { en: "Image generation", "zh-CN": "图像生成" },

    ],

    dataSource: {

      en: "Product pages + public capability summaries",

      "zh-CN": "产品页面 + 公开能力摘要",

    },

    dataSourceDetail: {

      en: "Compiled from Jimeng AI official product pages and publicly described features.",

      "zh-CN": "整理自即梦 AI 官方产品页及公开功能说明。",

    },

    costRef: {

      en: "Per official product pricing",

      "zh-CN": "以官方产品定价为准",

    },

    catalogId: "jimeng-ai",

    capabilities: {

      scenarios: ["content"],

      mediaFocus: ["video", "image"],

      languages: ["zh", "en", "multilingual"],

      volumes: ["lt1k", "1k-10k", "10k-100k", "gt100k"],

      budgets: ["lt50", "50-200", "200-1000", "unlimited"],

      deployments: ["cloud-api"],

    },

  },

};



/** Relative fit within a scenario — used only after strict filtering. */

const SCENARIO_FIT: Partial<Record<Scenario, Record<string, number>>> = {

  coding: { "deepseek-v3": 100, "qwen-7b": 72, qwen: 55 },

  "customer-service": { "glm-4": 100, qwen: 88, "chatglm3-6b": 70 },

  content: { "ernie-4": 100, qwen: 92, "deepseek-v3": 76, "kling-ai": 95, "hailuo-ai": 93, "jimeng-ai": 91 },

  translation: { qwen: 100, "deepseek-v3": 78 },

  "data-analysis": { "deepseek-v3": 88, qwen: 80, "glm-4": 72, "qwen-7b": 65 },

  general: { qwen: 78, "deepseek-v3": 75, "glm-4": 72, "chatglm3-6b": 68, "qwen-7b": 65 },

};



function supportsDeployment(

  cap: ModelCapabilities,

  required: Deployment

): boolean {

  if (required === "both") return true;

  if (required === "cloud-api") {

    return cap.deployments.includes("cloud-api") || cap.deployments.includes("both");

  }

  return cap.deployments.includes("private") || cap.deployments.includes("both");

}



function modelSupportsMediaFocus(
  cap: ModelCapabilities,
  focus: MediaFocus
): boolean {
  const tags = cap.mediaFocus;
  if (focus === "text") {
    return !tags?.length || tags.includes("text");
  }
  return tags?.includes(focus) ?? false;
}



/** Every field present in `profile` must be satisfied; unspecified fields are not checked. */

export function modelSatisfiesProfile(

  modelId: string,

  profile: Partial<MatchAnswers>

): boolean {

  const model = MODELS[modelId];

  if (!model) return false;

  const cap = model.capabilities;



  if (profile.scenario && !cap.scenarios.includes(profile.scenario)) {

    return false;

  }

  if (profile.language && !cap.languages.includes(profile.language)) {

    return false;

  }

  if (profile.volume && !cap.volumes.includes(profile.volume)) {

    return false;

  }

  if (profile.budget && !cap.budgets.includes(profile.budget)) {

    return false;

  }

  if (profile.deployment && !supportsDeployment(cap, profile.deployment)) {

    return false;

  }

  if (profile.mediaFocus) {

    if (!modelSupportsMediaFocus(cap, profile.mediaFocus)) {

      return false;

    }

  }



  return true;

}



function profileMatchScore(

  modelId: string,

  profile: Partial<MatchAnswers>

): number {

  if (!profile.scenario) return 0;

  const model = MODELS[modelId];

  if (!model) return 0;

  const cap = model.capabilities;

  let score = fitScore(modelId, profile.scenario);



  if (profile.language && cap.languages.includes(profile.language)) {

    score += profile.language === "multilingual" ? 18 : 10;

  }

  if (profile.mediaFocus && modelSupportsMediaFocus(cap, profile.mediaFocus)) {

    score += profile.mediaFocus === "text" ? 35 : 30;

  } else if (
    profile.mediaFocus &&
    profile.mediaFocus !== "text" &&
    !cap.mediaFocus?.length
  ) {

    score -= 25;

  }

  if (profile.deployment === "cloud-api" && supportsDeployment(cap, "cloud-api")) {

    score += 8;

  }

  if (profile.deployment === "private" && supportsDeployment(cap, "private")) {

    score += 8;

  }



  return score;

}



function fitScore(modelId: string, scenario: Scenario): number {

  return SCENARIO_FIT[scenario]?.[modelId] ?? 50;

}



function levelFromScore(score: number, maxScore: number): MatchLevel {

  if (maxScore <= 0) return "mid";

  const ratio = score / maxScore;

  if (ratio >= 0.85 || score >= 90) return "high";

  if (ratio >= 0.65 || score >= 70) return "mid-high";

  return "mid";

}



function rankEligible(

  ids: string[],

  profile: Partial<MatchAnswers>

): MatchResult[] {

  const scored = ids

    .map((id) => ({ id, score: profileMatchScore(id, profile) }))

    .filter((x) => x.score > 0)

    .sort((a, b) => b.score - a.score)

    .slice(0, 3);



  if (scored.length === 0) return [];



  const maxScore = scored[0].score;

  return scored.map(({ id, score }) => {

    const { capabilities: _c, ...ref } = MODELS[id];

    return {

      ...ref,

      matchLevel: levelFromScore(score, maxScore),

      score,

    };

  });

}



/** Strict match: only models that satisfy every extracted condition are returned. */

export function computeMatchesFromProfile(

  profile: Partial<MatchAnswers>

): MatchResult[] {

  if (!profile.scenario) return [];



  const eligible = Object.keys(MODELS).filter((id) =>

    modelSatisfiesProfile(id, profile)

  );



  return rankEligible(eligible, profile);

}



export function computeMatches(answers: MatchAnswers): MatchResult[] {

  return computeMatchesFromProfile(answers);

}



export const MATCH_LAST_UPDATED = "2026-05-29";


