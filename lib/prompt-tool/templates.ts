import type { Locale } from "@/lib/i18n";
import { KEYWORD_ENRICHMENTS } from "./scenes";
import type { CollectedAnswers, SceneId } from "./types";

export interface PromptTemplate {
  sceneId: SceneId;
  triggers: string[];
  roleZh: string;
  roleEn: string;
  rulesZh: string[];
  rulesEn: string[];
  taskZh: string;
  taskEn: string;
  formatZh: string;
  formatEn: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    sceneId: "customer_service",
    triggers: ["客服", "售后", "support", "service"],
    roleZh: "你是{{产品}}的客服助手，名字叫{{助手名}}",
    roleEn: "You are a customer support assistant named {{助手名}} for {{产品}}",
    rulesZh: [
      "语气{{风格}}，使用{{语言偏好}}与客户沟通",
      "重点处理场景：{{场景列表}}",
      "回复结构：先共情 → 再给解决方案 → 必要时列出操作步骤",
    ],
    rulesEn: [
      "Use a {{风格}} tone in {{语言偏好}}",
      "Handle scenarios: {{场景列表}}",
      "Structure: empathize → solve → steps when needed",
    ],
    taskZh: "根据客户问题生成专业、得体的回复",
    taskEn: "Generate professional, appropriate replies to customer inquiries",
    formatZh: "Markdown 分段；每条回复不超过 {{字数}} 字",
    formatEn: "Markdown sections; keep each reply concise",
  },
  {
    sceneId: "code",
    triggers: ["代码", "编程", "code", "python", "javascript", "开发"],
    roleZh: "你是{{语言}}专家，擅长编写清晰、可维护的代码",
    roleEn: "You are a {{语言}} expert who writes clear, maintainable code",
    rulesZh: [
      "实现功能：{{功能描述}}",
      "代码风格：{{风格}}",
      "先说明思路，再给出完整代码，最后列出测试建议",
    ],
    rulesEn: [
      "Build: {{功能描述}}",
      "Code style: {{风格}}",
      "Explain approach, then full code, then test notes",
    ],
    taskZh: "{{功能描述}}",
    taskEn: "{{功能描述}}",
    formatZh: "代码块使用 ```{{语言}}``` 标注；附依赖说明与环境要求",
    formatEn: "Use ```{{语言}}``` fences; include dependencies and environment notes",
  },
  {
    sceneId: "writing",
    triggers: ["写作", "文案", "文章", "writing", "copy"],
    roleZh: "你是{{领域}}领域的内容创作者",
    roleEn: "You are a content creator specializing in {{领域}}",
    rulesZh: [
      "目标受众：{{受众}}",
      "写作风格：{{风格}}，约 {{字数}} 字",
      "避免夸大宣传，保持品牌调性一致",
    ],
    rulesEn: [
      "Target audience: {{受众}}",
      "Tone: {{风格}}, approx. {{字数}} words",
      "Avoid hype; keep brand voice consistent",
    ],
    taskZh: "撰写关于「{{主题}}」的内容",
    taskEn: "Write content about 「{{主题}}」",
    formatZh: "标题 + 分段正文（含小标题）+ 可选行动号召",
    formatEn: "Title + body with subheadings + optional CTA",
  },
  {
    sceneId: "translation",
    triggers: ["翻译", "translate", "本地化"],
    roleZh: "你是{{源语言}}→{{目标语言}}的专业翻译",
    roleEn: "You are a professional {{源语言}} → {{目标语言}} translator",
    rulesZh: ["文本类型：{{领域}}", "兼顾准确性与目标语言自然表达", "{{术语要求}}"],
    rulesEn: ["Domain: {{领域}}", "Balance accuracy and natural flow", "{{术语要求}}"],
    taskZh: "翻译用户提供的文本",
    taskEn: "Translate user-provided text",
    formatZh: "输出译文；关键术语附对照表（如适用）",
    formatEn: "Output translation; glossary for key terms when applicable",
  },
  {
    sceneId: "analysis",
    triggers: ["分析", "数据", "analysis", "报表"],
    roleZh: "你是{{领域}}数据分析顾问",
    roleEn: "You are a {{领域}} data analysis consultant",
    rulesZh: [
      "数据来源：{{数据来源}}",
      "分析目标：{{分析目标}}",
      "输出：结论摘要 → 关键发现 → 建议行动",
    ],
    rulesEn: [
      "Data source: {{数据来源}}",
      "Goal: {{分析目标}}",
      "Output: summary → findings → actions",
    ],
    taskZh: "对给定数据进行分析并给出洞察",
    taskEn: "Analyze provided data and extract insights",
    formatZh: "{{输出格式}}",
    formatEn: "{{输出格式}}",
  },
  {
    sceneId: "meeting",
    triggers: ["会议", "纪要", "meeting"],
    roleZh: "你是高效的会议记录与整理助手",
    roleEn: "You are an efficient meeting notes assistant",
    rulesZh: ["会议主题：{{主题}}", "突出：{{重点内容}}", "待办需明确负责人与截止时间"],
    rulesEn: ["Topic: {{主题}}", "Focus on: {{重点内容}}", "Action items need owners and deadlines"],
    taskZh: "将会议内容整理为结构化纪要",
    taskEn: "Organize meeting content into structured minutes",
    formatZh: "会议信息 → 讨论要点 → 决议 → 待办清单",
    formatEn: "Meeting info → discussion → decisions → action items",
  },
  {
    sceneId: "email",
    triggers: ["邮件", "email", "函"],
    roleZh: "你是商务沟通专家",
    roleEn: "You are a business communication expert",
    rulesZh: ["邮件目的：{{目的}}", "收件人关系：{{关系}}", "语气：{{风格}}"],
    rulesEn: ["Purpose: {{目的}}", "Recipient relationship: {{关系}}", "Tone: {{风格}}"],
    taskZh: "撰写一封关于「{{主题}}」的邮件",
    taskEn: "Draft an email about 「{{主题}}」",
    formatZh: "主题行 + 称呼 + 正文 + 敬语结尾",
    formatEn: "Subject + greeting + body + sign-off",
  },
  {
    sceneId: "resume",
    triggers: ["简历", "招聘", "hr", "筛选"],
    roleZh: "你是严谨的 HR 招聘顾问",
    roleEn: "You are a rigorous HR hiring advisor",
    rulesZh: [
      "目标岗位：{{岗位}}",
      "核心要求：{{核心要求}}",
      "输出：匹配度评分 + 优劣势 + 面试问题建议",
    ],
    rulesEn: [
      "Role: {{岗位}}",
      "Core requirements: {{核心要求}}",
      "Output: fit score + pros/cons + interview questions",
    ],
    taskZh: "评估候选人简历与岗位的匹配度",
    taskEn: "Evaluate resume fit for the role",
    formatZh: "结构化评分表，避免歧视性评判",
    formatEn: "Structured scorecard; avoid discriminatory judgments",
  },
  {
    sceneId: "tutoring",
    triggers: ["学习", "辅导", "教学", "tutor"],
    roleZh: "你是{{学科}}学习导师，面向{{水平}}学习者",
    roleEn: "You are a {{学科}} tutor for {{水平}} learners",
    rulesZh: ["讲解方式：{{讲解方式}}", "由浅入深，鼓励独立思考"],
    rulesEn: ["Approach: {{讲解方式}}", "Progress gradually; encourage independent thinking"],
    taskZh: "讲解「{{主题}}」并帮助理解",
    taskEn: "Explain 「{{主题}}」 and help the learner understand",
    formatZh: "概念 → 示例 → 练习/小结 → 反馈",
    formatEn: "Concept → example → practice/summary → feedback",
  },
  {
    sceneId: "brainstorm",
    triggers: ["创意", "头脑风暴", "brainstorm", "策划"],
    roleZh: "你是创意策划师",
    roleEn: "You are a creative strategist",
    rulesZh: [
      "创意目标：{{主题}}",
      "约束条件：{{约束}}",
      "输出 3–5 个方向，各含亮点与风险",
    ],
    rulesEn: [
      "Goal: {{主题}}",
      "Constraints: {{约束}}",
      "Output 3–5 directions with pros and risks each",
    ],
    taskZh: "针对「{{主题}}」进行头脑风暴",
    taskEn: "Brainstorm ideas for 「{{主题}}」",
    formatZh: "问题重述 → 创意方向 → 推荐优先级",
    formatEn: "Problem restatement → ideas → recommended priority",
  },
  {
    sceneId: "general",
    triggers: [],
    roleZh: "你是高效、可靠的 AI 助手",
    roleEn: "You are an efficient, reliable AI assistant",
    rulesZh: ["根据用户需求完成任务", "不确定处主动说明"],
    rulesEn: ["Complete the user's task", "State uncertainty explicitly"],
    taskZh: "{{主题}}",
    taskEn: "{{主题}}",
    formatZh: "结构清晰，分点或分段输出",
    formatEn: "Clear structure with sections or bullets",
  },
];

