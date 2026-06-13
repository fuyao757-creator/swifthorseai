import type { Locale } from "@/lib/i18n";
import { detectScene, getScene, KEYWORD_ENRICHMENTS } from "./scenes";
import { generatePrompt } from "./prompt-format";
import type { CollectedAnswers, SceneId } from "./types";

export type OptimizeMode = "auto" | "clarity" | "structure" | "constraints" | "professional";

const MODE_HINTS: Record<Exclude<OptimizeMode, "auto">, { zh: string[]; en: string[] }> = {
  clarity: {
    zh: [
      "每个要求单独成句，避免「大概」「可能」「尽量」等模糊词",
      "关键术语在首次出现时简要定义",
      "若存在多种理解方式，按最常用场景执行并注明假设",
    ],
    en: [
      "One requirement per sentence; avoid vague words like “maybe” or “try to”",
      "Briefly define key terms on first use",
      "If ambiguous, pick the most common interpretation and state your assumption",
    ],
  },
  structure: {
    zh: [
      "严格按「角色 → 任务 → 核心信息 → 输出要求 → 具体问题」组织输出",
      "长内容使用小标题与编号列表，便于扫读",
      "先给出结论或答案，再展开细节",
    ],
    en: [
      "Follow Role → Task → Core Info → Output Requirements → Specific Questions",
      "Use subheadings and numbered lists for long content",
      "Lead with the conclusion or answer, then expand",
    ],
  },
  constraints: {
    zh: [
      "不编造未提供的事实、数据、链接或引用",
      "不确定时明确标注「需进一步确认」",
      "涉及隐私、合规、医疗、法律等内容时给出风险提示",
      "不执行超出能力范围或可能有害的操作",
    ],
    en: [
      "Do not fabricate facts, data, links, or citations",
      "Flag uncertainty with “needs verification”",
      "Add risk notes for privacy, compliance, medical, or legal topics",
      "Refuse harmful or out-of-scope actions",
    ],
  },
  professional: {
    zh: [
      "使用正式、准确的行业术语，避免口语化表达",
      "语气客观中立，适合职场汇报或对外交付",
      "数据与结论需区分「事实」与「推断」",
    ],
    en: [
      "Use formal, precise industry terminology",
      "Keep an objective tone suitable for workplace deliverables",
      "Separate stated facts from inferred conclusions",
    ],
  },
};

const SCENE_DETAIL_HINTS: Record<
  SceneId,
  { zh: (text: string) => string[]; en: (text: string) => string[] }
> = {
  customer_service: {
    zh: () => [
      "先识别客户情绪与诉求，再给出可执行的解决方案",
      "涉及退款、投诉、物流问题时，说明处理步骤与时限",
      "无法当场解决时，明确告知升级路径与预计响应时间",
    ],
    en: () => [
      "Identify emotion and intent before proposing a solution",
      "For refunds, complaints, or shipping, list steps and timelines",
      "If escalation is needed, explain the path and expected response time",
    ],
  },
  code: {
    zh: () => [
      "代码需可直接运行或易于集成，注明依赖版本",
      "覆盖常见边界情况（空值、异常输入、资源不存在等）",
      "附简要测试思路或示例用例",
    ],
    en: () => [
      "Code should run or integrate easily; note dependency versions",
      "Handle edge cases: nulls, bad input, missing resources",
      "Include brief test ideas or sample cases",
    ],
  },
  writing: {
    zh: () => [
      "开头抓住读者注意力，结尾可有明确的行动号召",
      "段落之间逻辑连贯，避免信息堆砌",
      "根据渠道（公众号/电商/邮件）调整篇幅与语气",
    ],
    en: () => [
      "Open with a strong hook; end with a clear call to action when appropriate",
      "Keep logical flow between paragraphs",
      "Adjust length and tone for the target channel",
    ],
  },
  translation: {
    zh: () => [
      "译文应自然流畅，而非逐词硬译",
      "专有名词首次出现时可保留原文并附简要说明",
      "文化差异处必要时加注译注",
    ],
    en: () => [
      "Produce natural target-language flow, not word-for-word translation",
      "Keep source terms on first mention with brief notes when helpful",
      "Add translator notes for cultural differences when needed",
    ],
  },
  analysis: {
    zh: () => [
      "先给结论摘要，再展开支撑数据与发现",
      "区分相关性观察与因果推断",
      "标注数据局限性与样本偏差风险",
    ],
    en: () => [
      "Start with an executive summary, then supporting findings",
      "Separate correlation from causation",
      "Note data limitations and sampling bias",
    ],
  },
  meeting: {
    zh: () => [
      "区分「已决议事项」与「待讨论事项」",
      "待办需包含负责人、截止时间、优先级",
      "保留关键原话或数据引用以便追溯",
    ],
    en: () => [
      "Separate decided items from open questions",
      "Action items need owner, deadline, and priority",
      "Keep key quotes or figures for traceability",
    ],
  },
  email: {
    zh: () => [
      "主题行简洁明确，正文一段只表达一个核心意思",
      "根据收件人关系调整称呼与敬语",
      "需要回复时明确截止时间与期望动作",
    ],
    en: () => [
      "Use a clear subject line; one main idea per paragraph",
      "Match greeting and sign-off to the relationship",
      "State deadline and expected action when a reply is needed",
    ],
  },
  resume: {
    zh: () => [
      "按岗位要求逐项对照评估，给出匹配度说明",
      "优势与风险点均需客观陈述并附依据",
      "建议 3–5 个有针对性的面试追问",
    ],
    en: () => [
      "Evaluate against each role requirement with fit rationale",
      "State pros and risks objectively with evidence",
      "Suggest 3–5 targeted interview questions",
    ],
  },
  tutoring: {
    zh: () => [
      "由浅入深，每步确认理解后再进入下一步",
      "用具体例子说明抽象概念",
      "鼓励学习者自行总结要点",
    ],
    en: () => [
      "Progress step by step; confirm understanding before advancing",
      "Use concrete examples for abstract ideas",
      "Encourage the learner to summarize key points",
    ],
  },
  brainstorm: {
    zh: () => [
      "每个方案说明亮点、适用条件与潜在风险",
      "区分「立即可行」与「需进一步验证」的想法",
      "最后给出推荐优先级及理由",
    ],
    en: () => [
      "For each idea, note strengths, conditions, and risks",
      "Separate immediately feasible vs. needs-validation ideas",
      "End with recommended priority and rationale",
    ],
  },
  general: {
    zh: () => [
      "充分理解用户意图后再执行任务",
      "输出可直接使用，减少用户二次编辑",
      "复杂任务分步骤完成并标注进度",
    ],
    en: () => [
      "Confirm user intent before executing",
      "Output should be ready to use with minimal editing",
      "Break complex tasks into steps with progress markers",
    ],
  },
};

