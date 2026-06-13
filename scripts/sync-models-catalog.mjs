import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const nd = { en: "Not publicly disclosed", "zh-CN": "未公开披露" };
const pricing = [
  {
    tier: { en: "Pricing", "zh-CN": "定价" },
    inputPrice: { en: "Per official announcement", "zh-CN": "以官方发布为准" },
    outputPrice: { en: "Per official announcement", "zh-CN": "以官方发布为准" },
  },
];

function m(cfg) {
  return {
    id: cfg.id,
    company: cfg.company,
    companyName: cfg.companyName,
    name: cfg.name,
    tagline: cfg.tagline,
    logo: cfg.logo,
    parameters: cfg.parameters ?? nd,
    contextWindow: cfg.contextWindow ?? nd,
    knowledgeCutoff: cfg.knowledgeCutoff ?? nd,
    description: cfg.description,
    useCases: cfg.useCases,
    pricing: cfg.pricing ?? pricing,
    updates: cfg.updates ?? [
      {
        date: "2026-05-27",
        title: cfg.updateTitle ?? {
          en: `${cfg.name.en} Listed on BeyondMax AI`,
          "zh-CN": `${cfg.name["zh-CN"]} 上架 BeyondMax AI`,
        },
        summary: cfg.updateSummary ?? {
          en: "Catalog entry with polished capability overview.",
          "zh-CN": "图鉴条目已更新润色后的能力说明。",
        },
      },
    ],
  };
}