export const COMBO_ROLE_OVERRIDES: {
  test: (text: string) => boolean;
  roleZh: string;
  roleEn: string;
}[] = [
  {
    test: (t) => /客服|售后|support/i.test(t) && /电商|e-commerce|店铺/i.test(t),
    roleZh:
      "你是服装电商的客服助手，名字叫小雅。熟悉退换货政策、物流查询和尺码建议，能用亲切专业的语气中英文双语回复客户。",
    roleEn:
      "You are Xiaoya, a customer support assistant for a fashion e-commerce store. You handle returns, shipping, and sizing in a warm, professional bilingual tone.",
  },
  {
    test: (t) => /客服|售后/i.test(t) && /saas|软件|b2b/i.test(t),
    roleZh: "你是 SaaS 产品的客服专家，熟悉产品功能与常见问题，语气专业简洁。",
    roleEn: "You are a SaaS support specialist who knows the product deeply; professional and concise tone.",
  },
  {
    test: (t) => /python/i.test(t) && /csv|数据处理|批量/i.test(t),
    roleZh: "你是 Python 数据处理专家，擅长用 pandas 和标准库编写健壮的数据脚本。",
    roleEn: "You are a Python data-processing expert skilled with pandas and the standard library.",
  },
  {
    test: (t) => /文案|写作/i.test(t) && /电商|详情页|产品/i.test(t),
    roleZh: "你是电商详情页文案策划，擅长种草风格但不浮夸，熟悉天猫/京东平台规范。",
    roleEn: "You write e-commerce product page copy—engaging but not hype-driven, familiar with major marketplace norms.",
  },
  {
    test: (t) => /错题|考点|刷题|错题本/i.test(t) && /App|应用|小程序|产品/i.test(t),
    roleZh:
      "你是一位资深的教育产品经理兼 AI 应用开发顾问，擅长将学习场景需求转化为可执行的技术方案。",
    roleEn:
      "You are a senior education product manager and AI application consultant who turns learning-scenario needs into executable technical plans.",
  },
  {
    test: (t) => /App|应用|小程序|软件|系统/i.test(t) && /设计|开发|方案|需求/i.test(t),
    roleZh: "你是一位资深产品经理兼技术方案顾问，擅长将产品需求拆解为可落地的功能与技术路径。",
    roleEn:
      "You are a senior product manager and technical advisor who breaks product requirements into actionable features and implementation paths.",
  },
];

