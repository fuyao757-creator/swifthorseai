export interface LocalizedText {
  en: string;
  "zh-CN": string;
}

export interface CommercialModelEntry {
  id: string;
  name: LocalizedText;
  vendor: LocalizedText;
  objective: {
    mmlu: string;
    parameters: LocalizedText;
    contextLength: LocalizedText;
    maxOutput: LocalizedText;
    modalities: LocalizedText;
    apiFormat: LocalizedText;
    toolCalling: LocalizedText;
    deployment: LocalizedText;
    languages: LocalizedText;
    officialPrice: LocalizedText;
    knowledgeCutoff: LocalizedText;
    strengths: LocalizedText;
  };
  commercial: {
    ctaLabel: LocalizedText;
    href: string;
    partnerNote: LocalizedText;
  };
}

/** Public-reference data for side-by-side browsing; verify on vendor sites. */
export const COMMERCIAL_INDEX_MODELS: CommercialModelEntry[] = [
  {
    id: "deepseek-v4-pro",
    name: { en: "DeepSeek-V4-Pro", "zh-CN": "DeepSeek-V4-Pro" },
    vendor: { en: "DeepSeek", "zh-CN": "深度求索" },
    objective: {
      mmlu: "88.2 (vendor-reported ref.)",
      parameters: {
        en: "1.6T total · 49B active (MoE)",
        "zh-CN": "总参 1.6T · 激活 49B（MoE）",
      },
      contextLength: {
        en: "1M tokens",
        "zh-CN": "100 万 tokens",
      },
      maxOutput: {
        en: "Up to 384K tokens",
        "zh-CN": "最大输出 384K tokens",
      },
      modalities: {
        en: "Text",
        "zh-CN": "文本",
      },
      apiFormat: {
        en: "OpenAI-compatible REST API",
        "zh-CN": "兼容 OpenAI REST API",
      },
      toolCalling: {
        en: "Supported",
        "zh-CN": "支持",
      },
      deployment: {
        en: "Cloud API",
        "zh-CN": "云 API",
      },
      languages: {
        en: "Chinese, English, multilingual",
        "zh-CN": "中文、英文及多语言",
      },
      officialPrice: {
        en: "Per official pricing page",
        "zh-CN": "以官方定价页为准",
      },
      knowledgeCutoff: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      strengths: {
        en: "Reasoning, coding, low invocation cost",
        "zh-CN": "推理、代码、极低调用成本",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://www.deepseek.com/",
      partnerNote: {
        en: "DeepSeek official platform",
        "zh-CN": "深度求索官方平台",
      },
    },
  },
  {
    id: "qwen3-max",
    name: { en: "Qwen3-Max", "zh-CN": "Qwen3-Max" },
    vendor: { en: "Alibaba Cloud", "zh-CN": "阿里云" },
    objective: {
      mmlu: "87.5 (vendor-reported ref.)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "128K tokens (public ref.)",
        "zh-CN": "128K tokens（公开参考）",
      },
      maxOutput: {
        en: "Per DashScope limits",
        "zh-CN": "以 DashScope 限制为准",
      },
      modalities: {
        en: "Text, image, video, audio",
        "zh-CN": "文本、图像、视频、音频",
      },
      apiFormat: {
        en: "OpenAI-compatible (DashScope)",
        "zh-CN": "兼容 OpenAI（DashScope）",
      },
      toolCalling: {
        en: "Supported",
        "zh-CN": "支持",
      },
      deployment: {
        en: "Cloud API · enterprise tiers",
        "zh-CN": "云 API · 企业档位",
      },
      languages: {
        en: "Chinese, English, multilingual",
        "zh-CN": "中文、英文及多语言",
      },
      officialPrice: {
        en: "Per DashScope pricing",
        "zh-CN": "以百炼/DashScope 定价为准",
      },
      knowledgeCutoff: { en: "2025-04", "zh-CN": "2025-04" },
      strengths: {
        en: "Enterprise multimodal, balanced quality",
        "zh-CN": "企业多模态、综合质量均衡",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://www.aliyun.com/product/bailian",
      partnerNote: {
        en: "Alibaba Cloud Bailian",
        "zh-CN": "阿里云百炼平台",
      },
    },
  },
  {
    id: "glm-4-7",
    name: { en: "GLM-4.7", "zh-CN": "GLM-4.7" },
    vendor: { en: "Zhipu AI", "zh-CN": "智谱AI" },
    objective: {
      mmlu: "86.1 (vendor-reported ref.)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "128K tokens (public ref.)",
        "zh-CN": "128K tokens（公开参考）",
      },
      maxOutput: {
        en: "Per platform limits",
        "zh-CN": "以平台限制为准",
      },
      modalities: {
        en: "Text · vision (public ref.)",
        "zh-CN": "文本 · 视觉（公开参考）",
      },
      apiFormat: {
        en: "OpenAI-compatible + Zhipu SDK",
        "zh-CN": "兼容 OpenAI + 智谱 SDK",
      },
      toolCalling: {
        en: "Agentic · function calling",
        "zh-CN": "Agent · 函数调用",
      },
      deployment: {
        en: "Cloud API",
        "zh-CN": "云 API",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per Zhipu open platform",
        "zh-CN": "以智谱开放平台定价为准",
      },
      knowledgeCutoff: { en: "2025-03", "zh-CN": "2025-03" },
      strengths: {
        en: "Agentic coding, long-horizon planning",
        "zh-CN": "Agent 编程、长程规划",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://open.bigmodel.cn/",
      partnerNote: { en: "Zhipu open platform", "zh-CN": "智谱开放平台" },
    },
  },
  {
    id: "ernie-4-5-turbo",
    name: { en: "ERNIE 4.5 Turbo", "zh-CN": "ERNIE 4.5 Turbo" },
    vendor: { en: "Baidu AI Cloud", "zh-CN": "百度智能云" },
    objective: {
      mmlu: "85.8 (vendor-reported ref.)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "128K tokens (public ref.)",
        "zh-CN": "128K tokens（公开参考）",
      },
      maxOutput: {
        en: "Per Qianfan limits",
        "zh-CN": "以千帆限制为准",
      },
      modalities: {
        en: "Text · multimodal (public ref.)",
        "zh-CN": "文本 · 多模态（公开参考）",
      },
      apiFormat: {
        en: "OpenAI-compatible (Qianfan)",
        "zh-CN": "兼容 OpenAI（千帆）",
      },
      toolCalling: {
        en: "Supported",
        "zh-CN": "支持",
      },
      deployment: {
        en: "Cloud API · private options",
        "zh-CN": "云 API · 支持私有化",
      },
      languages: {
        en: "Chinese-first · English",
        "zh-CN": "中文优先 · 支持英文",
      },
      officialPrice: {
        en: "Per Qianfan pricing",
        "zh-CN": "以千帆平台定价为准",
      },
      knowledgeCutoff: { en: "2025-02", "zh-CN": "2025-02" },
      strengths: {
        en: "Chinese NLP, enterprise compliance",
        "zh-CN": "中文理解、企业合规",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://cloud.baidu.com/product/wenxinworkshop",
      partnerNote: { en: "Baidu Qianfan", "zh-CN": "百度千帆" },
    },
  },
  {
    id: "kimi-k2-6",
    name: { en: "Kimi K2", "zh-CN": "Kimi K2" },
    vendor: { en: "Moonshot AI", "zh-CN": "月之暗面" },
    objective: {
      mmlu: "86.9 (vendor-reported ref.)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "256K tokens",
        "zh-CN": "256K tokens",
      },
      maxOutput: {
        en: "Per Moonshot limits",
        "zh-CN": "以 Moonshot 限制为准",
      },
      modalities: {
        en: "Text · long-document focus",
        "zh-CN": "文本 · 长文档场景",
      },
      apiFormat: {
        en: "OpenAI-compatible API",
        "zh-CN": "兼容 OpenAI API",
      },
      toolCalling: {
        en: "Supported",
        "zh-CN": "支持",
      },
      deployment: {
        en: "Cloud API",
        "zh-CN": "云 API",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per Moonshot platform",
        "zh-CN": "以 Moonshot 平台定价为准",
      },
      knowledgeCutoff: { en: "2025-04", "zh-CN": "2025-04" },
      strengths: {
        en: "Long context, document workflows",
        "zh-CN": "超长上下文、文档工作流",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://platform.moonshot.cn/",
      partnerNote: { en: "Moonshot platform", "zh-CN": "Moonshot 开放平台" },
    },
  },
  {
    id: "hunyuan-hy3-preview",
    name: { en: "Hy3 Preview", "zh-CN": "Hy3 Preview" },
    vendor: { en: "Tencent Hunyuan", "zh-CN": "腾讯混元" },
    objective: {
      mmlu: "87.0 (vendor-reported ref.)",
      parameters: {
        en: "295B total · 21B active (MoE)",
        "zh-CN": "总参 295B · 激活 21B（MoE）",
      },
      contextLength: {
        en: "256K tokens",
        "zh-CN": "256K tokens",
      },
      maxOutput: {
        en: "Up to 128K tokens",
        "zh-CN": "最大输出 128K tokens",
      },
      modalities: {
        en: "Text · structured output",
        "zh-CN": "文本 · 结构化输出",
      },
      apiFormat: {
        en: "OpenAI-compatible + JSON schema",
        "zh-CN": "兼容 OpenAI + JSON Schema",
      },
      toolCalling: {
        en: "Function calling · agents",
        "zh-CN": "函数调用 · Agent",
      },
      deployment: {
        en: "Cloud API (Tencent Cloud)",
        "zh-CN": "云 API（腾讯云）",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per Tencent Cloud Hunyuan",
        "zh-CN": "以腾讯云混元定价为准",
      },
      knowledgeCutoff: { en: "2026-04", "zh-CN": "2026-04" },
      strengths: {
        en: "Long docs, agents, structured JSON",
        "zh-CN": "长文档、Agent、结构化 JSON",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://cloud.tencent.com/product/hunyuan",
      partnerNote: { en: "Tencent Cloud Hunyuan", "zh-CN": "腾讯云混元" },
    },
  },
  {
    id: "iflytek-spark",
    name: { en: "Spark", "zh-CN": "讯飞星火" },
    vendor: { en: "iFLYTEK", "zh-CN": "科大讯飞" },
    objective: {
      mmlu: "N/A (application product · 应用产品)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      maxOutput: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      modalities: {
        en: "Text · voice interaction",
        "zh-CN": "文本 · 语音交互",
      },
      apiFormat: {
        en: "Consumer web/app product",
        "zh-CN": "应用/网页产品",
      },
      toolCalling: {
        en: "Product-integrated features",
        "zh-CN": "产品内置能力",
      },
      deployment: {
        en: "Consumer app · web",
        "zh-CN": "应用产品 · 网页/客户端",
      },
      languages: {
        en: "Chinese, English, multilingual",
        "zh-CN": "中文、英文及多语言",
      },
      officialPrice: {
        en: "Per official announcement",
        "zh-CN": "以官方发布为准",
      },
      knowledgeCutoff: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      strengths: {
        en: "Voice interaction, multilingual translation, intelligent Q&A",
        "zh-CN": "语音交互、多语言翻译、智能问答",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://xinghuo.xfyun.cn/",
      partnerNote: { en: "iFLYTEK Spark", "zh-CN": "科大讯飞讯飞星火" },
    },
  },
  {
    id: "hailuo-ai",
    name: { en: "Hailuo AI", "zh-CN": "海螺AI" },
    vendor: { en: "MiniMax", "zh-CN": "MiniMax" },
    objective: {
      mmlu: "N/A (application product · 应用产品)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      maxOutput: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      modalities: {
        en: "Text · video",
        "zh-CN": "文本 · 视频",
      },
      apiFormat: {
        en: "Consumer web/app product",
        "zh-CN": "应用/网页产品",
      },
      toolCalling: {
        en: "Product-integrated features",
        "zh-CN": "产品内置能力",
      },
      deployment: {
        en: "Consumer app · web",
        "zh-CN": "应用产品 · 网页/客户端",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per official announcement",
        "zh-CN": "以官方发布为准",
      },
      knowledgeCutoff: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      strengths: {
        en: "Video generation, content creation, AI dialogue",
        "zh-CN": "视频生成、内容创作与 AI 对话",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://hailuoai.com/",
      partnerNote: { en: "MiniMax Hailuo AI", "zh-CN": "MiniMax 海螺 AI" },
    },
  },
  {
    id: "metaso-search",
    name: { en: "Metaso AI Search", "zh-CN": "秘塔AI搜索" },
    vendor: { en: "Metaso", "zh-CN": "秘塔科技" },
    objective: {
      mmlu: "N/A (application product · 应用产品)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      maxOutput: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      modalities: {
        en: "Text · AI search",
        "zh-CN": "文本 · AI 搜索",
      },
      apiFormat: {
        en: "Consumer web/app product",
        "zh-CN": "应用/网页产品",
      },
      toolCalling: {
        en: "Product-integrated features",
        "zh-CN": "产品内置能力",
      },
      deployment: {
        en: "Consumer app · web",
        "zh-CN": "应用产品 · 网页/客户端",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per official announcement",
        "zh-CN": "以官方发布为准",
      },
      knowledgeCutoff: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      strengths: {
        en: "AI search, information refinement, source attribution",
        "zh-CN": "AI 驱动搜索、信息精炼与来源标注",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://metaso.cn/",
      partnerNote: { en: "Metaso AI Search", "zh-CN": "秘塔 AI 搜索" },
    },
  },
  {
    id: "kling-ai",
    name: { en: "Kling AI", "zh-CN": "可灵AI" },
    vendor: { en: "Kuaishou", "zh-CN": "快手" },
    objective: {
      mmlu: "N/A (application product · 应用产品)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      maxOutput: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      modalities: {
        en: "Image · video",
        "zh-CN": "图像 · 视频",
      },
      apiFormat: {
        en: "Consumer web/app product",
        "zh-CN": "应用/网页产品",
      },
      toolCalling: {
        en: "Product-integrated features",
        "zh-CN": "产品内置能力",
      },
      deployment: {
        en: "Consumer app · web",
        "zh-CN": "应用产品 · 网页/客户端",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per official announcement",
        "zh-CN": "以官方发布为准",
      },
      knowledgeCutoff: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      strengths: {
        en: "AI video generation, visual design",
        "zh-CN": "AI 视频生成与视觉设计",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://klingai.com/",
      partnerNote: { en: "Kuaishou Kling AI", "zh-CN": "快手可灵 AI" },
    },
  },
  {
    id: "wps-ai",
    name: { en: "WPS AI", "zh-CN": "WPS AI" },
    vendor: { en: "Kingsoft Office", "zh-CN": "金山办公" },
    objective: {
      mmlu: "N/A (application product · 应用产品)",
      parameters: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      contextLength: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      maxOutput: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      modalities: {
        en: "Text · office documents",
        "zh-CN": "文本 · 办公文档",
      },
      apiFormat: {
        en: "Consumer web/app product",
        "zh-CN": "应用/网页产品",
      },
      toolCalling: {
        en: "Product-integrated features",
        "zh-CN": "产品内置能力",
      },
      deployment: {
        en: "Consumer app · desktop · web",
        "zh-CN": "应用产品 · 客户端/网页",
      },
      languages: {
        en: "Chinese, English",
        "zh-CN": "中文、英文",
      },
      officialPrice: {
        en: "Per official announcement",
        "zh-CN": "以官方发布为准",
      },
      knowledgeCutoff: {
        en: "Not publicly disclosed",
        "zh-CN": "未公开披露",
      },
      strengths: {
        en: "Smart document writing, PPT generation, spreadsheet processing",
        "zh-CN": "智能文档写作、PPT 生成与表格处理",
      },
    },
    commercial: {
      ctaLabel: { en: "Official website", "zh-CN": "访问官网" },
      href: "https://ai.wps.cn/",
      partnerNote: { en: "Kingsoft WPS AI", "zh-CN": "金山办公 WPS AI" },
    },
  },
];

export type CompareRowKey =
  | "vendor"
  | "parameters"
  | "mmlu"
  | "context"
  | "maxOutput"
  | "modalities"
  | "apiFormat"
  | "toolCalling"
  | "deployment"
  | "languages"
  | "price"
  | "cutoff"
  | "strengths";

export function getCompareCell(
  model: CommercialModelEntry,
  key: CompareRowKey,
  locale: "en" | "zh-CN"
): string {
  const loc = locale;
  switch (key) {
    case "vendor":
      return model.vendor[loc];
    case "parameters":
      return model.objective.parameters[loc];
    case "mmlu":
      return model.objective.mmlu;
    case "context":
      return model.objective.contextLength[loc];
    case "maxOutput":
      return model.objective.maxOutput[loc];
    case "modalities":
      return model.objective.modalities[loc];
    case "apiFormat":
      return model.objective.apiFormat[loc];
    case "toolCalling":
      return model.objective.toolCalling[loc];
    case "deployment":
      return model.objective.deployment[loc];
    case "languages":
      return model.objective.languages[loc];
    case "price":
      return model.objective.officialPrice[loc];
    case "cutoff":
      return model.objective.knowledgeCutoff[loc];
    case "strengths":
      return model.objective.strengths[loc];
    default:
      return "";
  }
}