const SCENE_EXAMPLES: Record<SceneId, { zh: string; en: string }> = {
  customer_service: {
    zh: "【输入示例】\n客户：我的订单 #12345 显示已发货但物流 3 天没更新，能帮忙查一下吗？",
    en: "[Sample input]\nCustomer: Order #12345 shows shipped but tracking hasn't updated in 3 days. Can you check?",
  },
  code: {
    zh: "【输入示例】\n```python\n# 用户提供的代码片段或需求描述\n数据文件：sales_2024.csv，列：date, product, amount\n```",
    en: "[Sample input]\n```python\n# User code snippet or requirement\nFile: sales_2024.csv — columns: date, product, amount\n```",
  },
  writing: {
    zh: "【输入示例】\n产品：无线蓝牙耳机 · 卖点：40h 续航、主动降噪 · 渠道：天猫详情页",
    en: "[Sample input]\nProduct: wireless earbuds · 40h battery, ANC · Channel: marketplace listing",
  },
  translation: {
    zh: "【输入示例】\n原文：The API returns a 429 status when rate limits are exceeded.",
    en: "[Sample input]\nSource: The API returns a 429 status when rate limits are exceeded.",
  },
  analysis: {
    zh: "【输入示例】\n数据：Q1–Q4 各区域销售额 CSV · 目标：找出增长最快区域及可能原因",
    en: "[Sample input]\nData: Q1–Q4 regional sales CSV · Goal: fastest-growing region and likely drivers",
  },
  meeting: {
    zh: "【输入示例】\n会议：产品评审 · 参与：产品、研发、设计 · 讨论：V2 功能优先级与上线时间",
    en: "[Sample input]\nMeeting: product review · Attendees: PM, eng, design · Topic: V2 scope and launch date",
  },
  email: {
    zh: "【输入示例】\n目的：跟进上周提案 · 收件人：合作方项目经理 · 语气：正式友好",
    en: "[Sample input]\nPurpose: follow up on last week's proposal · To: partner PM · Tone: formal, friendly",
  },
  resume: {
    zh: "【输入示例】\n岗位：前端工程师（React）· 要求：3 年经验、TypeScript · 候选人：5 年全栈，React 2 年",
    en: "[Sample input]\nRole: Frontend (React) · Requires: 3y+, TypeScript · Candidate: 5y full-stack, 2y React",
  },
  tutoring: {
    zh: "【输入示例】\n知识点：二次函数图像 · 学习者：高一学生 · 困惑：顶点公式怎么推导",
    en: "[Sample input]\nTopic: quadratic graphs · Learner: high-school · Question: how to derive the vertex formula",
  },
  brainstorm: {
    zh: "【输入示例】\n目标：提升 App 新用户 7 日留存 · 约束：预算有限、2 周内可上线 · 需 3 个方向",
    en: "[Sample input]\nGoal: improve 7-day retention · Constraints: low budget, ship in 2 weeks · Need 3 directions",
  },
  general: {
    zh: "【输入示例】\n（将您的典型输入粘贴于此，AI 将按此格式理解与回复）",
    en: "[Sample input]\n(Paste a typical input here so the AI learns your expected format)",
  },
};

