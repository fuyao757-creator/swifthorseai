import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const modelsPath = join(root, "data", "models.json");
const data = JSON.parse(readFileSync(modelsPath, "utf8"));

const listing = {
  date: "2026-05-28",
  title: { en: "Listed on Swift Horse", "zh-CN": "上架 Swift Horse" },
  summary: {
    en: "Catalog entry with polished capability overview.",
    "zh-CN": "图鉴条目已更新润色后的能力说明。",
  },
};

const pricing = [
  {
    tier: { en: "Pricing", "zh-CN": "定价" },
    inputPrice: { en: "Per official announcement", "zh-CN": "以官方发布为准" },
    outputPrice: { en: "Per official announcement", "zh-CN": "以官方发布为准" },
  },
];

const newModels = [
  {
    id: "baichuan-m3-plus",
    company: "baichuan",
    companyName: { en: "Baichuan AI", "zh-CN": "百川智能" },
    name: { en: "Baichuan-M3 Plus", "zh-CN": "Baichuan-M3 Plus" },
    tagline: {
      en: "Medical vertical LLM for serious healthcare — evidence anchoring, 2.6% hallucination rate",
      "zh-CN": "医疗垂类大模型，专注严肃医疗；证据锚定，幻觉率 2.6%",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    contextWindow: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "Baichuan-M3 Plus is Baichuan AI's medical vertical large model focused on serious healthcare settings.",
        "zh-CN": "Baichuan-M3 Plus 是百川智能面向严肃医疗场景的医疗垂类大模型。",
      },
      {
        en: "It supports evidence-enhanced medical Q&A, clinical decision assistance, and medical education, using proprietary evidence-anchoring so each conclusion is tied to the original paper evidence passage.",
        "zh-CN": "适用于循证增强医疗问答、临床辅助决策与医学教育；独创「证据锚定」技术，使每句结论可锚定至原始论文证据段落。",
      },
      {
        en: "With a reported hallucination rate of 2.6% (described as the lowest globally) and API costs 70% lower than the previous generation, it shows that relatively low-cost models can still deliver high performance in rigorous medical workloads.",
        "zh-CN": "公开称幻觉率仅 2.6%、为全球最低水平，且 API 成本较上一代降低 70%，表明相对较低成本的模型同样能够在严肃医疗场景中达到高性能。",
      },
    ],
    useCases: [
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "yi-large",
    company: "lingyi",
    companyName: { en: "01.AI", "zh-CN": "零一万物" },
    name: { en: "Yi-Large", "zh-CN": "Yi-Large" },
    tagline: {
      en: "100B+ parameter closed flagship — AlpacaEval 2.0 on par with GPT-4",
      "zh-CN": "千亿参数闭源旗舰，AlpacaEval 2.0 与 GPT-4 互有胜负",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "100B+ parameters (closed-source flagship)", "zh-CN": "千亿参数（闭源旗舰）" },
    contextWindow: { en: "16K tokens (base version)", "zh-CN": "16K（基础版本）" },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "Yi-Large is 01.AI's closed-source flagship model at 100B+ parameters.",
        "zh-CN": "Yi-Large 是零一万物千亿参数规模的闭源旗舰模型。",
      },
      {
        en: "On AlpacaEval 2.0 it trades first place with GPT-4; it excels at long-text understanding, deep summarization, and logical analysis, with a distinctive ability to capture deeper logic and philosophical nuance in summaries.",
        "zh-CN": "在 AlpacaEval 2.0 上与 GPT-4 互有第一；擅长长文本理解、深度总结与逻辑分析，能把握文本深层逻辑与哲学内涵，具备鲜明的「哲学家」式概括能力。",
      },
      {
        en: "With a 16K context window (base version) and OpenAI-compatible APIs, it demonstrates flagship-grade depth and insight on analytical tasks, supporting the view that high performance can be achieved without relying solely on maximal scale.",
        "zh-CN": "基础版本上下文长度为 16K，并兼容 OpenAI 接口格式；在分析类任务上展现旗舰级深度与洞察力，印证相对较低规模亦可达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "360-zhinao-turbo-seed-1-8",
    company: "qihoo",
    companyName: { en: "360 AI Brain", "zh-CN": "360" },
    name: {
      en: "360zhinao-turbo-doubao-seed-1-8",
      "zh-CN": "360zhinao-turbo-doubao-seed-1-8",
    },
    tagline: {
      en: "32K context — TTFT 0.34s, 47.19 tps, Reasoning, multi-format APIs",
      "zh-CN": "32K 上下文，TTFT 0.34 秒、吞吐 47.19 tps，支持 Reasoning 与多格式接口",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    contextWindow: {
      en: "32,000 tokens (max output 8,192)",
      "zh-CN": "32,000 tokens（最大输出 8,192）",
    },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "360zhinao-turbo-doubao-seed-1-8 is offered via the 360 AI Brain API (api.360.cn/v1).",
        "zh-CN": "360zhinao-turbo-doubao-seed-1-8 通过 360 智脑 API（api.360.cn/v1）接入。",
      },
      {
        en: "It provides a 32,000-token context (max output 8,192), supports Reasoning, and is compatible with OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, and Google Vertex AI formats.",
        "zh-CN": "上下文长度 32,000 tokens、最大输出 8,192 tokens；支持 Reasoning 推理能力，并兼容 OpenAI ChatCompletions、OpenAI Responses、Anthropic Messages、Google VertexAI 四种接口格式。",
      },
      {
        en: "Published metrics include TTFT 0.34s, throughput 47.19 tps, and 100% availability—indicating that relatively low-latency, cost-efficient serving can still deliver strong interactive performance.",
        "zh-CN": "公开性能指标包括 TTFT 0.34 秒、吞吐量 47.19 tps、可用性 100%，表明相对较低延迟与成本的部署同样能够达到出色的交互性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "skyclaw-v1",
    company: "kunlun",
    companyName: { en: "Kunlun Tech", "zh-CN": "昆仑万维" },
    name: { en: "SkyClaw-v1.0", "zh-CN": "SkyClaw-v1.0（旗舰版）" },
    tagline: {
      en: "Native Agent model — built for execution, optimized for tool calling",
      "zh-CN": "原生 Agent 模型，为「干活」而非「聊天」设计，工具调用从训练起优化",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    contextWindow: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "SkyClaw-v1.0 (flagship) is Kunlun Tech's native Agent model designed for task execution rather than open-ended chat, with tool use optimized from training.",
        "zh-CN": "SkyClaw-v1.0（旗舰版）是昆仑万维原生 Agent 模型，专为「干活」而非「聊天」设计，从训练阶段即针对工具调用优化。",
      },
      {
        en: "It is deeply adapted to OpenClaw, Claude Code, and other mainstream frameworks, supporting multi-step task decomposition, tool invocation, and cross-module code generation.",
        "zh-CN": "深度适配 OpenClaw、Claude Code 等主流框架，支持多步骤任务拆解与执行、工具调用及跨模块代码生成。",
      },
      {
        en: "Suited to enterprise multi-step Agent workloads, complex code generation, and full product prototyping—with OpenAI-compatible APIs—showing that Agent-focused models can deliver high execution performance at practical deployment cost.",
        "zh-CN": "适用于企业级多步骤 Agent 任务、复杂代码生成与完整产品原型开发；兼容 OpenAI 接口格式，表明面向 Agent 的模型可在务实成本下达到高执行性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "skyclaw-v1-lite",
    company: "kunlun",
    companyName: { en: "Kunlun Tech", "zh-CN": "昆仑万维" },
    name: { en: "SkyClaw-v1.0-lite", "zh-CN": "SkyClaw-v1.0-lite（轻量版）" },
    tagline: {
      en: "Lite Agent edition — faster, lower cost, core capabilities retained",
      "zh-CN": "轻量版 Agent，核心能力保留，速度更快、成本更低",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    contextWindow: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "SkyClaw-v1.0-lite is the lightweight edition of Kunlun Tech's SkyClaw Agent line.",
        "zh-CN": "SkyClaw-v1.0-lite 是昆仑万维 SkyClaw Agent 系列的轻量版本。",
      },
      {
        en: "It retains core Agent capabilities while offering faster responses and lower cost, with OpenAI-compatible APIs.",
        "zh-CN": "在保留核心能力的同时速度更快、成本更低，并兼容 OpenAI 接口格式。",
      },
      {
        en: "It targets high-frequency calls and cost-sensitive automation, including batch API use—demonstrating that a lower-cost Agent tier can still deliver reliable high performance for operational workloads.",
        "zh-CN": "适用于高频调用、成本敏感型自动化场景与批量 API 调用，表明更低成本的 Agent 档位同样能够在运营类负载中保持可靠的高性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "sensenova-6-7-flash-lite",
    company: "sensetime",
    companyName: { en: "SenseTime", "zh-CN": "商汤科技" },
    name: { en: "SenseNova 6.7 Flash-Lite", "zh-CN": "SenseNova 6.7 Flash-Lite" },
    tagline: {
      en: "Lightweight multimodal agent — native vision, 60% lower token use in search",
      "zh-CN": "轻量化多模态智能体，原生视觉架构，信息搜索场景 Token 直降 60%",
    },
    logo: "/logos/qwen.svg",
    parameters: {
      en: "Smaller parameter scale (multimodal agent architecture)",
      "zh-CN": "更小参数量（多模态智能体架构）",
    },
    contextWindow: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "SenseNova 6.7 Flash-Lite is SenseTime's lightweight multimodal agent model with a native multimodal architecture that removes the vision-to-text intermediate layer.",
        "zh-CN": "SenseNova 6.7 Flash-Lite 是商汤科技轻量化多模态智能体模型，采用原生多模态架构，取消视觉转文本中间层。",
      },
      {
        en: "It can directly interpret complex web layouts, document structures, and financial charts for integrated see-think-act workflows; token consumption in information-search scenarios is reported to drop by 60%, with millisecond-level feedback.",
        "zh-CN": "能以更小参数量直接看懂复杂网页布局、文档结构与财务图表，实现「看、想、做」一体化；信息搜索等场景 Token 消耗直降 60%，并具备毫秒级反馈。",
      },
      {
        en: "Suited to data analysis, in-depth research, and PPT generation and other long-chain tasks; SenseNova-Skills is open source on GitHub—showing that lighter, lower-cost multimodal agents can still reach high performance on complex workflows.",
        "zh-CN": "适用于数据分析、深度调研、PPT 生成等长链路复杂任务；SenseNova-Skills 已在 GitHub 开源，表明更轻量、更低成本的多模态智能体同样能够在复杂工作流中达到高性能。",
      },
    ],
    useCases: [
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "image-gen", label: { en: "Image Generation", "zh-CN": "图像生成" }, category: "image" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "jd-480b-open",
    company: "jd",
    companyName: { en: "JD Technology", "zh-CN": "京东科技" },
    name: {
      en: "48B General Foundation Model (Open Source)",
      "zh-CN": "480 亿参数通用基础大模型（开源）",
    },
    tagline: {
      en: "First open-source release — 48B params, Apache 2.0, multilingual & multimodal",
      "zh-CN": "首次开源，480 亿参数，Apache 2.0，多语言多模态长上下文",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "48 billion parameters", "zh-CN": "480 亿参数" },
    contextWindow: {
      en: "Long-context processing (per product description)",
      "zh-CN": "支持长上下文处理",
    },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "This 48-billion-parameter general foundation model is JD Technology's first open-source large model release.",
        "zh-CN": "该 480 亿参数通用基础大模型是京东科技首次开源的大模型。",
      },
      {
        en: "It supports multilingual and multimodal capabilities and long-context processing under the Apache 2.0 license (commercial-friendly).",
        "zh-CN": "支持多语言、多模态与长上下文处理；开源协议为 Apache 2.0（商业友好）。",
      },
      {
        en: "It is intended for e-commerce, finance, logistics, and related industries—an openly deployable base that lowers adoption cost while still targeting high capability at scale.",
        "zh-CN": "适用于电商、金融、物流等多个行业，以可开源部署的方式降低采用成本，同时在大规模参数下仍追求高能力表现。",
      },
    ],
    useCases: [
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "translation", label: { en: "Translation", "zh-CN": "翻译任务" }, category: "text" },
    ],
    pricing: [
      {
        tier: { en: "Open Source", "zh-CN": "开源" },
        inputPrice: { en: "Apache 2.0", "zh-CN": "Apache 2.0" },
        outputPrice: { en: "Self-hosted", "zh-CN": "可自部署" },
      },
    ],
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
  {
    id: "jd-jingyan-enterprise",
    company: "jd",
    companyName: { en: "JD Technology", "zh-CN": "京东科技" },
    name: { en: "Jingyan Enterprise", "zh-CN": "京言大模型企业版" },
    tagline: {
      en: "Industry-tuned enterprise edition — private deploy, ~50% lower cost vs intl. peers",
      "zh-CN": "行业定制企业版，支持私有化部署，成本较国际竞品降低 50% 以上",
    },
    logo: "/logos/qwen.svg",
    parameters: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    contextWindow: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    knowledgeCutoff: { en: "Not publicly disclosed", "zh-CN": "未公开披露" },
    description: [
      {
        en: "Jingyan Enterprise is JD Technology's enterprise edition large model, deeply customized for retail, finance, manufacturing, and related sectors.",
        "zh-CN": "京言大模型企业版是京东科技面向零售、金融、制造等行业深度定制的企业版大模型。",
      },
      {
        en: "It supports on-premise private deployment for data security and provides rich APIs for integration.",
        "zh-CN": "支持企业私有化部署以保障数据安全，并提供丰富 API 接口便于集成。",
      },
      {
        en: "Costs are stated to be more than 50% lower than international alternatives—showing that relatively low-cost enterprise models can still meet industry-specific high-performance requirements.",
        "zh-CN": "相比国际竞品成本降低 50% 以上，表明相对较低成本的企业级模型同样能够满足行业场景的高性能需求。",
      },
    ],
    useCases: [
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "translation", label: { en: "Translation", "zh-CN": "翻译任务" }, category: "text" },
    ],
    pricing,
    updates: [{ date: listing.date, title: listing.title, summary: listing.summary }],
  },
];