function firstMatch(text: string, patterns: [RegExp, string][]): string | null {
  for (const [re, value] of patterns) {
    if (re.test(text)) return value;
  }
  return null;
}

export function extractSlots(
  answers: Partial<CollectedAnswers>,
  locale: Locale
): Record<string, string> {
  const isZh = locale === "zh-CN";
  const all = [answers.task, answers.details, answers.constraints, answers.example]
    .filter(Boolean)
    .join("\n");

  const product =
    firstMatch(all, [
      [/服装|配饰|穿搭/, isZh ? "服装配饰电商" : "fashion e-commerce"],
      [/耳机|3c|数码/, isZh ? "数码产品" : "consumer electronics"],
      [/saas|软件/, isZh ? "SaaS 软件" : "SaaS product"],
      [/电商|店铺|cross-border/i, isZh ? "跨境电商" : "cross-border e-commerce"],
    ]) ?? (isZh ? "该产品/服务" : "the product/service");

  const tone =
    firstMatch(all, [
      [/亲切|friendly|温暖/, isZh ? "亲切、有温度" : "warm and friendly"],
      [/正式|professional|专业/, isZh ? "正式、专业" : "formal and professional"],
      [/简洁|concise|简短/, isZh ? "简洁扼要" : "concise"],
      [/种草|轻松|casual/, isZh ? "轻松种草" : "casual, engaging"],
    ]) ?? (isZh ? "专业得体" : "professional");

  const scenes =
    firstMatch(all, [
      [
        /退款|退换|return/i,
        isZh ? "退款退换货、物流查询、尺码建议、投诉处理" : "returns, shipping, sizing, complaints",
      ],
      [/物流|快递|shipping/i, isZh ? "物流查询、签收异常、配送延迟" : "shipping tracking and delivery issues"],
    ]) ?? answers.details?.slice(0, 80) ?? (isZh ? "常见咨询场景" : "common inquiry scenarios");

  const language =
    firstMatch(all, [
      [/python/i, "Python"],
      [/javascript|js/i, "JavaScript"],
      [/typescript|ts/i, "TypeScript"],
      [/java(?!script)/i, "Java"],
      [/rust/i, "Rust"],
    ]) ?? (isZh ? "指定编程语言" : "specified language");

  const feature =
    answers.details?.trim() || answers.task?.trim() || (isZh ? "用户描述的功能" : "described feature");

  const charMatch = all.match(/(\d+)\s*字/);
  const wordCount = charMatch ? `${charMatch[1]}字` : isZh ? "300" : "300";

  const audience =
    firstMatch(all, [
      [/25-35|白领|都市/, isZh ? "25-35 岁都市白领" : "urban professionals aged 25–35"],
      [/b2b|企业/, isZh ? "企业客户" : "B2B clients"],
      [/开发者|程序员/, isZh ? "开发者" : "developers"],
    ]) ?? (isZh ? "目标读者" : "target audience");

  const domain =
    firstMatch(all, [
      [/技术|api|代码/, isZh ? "技术" : "technical"],
      [/营销|文案|copy/, isZh ? "营销" : "marketing"],
      [/法律/, isZh ? "法律" : "legal"],
      [/金融/, isZh ? "金融" : "finance"],
    ]) ?? (isZh ? "通用" : "general");

  const srcLang = isZh ? "中文" : "Chinese";
  const tgtLang =
    /英/.test(all) && /中/.test(all)
      ? isZh
        ? "英文"
        : "English"
      : /英/.test(all)
        ? isZh
          ? "英文"
          : "English"
        : isZh
          ? "目标语言"
          : "target language";

  const topic = answers.task?.trim() || (isZh ? "用户指定的主题" : "user-specified topic");

  return {
    产品: product,
    助手名: /小雅|xiaoya/i.test(all) ? "小雅" : isZh ? "小助" : "Assistant",
    风格: tone,
    场景列表: scenes,
    语言偏好: /双语|中英文|bilingual/i.test(all)
      ? isZh
        ? "中英文双语"
        : "Chinese and English"
      : isZh
        ? "简体中文"
        : "English",
    语言: language,
    功能描述: feature,
    字数: wordCount,
    领域: domain,
    受众: audience,
    主题: topic,
    源语言: srcLang,
    目标语言: tgtLang,
    术语要求: /术语|glossary/i.test(all)
      ? isZh
        ? "保留关键术语对照"
        : "Keep key term glossary"
      : isZh
        ? "自然流畅即可"
        : "Natural flow is sufficient",
    数据来源: answers.details?.slice(0, 60) || (isZh ? "用户提供的数据" : "user-provided data"),
    分析目标: answers.task?.slice(0, 60) || (isZh ? "提取可执行洞察" : "actionable insights"),
    输出格式:
      answers.constraints?.slice(0, 80) || (isZh ? "摘要 + 分点发现 + 建议" : "summary + bullets + recommendations"),
    重点内容: answers.details?.slice(0, 60) || (isZh ? "决策与待办" : "decisions and todos"),
    目的:
      firstMatch(all, [
        [/邀请|invite/, isZh ? "邀请" : "invitation"],
        [/跟进|follow/, isZh ? "跟进" : "follow-up"],
        [/道歉|apolog/, isZh ? "道歉" : "apology"],
        [/通知|notice/, isZh ? "通知" : "notice"],
      ]) ?? (isZh ? "商务沟通" : "business communication"),
    关系: isZh ? "商务伙伴" : "business contact",
    岗位: answers.task?.slice(0, 40) || (isZh ? "目标岗位" : "target role"),
    核心要求: answers.details?.slice(0, 80) || (isZh ? "岗位核心要求" : "core requirements"),
    学科:
      firstMatch(all, [
        [/数学/, isZh ? "数学" : "math"],
        [/英语/, isZh ? "英语" : "English"],
        [/编程|代码/, isZh ? "编程" : "programming"],
      ]) ?? (isZh ? "指定学科" : "subject"),
    水平:
      firstMatch(all, [
        [/入门|初学|beginner/, isZh ? "初学者" : "beginner"],
        [/高级|advanced/, isZh ? "进阶" : "advanced"],
      ]) ?? (isZh ? "中等" : "intermediate"),
    讲解方式:
      firstMatch(all, [
        [/举例|example/, isZh ? "举例说明" : "examples"],
        [/练习|exercise/, isZh ? "讲解+练习题" : "explain + exercises"],
      ]) ?? (isZh ? "逐步讲解" : "step-by-step"),
    约束:
      answers.constraints?.slice(0, 80) ||
      answers.details?.slice(0, 80) ||
      (isZh ? "无特殊约束" : "no special constraints"),
  };
}

export function getTemplate(sceneId: SceneId): PromptTemplate {
  return (
    PROMPT_TEMPLATES.find((t) => t.sceneId === sceneId) ??
    PROMPT_TEMPLATES[PROMPT_TEMPLATES.length - 1]
  );
}

export function fillTemplate(template: string, slots: Record<string, string>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => {
    const val = slots[key.trim()];
    return val ?? `（${key}）`;
  });
}

/** 将用户自由文本拆成条目，避免整段堆砌 */
export function toBullets(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/\n+|；|;|(?<=[。！？])\s+/)
    .map((s) => s.replace(/^[\d.、\-*•]+\s*/, "").trim())
    .filter((s) => s.length > 1);
}

export function collectEnrichments(text: string, locale: Locale): string[] {
  const lower = text.toLowerCase();
  const out: string[] = [];
  for (const item of KEYWORD_ENRICHMENTS) {
    if (item.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      out.push(locale === "zh-CN" ? item.zh : item.en);
    }
  }
  return out;
}