function collectEnrichments(text: string, locale: Locale): string[] {
  const lower = text.toLowerCase();
  const out: string[] = [];
  for (const item of KEYWORD_ENRICHMENTS) {
    if (item.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      out.push(locale === "zh-CN" ? item.zh : item.en);
    }
  }
  return out;
}

function inferOutputFormat(text: string, sceneId: SceneId, mode: OptimizeMode, locale: Locale): string {
  const isZh = locale === "zh-CN";
  const scene = getScene(sceneId);
  const base = isZh ? scene.formatZh : scene.formatEn;
  const extras: string[] = [];

  if (/markdown|md/i.test(text)) extras.push(isZh ? "Markdown 排版" : "Markdown formatting");
  if (/json/i.test(text)) extras.push(isZh ? "严格 JSON，可被程序解析" : "Valid JSON for programmatic use");
  if (/表格|table/i.test(text)) extras.push(isZh ? "表格呈现对比数据" : "Use tables for comparisons");
  const charMatch = text.match(/(\d+)\s*字/);
  if (charMatch) extras.push(isZh ? `篇幅约 ${charMatch[1]} 字` : `Approx. ${charMatch[1]} characters`);
  if (/16:9|9:16|比例/.test(text)) extras.push(isZh ? "遵守指定输出比例/尺寸" : "Follow specified aspect ratio/size");

  if (mode === "clarity") extras.push(isZh ? "每段有小标题，列表项不超过一行" : "Subheadings; one line per bullet");
  if (mode === "professional") extras.push(isZh ? "正式文档格式，避免 emoji" : "Formal document style; no emoji");

  return [base, ...extras].map((p) => `• ${p}`).join("\n");
}

function buildDetails(
  text: string,
  sceneId: SceneId,
  mode: OptimizeMode,
  locale: Locale
): string {
  const isZh = locale === "zh-CN";
  const resolved = resolveOptimizeMode(mode);
  const sceneHints = SCENE_DETAIL_HINTS[sceneId][isZh ? "zh" : "en"](text);
  const enrichments = collectEnrichments(text, locale);
  const modeHints = MODE_HINTS[resolved][isZh ? "zh" : "en"];

  const bullets = [
    ...sceneHints,
    ...enrichments,
    ...modeHints,
    isZh
      ? "核心需求（来自用户原文）：" + text.slice(0, 200) + (text.length > 200 ? "…" : "")
      : "Core request (from user): " + text.slice(0, 200) + (text.length > 200 ? "…" : ""),
  ];

  return bullets.map((b) => `• ${b}`).join("\n");
}

export function resolveOptimizeMode(mode: OptimizeMode): Exclude<OptimizeMode, "auto"> {
  return mode === "auto" ? "structure" : mode;
}

export function optimizePrompt(
  raw: string,
  mode: OptimizeMode,
  locale: "zh-CN" | "en"
): string {
  const text = raw.trim();
  if (!text) return "";

  const loc = locale as Locale;
  const scene = detectScene(text);
  const answers: CollectedAnswers = {
    task: text,
    details: buildDetails(text, scene, mode, loc),
    constraints: inferOutputFormat(text, scene, mode, loc),
    example: SCENE_EXAMPLES[scene][locale === "zh-CN" ? "zh" : "en"],
  };

  const prompt = generatePrompt(scene, answers, loc);

  const isZh = locale === "zh-CN";
  const modeLabel = isZh
    ? { auto: "自动优化", clarity: "更清晰", structure: "结构化", constraints: "加约束", professional: "更专业" }[mode]
    : { auto: "Auto", clarity: "Clarity", structure: "Structure", constraints: "Constraints", professional: "Professional" }[mode];

  const header = isZh
    ? `# 优化后的提示词\n> 识别场景：${getScene(scene).labelZh} · 优化模式：${modeLabel}\n\n---\n\n`
    : `# Optimized Prompt\n> Detected: ${getScene(scene).labelEn} · Mode: ${modeLabel}\n\n---\n\n`;

  return header + prompt;
}