const hy3 = data.models.find((m) => m.id === "hunyuan-hy3-preview");
if (hy3) {
  hy3.tagline = {
    en: "295B / 21B active MoE — 256K context, deep thinking, agents & coding",
    "zh-CN": "295B/21B 激活 MoE，256K 上下文，深度思考、智能体与编程",
  };
  hy3.parameters = {
    en: "295B total / 21B active (MoE)",
    "zh-CN": "总参数 2950 亿 / 激活 210 亿（MoE）",
  };
  hy3.contextWindow = {
    en: "256K tokens (input 192K / output 128K; ~140K Chinese characters)",
    "zh-CN": "256K（输入 192K / 输出 128K，约 14 万中文字符）",
  };
  hy3.description = [
    {
      en: "Hy3 Preview uses a MoE architecture with 295B total parameters and 21B active per inference.",
      "zh-CN": "Hy3 Preview 采用 MoE 架构，总参数 2950 亿，每次推理激活 210 亿。",
    },
    {
      en: "Context length is 256K (input 192K / output 128K), holding roughly 140,000 Chinese characters; it supports interleaved deep thinking, JSON Schema structured output, Function Calling, and cache.",
      "zh-CN": "上下文 256K（输入 192K / 输出 128K），可容纳约 14 万中文字符；支持深度思考（交错式）、结构化输出（JSON Schema）、Function Calling 与 Cache 缓存。",
    },
    {
      en: "Use cases include long documents, Agent orchestration, coding assistance, knowledge-base Q&A, and contract review—MoE activation keeps serving cost practical while delivering high performance on long-context and tool-heavy workloads.",
      "zh-CN": "适用于长文档处理、智能体/Agent 编排、编程辅助、知识库问答与合同审查；MoE 激活机制使服务成本更可控，同时在长上下文与重工具负载上仍能达到高性能。",
    },
  ];
  hy3.updates.unshift({
    date: listing.date,
    title: { en: "Hy3 Preview Updated", "zh-CN": "Hy3 Preview 信息更新" },
    summary: {
      en: "Refreshed specs: 256K context, MoE 295B/21B active, tools & agents.",
      "zh-CN": "更新规格：256K 上下文、MoE 2950 亿/激活 210 亿、工具与智能体能力。",
    },
  });
}

const ids = new Set(data.models.map((m) => m.id));
for (const m of newModels) {
  if (!ids.has(m.id)) {
    data.models.push(m);
    ids.add(m.id);
  }
}

writeFileSync(modelsPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Catalog: ${data.models.length} models`);