const models = [
  m({
    id: "deepseek-v4-pro",
    company: "deepseek",
    companyName: { en: "DeepSeek", "zh-CN": "深度求索" },
    name: { en: "DeepSeek-V4-Pro", "zh-CN": "DeepSeek-V4-Pro" },
    tagline: {
      en: "V4 flagship — high performance, strong reasoning, very low call cost",
      "zh-CN": "V4 高性能版（Pro），推理能力强，调用成本极低",
    },
    logo: "/logos/deepseek.svg",
    parameters: {
      en: "1.6T total (49B active per inference)",
      "zh-CN": "总参数 1.6 万亿（每次推理激活 490 亿）",
    },
    contextWindow: {
      en: "1M tokens (max output 384K)",
      "zh-CN": "100 万 tokens（最大输出 384K）",
    },
    description: [
      {
        en: "DeepSeek-V4-Pro is the high-performance edition in DeepSeek's latest V4 flagship line, built for demanding reasoning and generation with very low invocation cost.",
        "zh-CN": "DeepSeek-V4-Pro 是深度求索最新 V4 旗舰系列中的高性能版（Pro），面向高要求推理与生成任务，调用成本极低。",
      },
      {
        en: "Together with V4-Flash, the V4 family covers both peak capability and high-speed, low-cost deployment—Pro prioritizes reasoning strength for complex workloads.",
        "zh-CN": "与 V4-Flash 共同构成 V4 系列：兼顾旗舰能力与高速低成本部署，Pro 侧重复杂负载下的推理能力。",
      },
      {
        en: "DeepSeek-V4-Pro shows that flagship-grade reasoning can be delivered at extremely low call cost, supporting the view that relatively low-cost models can still achieve high performance.",
        "zh-CN": "DeepSeek-V4-Pro 表明：旗舰级推理可在极低调用成本下交付，进一步印证相对较低成本的模型同样能够达到高性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
    ],
    updates: [
      {
        date: "2026-05-25",
        title: { en: "DeepSeek-V4-Pro Listed", "zh-CN": "DeepSeek-V4-Pro 上架" },
        summary: {
          en: "V4 high-performance edition with strong reasoning and very low call cost.",
          "zh-CN": "V4 高性能版，推理能力强，调用成本极低。",
        },
      },
    ],
  }),
  m({
    id: "deepseek-v4-flash",
    company: "deepseek",
    companyName: { en: "DeepSeek", "zh-CN": "深度求索" },
    name: { en: "DeepSeek-V4-Flash", "zh-CN": "DeepSeek-V4-Flash" },
    tagline: {
      en: "V4 high-speed, low-cost edition — strong reasoning, very low call cost",
      "zh-CN": "V4 高速低成本版（Flash），推理能力强，调用成本极低",
    },
    logo: "/logos/deepseek.svg",
    parameters: {
      en: "284B total (13B active per inference)",
      "zh-CN": "总参数 2840 亿（每次推理激活 130 亿）",
    },
    contextWindow: {
      en: "1M tokens (max output 384K)",
      "zh-CN": "100 万 tokens（最大输出 384K）",
    },
    description: [
      {
        en: "DeepSeek-V4-Flash is the high-speed, low-cost edition in the V4 flagship line, pairing strong reasoning with very low invocation cost for high-frequency production use.",
        "zh-CN": "DeepSeek-V4-Flash 是 V4 旗舰系列中的高速低成本版（Flash），在保持较强推理能力的同时，以极低调用成本支撑高频生产调用。",
      },
      {
        en: "It complements V4-Pro within the latest V4 generation: Flash emphasizes throughput and economy where Pro emphasizes peak performance, both under the same low-cost positioning.",
        "zh-CN": "与 V4-Pro 共同构成最新 V4 代际：Flash 侧重吞吐与经济性，Pro 侧重峰值性能，二者均强调低成本优势。",
      },
      {
        en: "DeepSeek-V4-Flash reinforces that high-speed, low-cost tiers can still deliver strong reasoning performance, illustrating that relatively low-cost models can achieve high performance at scale.",
        "zh-CN": "DeepSeek-V4-Flash 进一步表明：高速低成本档位仍可保持较强推理表现，印证相对较低成本的模型同样能够规模化达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
    ],
    updates: [
      {
        date: "2026-05-25",
        title: { en: "DeepSeek-V4-Flash Listed", "zh-CN": "DeepSeek-V4-Flash 上架" },
        summary: {
          en: "V4 high-speed low-cost edition with strong reasoning and very low call cost.",
          "zh-CN": "V4 高速低成本版，推理能力强，调用成本极低。",
        },
      },
    ],
  }),
  m({
    id: "deepseek-v3",
    company: "deepseek",
    companyName: { en: "DeepSeek", "zh-CN": "深度求索" },
    name: { en: "DeepSeek-V3 / V3.1", "zh-CN": "DeepSeek-V3 / V3.1" },
    tagline: {
      en: "High value — MoE, coding, reasoning, long-context optimization",
      "zh-CN": "高性价比，MoE 架构，代码生成、逻辑推理、长上下文优化",
    },
    logo: "/logos/deepseek.svg",
    description: [
      {
        en: "DeepSeek-V3 / V3.1 is built on a Mixture-of-Experts (MoE) architecture, emphasizing high cost performance alongside code generation, logical reasoning, and long-context optimization.",
        "zh-CN": "DeepSeek-V3 / V3.1 采用 MoE 架构，侧重高性价比，并覆盖代码生成、逻辑推理与长上下文优化。",
      },
      {
        en: "It suits development assistants, analytical workflows, and long-document tasks where MoE efficiency helps control inference cost while maintaining strong general capability.",
        "zh-CN": "适用于开发助手、分析工作流与长文档任务——MoE 效率有助于控制推理成本，同时保持稳健的通用能力。",
      },
      {
        en: "The V3 / V3.1 line demonstrates that MoE design can deliver coding and reasoning performance at practical deployment cost, supporting the view that relatively low-cost models can still achieve high performance.",
        "zh-CN": "V3 / V3.1 表明：MoE 设计可在务实部署成本下交付编程与推理能力，进一步印证相对较低成本的模型同样能够达到高性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
    ],
  }),
  m({
    id: "deepseek-r1",
    company: "deepseek",
    companyName: { en: "DeepSeek", "zh-CN": "深度求索" },
    name: { en: "DeepSeek-R1", "zh-CN": "DeepSeek-R1" },
    tagline: {
      en: "Chain-of-thought reasoning — math, coding, complex logic, visible internal thinking",
      "zh-CN": "思维链展示，推理模型，数学与编程，复杂逻辑分析，内部思考过程",
    },
    logo: "/logos/deepseek.svg",
    description: [
      {
        en: "DeepSeek-R1 is a reasoning model that exposes chain-of-thought style deliberation, with visible internal thinking before final answers—oriented toward mathematics, programming, and complex logical analysis.",
        "zh-CN": "DeepSeek-R1 是推理模型，可展示思维链式推演并呈现内部思考过程，面向数学、编程与复杂逻辑分析任务。",
      },
      {
        en: "It fits workloads that benefit from inspectable reasoning steps, such as proof-style problems, algorithm design, and multi-stage analytical tasks.",
        "zh-CN": "适用于需要可检视推理步骤的工作负载，如证明类问题、算法设计与多阶段分析任务。",
      },
      {
        en: "DeepSeek-R1 shows that transparent, reasoning-first models can be deployed at practical cost while still delivering high performance on math, code, and logic-intensive tasks.",
        "zh-CN": "DeepSeek-R1 表明：透明推理型模型可在务实成本下部署，并在数学、代码与逻辑密集型任务上达到高性能，进一步印证低成本亦可支撑高性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "qwen3-7-max",
    company: "alibaba",
    companyName: { en: "Alibaba Cloud", "zh-CN": "阿里云" },
    name: { en: "Qwen3.7-Max", "zh-CN": "Qwen3.7-Max" },
    tagline: {
      en: "AI Agent — 35h autonomous runs, coding agent, tools, code gen, 1M context",
      "zh-CN": "AI Agent 优化，长周期自主执行（35 小时），编程智能体、工具调用、代码生成、百万上下文",
    },
    logo: "/logos/qwen.svg",
    contextWindow: { en: "1M tokens", "zh-CN": "100 万 tokens" },
    description: [
      {
        en: "Qwen3.7-Max is optimized for AI agents, supporting long-horizon autonomous execution (up to 35 hours), a coding agent with tool calling and code generation, and a 1 million-token context window.",
        "zh-CN": "Qwen3.7-Max 面向 AI Agent 场景优化，支持最长约 35 小时的长周期自主执行，具备编程智能体、工具调用与代码生成能力，并提供百万级上下文。",
      },
      {
        en: "It targets end-to-end agent pipelines—software automation, multi-step research, and tool-augmented coding—where sustained autonomy and large context must work together.",
        "zh-CN": "适用于端到端智能体流水线——软件自动化、多步研究与工具增强编程——需要自主执行与超大上下文协同的场景。",
      },
      {
        en: "Qwen3.7-Max illustrates that long-horizon agent workloads can be served at practical deployment cost, reinforcing that relatively low-cost models can still achieve high performance on complex autonomous tasks.",
        "zh-CN": "Qwen3.7-Max 表明：长周期智能体负载可在务实部署成本下承接，进一步印证相对较低成本的模型同样能够在复杂自主任务上达到高性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "qwen3-max",
    company: "alibaba",
    companyName: { en: "Alibaba Cloud", "zh-CN": "阿里云" },
    name: { en: "Qwen3-Max / Qwen-Max", "zh-CN": "Qwen3-Max / Qwen-Max" },
    tagline: {
      en: "Flagship — strong overall capability, multimodal (image/video/audio), enterprise",
      "zh-CN": "旗舰模型，综合能力强，多模态识别（图/视/音频），企业级应用",
    },
    logo: "/logos/qwen.svg",
    description: [
      {
        en: "Qwen3-Max / Qwen-Max is the flagship tier in the Tongyi Qwen family, offering strong overall capability, multimodal understanding across image, video, and audio, and positioning for enterprise applications.",
        "zh-CN": "Qwen3-Max / Qwen-Max 是通义千问旗舰档位，综合能力强，支持图像、视频与音频的多模态识别，面向企业级应用。",
      },
      {
        en: "It suits organization-wide assistants, multimodal analytics, and production workflows that require balanced quality across modalities in one stack.",
        "zh-CN": "适用于企业级助手、多模态分析与需要在同一技术栈内跨模态保持质量的生产工作流。",
      },
      {
        en: "The flagship line shows that enterprise-grade multimodal performance can be accessed at practical cost tiers, supporting the view that relatively low-cost models can still reach high performance in production.",
        "zh-CN": "旗舰系列表明：企业级多模态能力可在务实成本档位获取，进一步印证相对较低成本的模型同样能够在生产环境中达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "image-gen", label: { en: "Image Generation", "zh-CN": "图像生成" }, category: "image" },
    ],
  }),
  m({
    id: "qwen-plus-flash",
    company: "alibaba",
    companyName: { en: "Alibaba Cloud", "zh-CN": "阿里云" },
    name: { en: "Qwen-Plus / Qwen-Flash", "zh-CN": "Qwen-Plus / Qwen-Flash" },
    tagline: {
      en: "Plus for value — Flash for speed; high concurrency, low latency, RAG",
      "zh-CN": "Plus 性价比之选，Flash 极速轻量版，高并发、低延迟，RAG 应用",
    },
    logo: "/logos/qwen.svg",
    description: [
      {
        en: "Qwen-Plus and Qwen-Flash are complementary tiers: Plus emphasizes cost performance for everyday workloads, while Flash is a lightweight, ultra-fast edition for high concurrency and low latency—both suited to RAG applications.",
        "zh-CN": "Qwen-Plus 与 Qwen-Flash 为互补档位：Plus 侧重日常负载的性价比，Flash 为极速轻量版，面向高并发与低延迟，二者均适用于 RAG 应用。",
      },
      {
        en: "Teams can route latency-sensitive, high-QPS traffic to Flash and knowledge-heavy, quality-balanced tasks to Plus within the same Qwen ecosystem.",
        "zh-CN": "团队可在同一通义生态内将时延敏感的高 QPS 流量导向 Flash，将知识密集型、质量均衡的任务导向 Plus。",
      },
      {
        en: "Together they demonstrate that RAG and high-concurrency serving do not require flagship pricing to reach strong practical performance—relatively low-cost models can still achieve high performance.",
        "zh-CN": "二者共同表明：RAG 与高并发服务无需旗舰定价亦可获得强劲实用表现，进一步印证相对较低成本的模型同样能够达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "translation", label: { en: "Translation", "zh-CN": "翻译任务" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "qwen-long",
    company: "alibaba",
    companyName: { en: "Alibaba Cloud", "zh-CN": "阿里云" },
    name: { en: "Qwen-Long", "zh-CN": "Qwen-Long" },
    tagline: {
      en: "Ultra-long context (1M tokens) — long-doc summary, filings, legal contracts",
      "zh-CN": "极长上下文（100 万 tokens），长文档摘要、财报分析、法律合同审查",
    },
    logo: "/logos/qwen.svg",
    contextWindow: { en: "1M tokens", "zh-CN": "100 万 tokens" },
    description: [
      {
        en: "Qwen-Long provides an ultra-long context window of 1 million tokens, built for long-document summarization, large-scale financial report analysis, and legal contract review.",
        "zh-CN": "Qwen-Long 提供 100 万 token 极长上下文，面向长文档摘要、海量财报分析与法律合同审查。",
      },
      {
        en: "It reduces the need to chunk or pipeline very large corpora when fidelity across the full text matters in a single pass.",
        "zh-CN": "当需要在单次处理中保持全文保真时，可减少对超大规模语料的分块与流水线拆分。",
      },
      {
        en: "Qwen-Long shows that million-token understanding can be offered at practical deployment cost, supporting the view that relatively low-cost models can still achieve high performance on long-context workloads.",
        "zh-CN": "Qwen-Long 表明：百万级上下文理解可在务实部署成本下提供，进一步印证相对较低成本的模型同样能够在长上下文负载上达到高性能。",
      },
    ],
    useCases: [
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "translation", label: { en: "Translation", "zh-CN": "翻译任务" }, category: "text" },
    ],
  }),
  m({
    id: "ernie-5-1",
    company: "baidu",
    companyName: { en: "Baidu AI Cloud", "zh-CN": "百度智能云" },
    name: { en: "ERNIE 5.1", "zh-CN": "ERNIE 5.1" },
    tagline: {
      en: "May 2026 — elastic training, 1/3 compression, ~6% peer training cost, writing, search, agents",
      "zh-CN": "2026.05 最新版，弹性训练、参数压缩 1/3、训练成本约为同行 6%，创意写作、深度搜索、智能体",
    },
    logo: "/logos/deepseek.svg",
    knowledgeCutoff: { en: "May 2026", "zh-CN": "2026年5月" },
    description: [
      {
        en: "ERNIE 5.1 (May 2026) introduces an elastic training framework with parameter compression to one-third of prior scale and training cost at roughly 6% of peers, while strengthening creative writing, deep search, and agent tasks.",
        "zh-CN": "ERNIE 5.1（2026 年 5 月）采用弹性训练框架，参数压缩至约 1/3，训练成本约为同行的 6%，并强化创意写作、深度搜索与智能体任务能力。",
      },
      {
        en: "It targets content teams, research assistants, and agent workflows that need reliable retrieval, generation, and multi-step execution under controlled training economics.",
        "zh-CN": "面向需要可靠检索、生成与多步执行的内容团队、研究助手与智能体工作流，并在训练经济性上保持可控。",
      },
      {
        en: "ERNIE 5.1 demonstrates that frontier-style writing, search, and agent capability can be pursued at substantially lower training cost, supporting the view that relatively low-cost models can still achieve high performance.",
        "zh-CN": "ERNIE 5.1 表明：前沿级写作、搜索与智能体能力可在显著更低的训练成本下实现，进一步印证相对较低成本的模型同样能够达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
    ],
  }),
  m({
    id: "ernie-4-5-turbo",
    company: "baidu",
    companyName: { en: "Baidu AI Cloud", "zh-CN": "百度智能云" },
    name: { en: "ERNIE 4.5 / 4.0 Turbo", "zh-CN": "ERNIE 4.5 / 4.0 Turbo" },
    tagline: {
      en: "High performance, fast inference, multimodal (text-to-image & image understanding), 128K context",
      "zh-CN": "高性能、推理速度快，多模态（文生图/图片理解），128K 上下文",
    },
    logo: "/logos/deepseek.svg",
    contextWindow: { en: "128K tokens", "zh-CN": "128K tokens" },
    description: [
      {
        en: "ERNIE 4.5 / 4.0 Turbo delivers high performance with fast inference, multimodal capabilities including text-to-image and image understanding, and a 128K-token context window.",
        "zh-CN": "ERNIE 4.5 / 4.0 Turbo 具备高性能与较快推理速度，支持文生图与图片理解等多模态能力，并提供 128K 上下文。",
      },
      {
        en: "Typical uses include content creation and enterprise knowledge bases where text and visual inputs must be handled in one workflow.",
        "zh-CN": "适用于内容创作、企业知识库等需在同一工作流中处理文本与视觉输入的场景。",
      },
      {
        en: "The line shows that fast multimodal inference and long-context coverage can be delivered at practical deployment cost, reinforcing that relatively low-cost models can still achieve high performance.",
        "zh-CN": "该系列表明：快速多模态推理与长上下文覆盖可在务实部署成本下交付，进一步印证相对较低成本的模型同样能够达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "image-gen", label: { en: "Image Generation", "zh-CN": "图像生成" }, category: "image" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "ernie-x1",
    company: "baidu",
    companyName: { en: "Baidu AI Cloud", "zh-CN": "百度智能云" },
    name: { en: "ERNIE-X1", "zh-CN": "ERNIE-X1" },
    tagline: {
      en: "Deep-thinking model for complex reasoning and tool collaboration",
      "zh-CN": "深度思考模型，面向复杂推理与工具协同",
    },
    logo: "/logos/deepseek.svg",
    description: [
      {
        en: "ERNIE-X1 is Baidu's deep-thinking model oriented toward complex reasoning and tool collaboration, designed for workloads that require extended deliberation and coordinated use of external capabilities.",
        "zh-CN": "ERNIE-X1 是百度推出的深度思考模型，侧重复杂推理与工具协同，面向需要较长思考链条并配合外部能力完成任务的工作负载。",
      },
      {
        en: "It fits multi-step analysis, decision support, and agent-style flows where the model must reason deeply while invoking tools to retrieve information or execute actions.",
        "zh-CN": "适用于多步分析、决策辅助及智能体类流程——模型在深度推理的同时调用工具完成信息检索或动作执行。",
      },
      {
        en: "ERNIE-X1 shows that high-complexity reasoning and tool collaboration can be delivered at practical deployment cost, supporting the view that relatively low-cost models can still achieve high performance on demanding tasks.",
        "zh-CN": "ERNIE-X1 表明：高复杂度推理与工具协同可在可接受的部署成本下落地，进一步印证相对较低成本的模型同样能够在高难度任务上达到高性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
    ],
  }),
  m({
    id: "glm-4-7",
    company: "zhipu",
    companyName: { en: "Zhipu AI", "zh-CN": "智谱AI" },
    name: { en: "GLM-4.7", "zh-CN": "GLM-4.7" },
    tagline: {
      en: "Agentic Coding, long-horizon planning, tools, code, natural dialogue & immersive writing",
      "zh-CN": "Agentic Coding、长程规划、工具协同、代码生成、自然对话与沉浸式写作",
    },
    logo: "/logos/zhipu.svg",
    description: [
      {
        en: "GLM-4.7 emphasizes Agentic Coding, long-horizon task planning, and tool collaboration, alongside code generation, a natural conversational tone, and immersive writing.",
        "zh-CN": "GLM-4.7 强化 Agentic Coding、长程任务规划与工具协同能力，并覆盖代码生成、自然回复风格与沉浸式写作。",
      },
      {
        en: "It targets software engineering assistants, multi-stage project workflows, and content production where sustained planning and tool use must stay coherent across long sessions.",
        "zh-CN": "适用于软件工程助手、多阶段项目工作流，以及需要在长会话中保持规划与工具调用一致性的内容生产场景。",
      },
      {
        en: "GLM-4.7 illustrates that agent-grade coding and long-horizon planning can be achieved at practical cost, reinforcing that relatively low-cost models can deliver high performance on complex development and writing tasks.",
        "zh-CN": "GLM-4.7 表明：智能体级编程与长程规划可在务实成本下实现，进一步印证相对较低成本的模型同样能够在复杂开发与写作任务上达到高性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
    ],
  }),
  m({
    id: "glm-5",
    company: "zhipu",
    companyName: { en: "Zhipu AI", "zh-CN": "智谱AI" },
    name: { en: "GLM-5", "zh-CN": "GLM-5" },
    tagline: {
      en: "Iterative upgrade — general foundation capabilities and reasoning efficiency",
      "zh-CN": "迭代升级，通用基础能力与推理效率",
    },
    logo: "/logos/zhipu.svg",
    description: [
      {
        en: "GLM-5 is Zhipu AI's iterative upgrade to the GLM line, strengthening general foundation capabilities and improving reasoning efficiency across common dialogue and analysis workloads.",
        "zh-CN": "GLM-5 是智谱 GLM 体系的迭代升级版本，在通用基础能力与推理效率上进一步强化，覆盖日常对话与分析类负载。",
      },
      {
        en: "It serves as a balanced base model for enterprise assistants, knowledge Q&A, and mixed workloads where stable quality and efficient inference matter.",
        "zh-CN": "适用于企业助手、知识问答及混合负载等对稳定质量与高效推理均有要求的场景。",
      },
      {
        en: "GLM-5 demonstrates that upgraded general-purpose performance and reasoning efficiency can be offered at practical deployment cost, supporting the view that relatively low-cost models can still reach high performance on everyday complex tasks.",
        "zh-CN": "GLM-5 表明：通用能力与推理效率的升级可在务实部署成本下交付，进一步印证相对较低成本的模型同样能够在日常复杂任务上达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "translation", label: { en: "Translation", "zh-CN": "翻译任务" }, category: "text" },
    ],
  }),
  m({
    id: "glm-4v",
    company: "zhipu",
    companyName: { en: "Zhipu AI", "zh-CN": "智谱AI" },
    name: { en: "GLM-4V", "zh-CN": "GLM-4V" },
    tagline: {
      en: "Multimodal vision understanding and image analysis",
      "zh-CN": "多模态视觉理解、图像分析",
    },
    logo: "/logos/zhipu.svg",
    description: [
      {
        en: "GLM-4V extends the GLM family with multimodal vision understanding and image analysis, enabling models to interpret visual inputs alongside text instructions.",
        "zh-CN": "GLM-4V 在 GLM 体系上扩展多模态视觉理解与图像分析能力，可在文本指令之外解读视觉输入。",
      },
      {
        en: "Typical uses include chart and screenshot interpretation, visual Q&A, and workflows that combine documents with figures in one session.",
        "zh-CN": "适用于图表与截图解读、视觉问答，以及在同一轮交互中混合文档与图像的工作流。",
      },
      {
        en: "GLM-4V shows that strong multimodal vision analysis can be delivered at practical cost, supporting the view that relatively low-cost models can still achieve high performance on vision-heavy tasks.",
        "zh-CN": "GLM-4V 表明：多模态视觉分析可在务实成本下落地，进一步印证相对较低成本的模型同样能够在视觉密集型任务上达到高性能。",
      },
    ],
    useCases: [
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "image-gen", label: { en: "Image Generation", "zh-CN": "图像生成" }, category: "image" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
    ],
  }),
  m({
    id: "kimi-k2-6",
    company: "moonshot",
    companyName: { en: "Moonshot AI", "zh-CN": "月之暗面" },
    name: { en: "Kimi K2.6", "zh-CN": "Kimi K2.6" },
    tagline: {
      en: "Latest flagship — swarm mode, large-scale agent collaboration, multimodal, thinking & code",
      "zh-CN": "最新主力模型，蜂群模式、百级 Agent 协同、多模态、思考与代码",
    },
    logo: "/logos/kimi.svg",
    description: [
      {
        en: "Kimi K2.6 is Moonshot AI's latest flagship, featuring swarm mode and large-scale agent collaboration (on the order of hundreds of agents), together with multimodal understanding, thinking capabilities, and code writing.",
        "zh-CN": "Kimi K2.6 是月之暗面最新主力模型，支持蜂群模式与百级 Agent 协同，并具备多模态理解、思考能力与代码编写能力。",
      },
      {
        en: "It targets complex projects that require parallel sub-agents, multimodal inputs, and sustained coding or analysis across long workflows.",
        "zh-CN": "适用于需要并行子智能体、多模态输入，并在长工作流中持续完成编码或分析的复杂项目。",
      },
      {
        en: "Kimi K2.6 illustrates that flagship-level swarm collaboration and multimodal coding can be delivered at practical deployment cost, reinforcing that relatively low-cost models can still achieve high performance on large-scale agent workloads.",
        "zh-CN": "Kimi K2.6 表明：旗舰级蜂群协同与多模态编程可在务实部署成本下实现，进一步印证相对较低成本的模型同样能够在大规模智能体负载上达到高性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "kimi-k2-thinking",
    company: "moonshot",
    companyName: { en: "Moonshot AI", "zh-CN": "月之暗面" },
    name: { en: "Kimi K2 Thinking", "zh-CN": "Kimi K2 Thinking" },
    tagline: {
      en: "Chain-of-thought — think while using tools, complex reasoning & tool calls",
      "zh-CN": "思考链模型，边思考边用工具，复杂推理与工具调用",
    },
    logo: "/logos/kimi.svg",
    description: [
      {
        en: "Kimi K2 Thinking is a chain-of-thought model that reasons while invoking tools, supporting complex inference and tool calls with reduced need for human intervention during multi-step runs.",
        "zh-CN": "Kimi K2 Thinking 是思考链模型，可在推理过程中同步调用工具，支撑复杂推理与工具调用，并降低多步执行过程中的人工干预需求。",
      },
      {
        en: "It fits research assistants, automated analysis pipelines, and agent flows where thinking and tool use must alternate continuously until the task completes.",
        "zh-CN": "适用于研究助手、自动化分析流水线，以及思考与工具调用需交替进行直至任务完成的智能体流程。",
      },
      {
        en: "Kimi K2 Thinking shows that intertwined reasoning and tool use can be delivered at practical cost, supporting the view that relatively low-cost models can still achieve high performance on complex autonomous workflows.",
        "zh-CN": "Kimi K2 Thinking 表明：推理与工具调用的深度融合可在务实成本下落地，进一步印证相对较低成本的模型同样能够在复杂自主工作流上达到高性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
    ],
  }),
  m({
    id: "hunyuan-hy3-preview",
    company: "tencent",
    companyName: { en: "Tencent Hunyuan", "zh-CN": "腾讯混元" },
    name: { en: "Hy3 Preview", "zh-CN": "Hy3 Preview" },
    tagline: {
      en: "2026.04 refactor — fast/slow thinking, MoE 295B, coding agent, tools & faster code",
      "zh-CN": "2026.04 技术重构，快慢思考融合、MoE 2950 亿参数、编程智能体与工具调用",
    },
    logo: "/logos/qwen.svg",
    parameters: {
      en: "295B (MoE architecture)",
      "zh-CN": "2950 亿（MoE 架构）",
    },
    knowledgeCutoff: { en: "April 2026", "zh-CN": "2026年4月" },
    description: [
      {
        en: "Hy3 Preview is Tencent Hunyuan's technically refactored release (April 2026), combining fast and slow thinking in an MoE architecture at 295 billion parameters, with a coding agent, tool calling, and accelerated code generation.",
        "zh-CN": "Hy3 Preview 是腾讯混元 2026 年 4 月技术重构版本，融合快慢思考，采用 MoE 架构、参数量 2950 亿，并面向编程智能体、工具调用与代码生成加速。",
      },
      {
        en: "It targets software development assistants and automation where both deliberative reasoning and rapid tool-driven execution are required in one stack.",
        "zh-CN": "适用于需要在同一技术栈中兼顾审慎推理与快速工具执行的软件开发助手及自动化场景。",
      },
      {
        en: "Hy3 Preview illustrates that MoE-scale coding agents with fused thinking modes can be deployed at practical cost, reinforcing that relatively low-cost models can still deliver high performance on programming-intensive workloads.",
        "zh-CN": "Hy3 Preview 表明：融合思考模式的 MoE 级编程智能体可在务实成本下部署，进一步印证相对较低成本的模型同样能够在编程密集型负载上达到高性能。",
      },
    ],
    useCases: [
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "hunyuan-hy2",
    company: "tencent",
    companyName: { en: "Tencent Hunyuan", "zh-CN": "腾讯混元" },
    name: { en: "Hy2.0", "zh-CN": "Hy2.0" },
    tagline: {
      en: "Previous-generation general model — multimodal text-to-image/video & creative marketing",
      "zh-CN": "上一代通用模型，多模态文生图/视频与创意营销",
    },
    logo: "/logos/qwen.svg",
    description: [
      {
        en: "Hy2.0 is Tencent Hunyuan's previous-generation general model, offering multimodal capabilities including text-to-image and text-to-video generation for creative and marketing scenarios.",
        "zh-CN": "Hy2.0 是腾讯混元上一代通用模型，提供多模态能力，涵盖文生图、文生视频等，面向创意与营销场景。",
      },
      {
        en: "It suits brand campaigns, social content pipelines, and creative production where visual and video assets must be generated from textual briefs.",
        "zh-CN": "适用于品牌传播、社交内容流水线，以及需根据文本简报生成图像与视频素材的创意制作流程。",
      },
      {
        en: "Hy2.0 shows that general multimodal creative generation can remain accessible at practical deployment cost, supporting the view that relatively low-cost models can still achieve high performance on marketing and media workloads.",
        "zh-CN": "Hy2.0 表明：通用多模态创意生成可在务实部署成本下保持可用，进一步印证相对较低成本的模型同样能够在营销与媒体类负载上达到高性能。",
      },
    ],
    useCases: [
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "image-gen", label: { en: "Image Generation", "zh-CN": "图像生成" }, category: "image" },
      { id: "video-gen", label: { en: "Video Generation", "zh-CN": "视频生成" }, category: "video" },
    ],
  }),
  m({
    id: "doubao-seed-1-8",
    company: "bytedance",
    companyName: { en: "ByteDance", "zh-CN": "字节跳动" },
    name: { en: "Doubao-Seed-1.8", "zh-CN": "Doubao-Seed-1.8" },
    tagline: {
      en: "Latest flagship dialogue — knowledge, math logic & programming",
      "zh-CN": "最新旗舰对话模型，知识性、数学逻辑与编程能力",
    },
    logo: "/logos/doubao.svg",
    description: [
      {
        en: "Doubao-Seed-1.8 is ByteDance's latest flagship dialogue model, emphasizing knowledge coverage, mathematical logic, and programming capability.",
        "zh-CN": "Doubao-Seed-1.8 是字节跳动最新旗舰对话模型，侧重知识性、数学逻辑与编程能力。",
      },
      {
        en: "It fits general assistants, education and tutoring, and engineering chat where factual accuracy, structured reasoning, and code output must coexist in one model.",
        "zh-CN": "适用于通用助手、教育与辅导，以及需要事实准确性、结构化推理与代码输出并存的工程对话场景。",
      },
      {
        en: "Doubao-Seed-1.8 illustrates that flagship dialogue quality across knowledge, math, and code can be delivered at practical cost, reinforcing that relatively low-cost models can still achieve high performance on mixed cognitive workloads.",
        "zh-CN": "Doubao-Seed-1.8 表明：覆盖知识、数学与代码的旗舰对话能力可在务实成本下交付，进一步印证相对较低成本的模型同样能够在混合认知负载上达到高性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "coding", label: { en: "Code Programming", "zh-CN": "代码编程" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
    ],
  }),
  m({
    id: "doubao-seed-1-6",
    company: "bytedance",
    companyName: { en: "ByteDance", "zh-CN": "字节跳动" },
    name: { en: "Doubao-Seed-1.6", "zh-CN": "Doubao-Seed-1.6" },
    tagline: {
      en: "Thinking & Flash — stronger reasoning or low latency for diverse business scenarios",
      "zh-CN": "Thinking 思考版与 Flash 极速版，强推理 / 低延迟，适配多业务场景",
    },
    logo: "/logos/doubao.svg",
    description: [
      {
        en: "Doubao-Seed-1.6 offers two editions: Thinking prioritizes stronger reasoning, while Flash targets low latency—both adaptable to multiple business scenarios.",
        "zh-CN": "Doubao-Seed-1.6 提供两个版本：Thinking 思考版强化推理能力，Flash 极速版侧重低延迟响应，均可面向多业务场景适配。",
      },
      {
        en: "Thinking suits analytics, planning, and decision support where inference depth matters; Flash fits high-frequency customer service, real-time assistants, and latency-sensitive interactive products.",
        "zh-CN": "Thinking 适用于分析、规划与决策支持等看重推理深度的场景；Flash 适用于高频客服、实时助手及对响应时延敏感的交互类产品。",
      },
      {
        en: "Together, the 1.6 line shows that both reasoning depth and low-latency dialogue can be delivered at practical deployment cost, supporting the view that relatively low-cost models can still achieve high performance across diverse business workloads.",
        "zh-CN": "Seed 1.6 系列共同表明：强化推理与低延迟对话均可在务实部署成本下交付，进一步印证相对较低成本的模型同样能够在多样化业务负载上达到高性能。",
      },
    ],
    useCases: [
      { id: "reasoning", label: { en: "Logical Reasoning", "zh-CN": "逻辑推理" }, category: "text" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
      { id: "analysis", label: { en: "Data Analysis", "zh-CN": "数据分析" }, category: "text" },
    ],
  }),
  m({
    id: "seedream",
    company: "bytedance",
    companyName: { en: "ByteDance", "zh-CN": "字节跳动" },
    name: { en: "Doubao-Seedream 4.5", "zh-CN": "Doubao-Seedream 4.5" },
    tagline: {
      en: "Image generation — multi-round edit, reference-image edit & variants",
      "zh-CN": "图像生成，多轮编辑、参考图编辑与变体生成",
    },
    logo: "/logos/doubao.svg",
    description: [
      {
        en: "Doubao-Seedream 4.5 is an image generation model supporting multi-round editing, reference-image editing, and variant generation from existing visuals.",
        "zh-CN": "Doubao-Seedream 4.5 是图像生成模型，支持多轮编辑、参考图编辑，以及基于现有视觉素材的变体生成。",
      },
      {
        en: "It suits design iteration, e-commerce asset refinement, and creative pipelines where images are revised incrementally rather than regenerated from scratch each time.",
        "zh-CN": "适用于设计迭代、电商素材精修，以及以增量修订而非每次从零生成的创意流水线。",
      },
      {
        en: "Seedream 4.5 illustrates that advanced image editing and variant workflows can be delivered at practical cost, supporting the view that relatively low-cost models can still achieve high performance on visual production tasks.",
        "zh-CN": "Seedream 4.5 表明：高阶图像编辑与变体工作流可在务实成本下落地，进一步印证相对较低成本的模型同样能够在视觉制作任务上达到高性能。",
      },
    ],
    useCases: [
      { id: "image-gen", label: { en: "Image Generation", "zh-CN": "图像生成" }, category: "image" },
      { id: "writing", label: { en: "Content Writing", "zh-CN": "内容写作" }, category: "text" },
    ],
  }),
];

writeFileSync(
  join(root, "data", "models.json"),
  JSON.stringify({ models }, null, 2) + "\n",
  "utf8"
);

console.log("Wrote", models.length, "models");
