import type { SceneId } from "./types";

export interface SceneConfig {
  id: SceneId;
  labelZh: string;
  labelEn: string;
  keywords: string[];
  roleZh: string;
  roleEn: string;
  round2Zh: string;
  round2En: string;
  formatZh: string;
  formatEn: string;
  notesZh: string[];
  notesEn: string[];
}

export const SCENES: SceneConfig[] = [
  {
    id: "customer_service",
    labelZh: "客服回复生成",
    labelEn: "Customer support replies",
    keywords: ["客服", "售后", "咨询", "回复", "support", "service", "电商", "店铺"],
    roleZh: "你是一位专业、耐心且熟悉业务的客服代表",
    roleEn: "You are a professional, patient customer support representative with strong product knowledge",
    round2Zh:
      "了解！请补充：① 产品/行业类型 ② 常见处理场景（退款、物流、投诉等）③ 期望语气（亲切/正式/简洁）",
    round2En:
      "Got it. Please share: ① product/industry type ② common scenarios (refunds, shipping, complaints) ③ tone (friendly/formal/concise)",
    formatZh: "分段回复，先共情再给出解决方案，必要时列出操作步骤",
    formatEn: "Structured reply: empathize first, then solution, with steps when needed",
    notesZh: ["不承诺无法兑现的政策", "敏感问题转人工", "避免泄露用户隐私"],
    notesEn: ["Do not promise unavailable policies", "Escalate sensitive issues", "Protect user privacy"],
  },
  {
    id: "code",
    labelZh: "代码生成/解释",
    labelEn: "Code generation & explanation",
    keywords: ["代码", "编程", "程序", "python", "javascript", "java", "bug", "code", "开发", "api"],
    roleZh: "你是一位资深软件工程师，擅长编写清晰、可维护的代码",
    roleEn: "You are a senior software engineer who writes clear, maintainable code",
    round2Zh: "请说明：① 编程语言/框架 ② 要实现的功能 ③ 代码风格偏好（简洁/注释详细/函数式等）",
    round2En: "Please specify: ① language/framework ② feature to build ③ style preference (minimal/commented/functional, etc.)",
    formatZh: "先简要说明思路，再给出完整代码块，最后列出关键说明与测试建议",
    formatEn: "Brief approach, full code block, then key notes and test suggestions",
    notesZh: ["标注潜在边界情况", "不执行危险系统命令", "说明依赖与环境要求"],
    notesEn: ["Call out edge cases", "No dangerous system commands", "Note dependencies and environment"],
  },
  {
    id: "writing",
    labelZh: "内容写作",
    labelEn: "Content writing",
    keywords: ["写作", "文案", "文章", "脚本", "内容", "营销", "copy", "writing", "blog", "标题"],
    roleZh: "你是一位经验丰富的内容创作者与文案策划",
    roleEn: "You are an experienced content creator and copywriter",
    round2Zh: "请补充：① 主题/产品 ② 目标受众 ③ 风格（专业/轻松/种草/故事化）④ 大致字数",
    round2En: "Please add: ① topic/product ② audience ③ tone ④ approximate length",
    formatZh: "标题 + 正文分段，段落有小标题，结尾可有行动号召",
    formatEn: "Title + body with subheadings; optional CTA at the end",
    notesZh: ["避免夸大宣传", "保持品牌调性一致", "不抄袭他人内容"],
    notesEn: ["Avoid exaggerated claims", "Keep brand voice consistent", "No plagiarism"],
  },
  {
    id: "translation",
    labelZh: "翻译",
    labelEn: "Translation",
    keywords: ["翻译", "译", "translate", "translation", "双语", "本地化", "localization"],
    roleZh: "你是一位专业翻译，兼顾准确性与目标语言自然表达",
    roleEn: "You are a professional translator balancing accuracy and natural target-language flow",
    round2Zh: "请说明：① 源语言 → 目标语言 ② 文本类型（技术/营销/法律/日常）③ 是否需要保留术语对照",
    round2En: "Please specify: ① source → target language ② domain (tech/marketing/legal/general) ③ glossary needed?",
    formatZh: "输出译文；如有术语表则附关键术语对照",
    formatEn: "Output translation; attach key term glossary if applicable",
    notesZh: ["文化差异处加注说明", "不擅自增删原意", "敏感内容保持中性"],
    notesEn: ["Note cultural adaptations", "Do not alter meaning", "Neutral tone for sensitive content"],
  },
  {
    id: "analysis",
    labelZh: "数据分析",
    labelEn: "Data analysis",
    keywords: ["分析", "数据", "报表", "统计", "analysis", "analytics", "dashboard", "指标"],
    roleZh: "你是一位数据分析顾问，擅长从数据中提取可执行洞察",
    roleEn: "You are a data analysis consultant who extracts actionable insights",
    round2Zh: "请描述：① 数据类型/来源 ② 分析目标（趋势/对比/异常/预测）③ 期望输出（摘要/表格/图表描述）",
    round2En: "Describe: ① data type/source ② goal (trend/compare/anomaly/forecast) ③ output format",
    formatZh: "结论摘要 → 关键发现（分点）→ 建议行动 → 可选数据表格",
    formatEn: "Executive summary → key findings → recommended actions → optional table",
    notesZh: ["标注数据局限性", "区分相关与因果", "不捏造未提供的数据"],
    notesEn: ["Note data limitations", "Separate correlation from causation", "Never invent data"],
  },
  {
    id: "meeting",
    labelZh: "会议纪要",
    labelEn: "Meeting minutes",
    keywords: ["会议", "纪要", "meeting", "minutes", "议程", "讨论"],
    roleZh: "你是一位高效的会议记录与整理助手",
    roleEn: "You are an efficient meeting notes and summary assistant",
    round2Zh: "请补充：① 会议类型/主题 ② 参与角色 ③ 需要突出的内容（决策/待办/风险）",
    round2En: "Add: ① meeting type/topic ② participants/roles ③ focus (decisions/todos/risks)",
    formatZh: "会议信息 → 讨论要点 → 决议事项 → 待办（负责人+截止时间）",
    formatEn: "Meeting info → discussion points → decisions → action items (owner + deadline)",
    notesZh: ["区分事实与推测", "待办需明确负责人", "敏感信息脱敏"],
    notesEn: ["Separate facts from assumptions", "Clear owners on todos", "Redact sensitive info"],
  },
  {
    id: "email",
    labelZh: "邮件撰写",
    labelEn: "Email drafting",
    keywords: ["邮件", "email", "信", "函", "outreach", "跟进"],
    roleZh: "你是一位商务沟通专家，擅长撰写得体的专业邮件",
    roleEn: "You are a business communication expert skilled at professional emails",
    round2Zh: "请说明：① 邮件目的（邀请/跟进/道歉/通知）② 收件人关系 ③ 语气（正式/友好/紧迫）",
    round2En: "Specify: ① purpose (invite/follow-up/apology/notice) ② recipient relationship ③ tone",
    formatZh: "主题行 + 称呼 + 正文 + 结尾敬语 + 可选附言",
    formatEn: "Subject line + greeting + body + sign-off + optional P.S.",
    notesZh: ["主题简洁明确", "避免歧义与攻击性措辞", "敏感承诺需审慎"],
    notesEn: ["Clear subject line", "Avoid ambiguous or hostile wording", "Be careful with commitments"],
  },
  {
    id: "resume",
    labelZh: "简历筛选",
    labelEn: "Resume screening",
    keywords: ["简历", "招聘", "hr", "筛选", "面试", "resume", "cv", "candidate"],
    roleZh: "你是一位严谨的 HR 招聘顾问，擅长结构化评估候选人",
    roleEn: "You are a rigorous HR advisor skilled at structured candidate evaluation",
    round2Zh: "请提供：① 岗位名称与核心要求 ② 优先/加分项 ③ 输出形式（评分表/优劣势/面试问题）",
    round2En: "Provide: ① role and core requirements ② nice-to-haves ③ output (scorecard/pros-cons/questions)",
    formatZh: "匹配度评分 → 优势 → 风险点 → 建议面试问题",
    formatEn: "Fit score → strengths → risks → suggested interview questions",
    notesZh: ["避免歧视性评判", "基于岗位需求客观评估", "不泄露候选人隐私"],
    notesEn: ["Avoid discriminatory judgments", "Evaluate against role requirements", "Protect candidate privacy"],
  },
  {
    id: "tutoring",
    labelZh: "学习辅导",
    labelEn: "Learning & tutoring",
    keywords: ["学习", "辅导", "教学", "讲解", "题目", "tutor", "study", "考试", "课程"],
    roleZh: "你是一位耐心且善于启发的学习导师",
    roleEn: "You are a patient tutor who guides learners with clear explanations",
    round2Zh: "请说明：① 学科/知识点 ② 学习者水平 ③ 期望方式（逐步讲解/举例/练习题）",
    round2En: "Share: ① subject/topic ② learner level ③ approach (step-by-step/examples/exercises)",
    formatZh: "概念解释 → 示例 → 练习或小结 → 鼓励性反馈",
    formatEn: "Concept explanation → example → practice or summary → encouraging feedback",
    notesZh: ["由浅入深", "鼓励独立思考", "不确定时说明需核实"],
    notesEn: ["Progress from simple to complex", "Encourage independent thinking", "Flag uncertain claims"],
  },
  {
    id: "brainstorm",
    labelZh: "创意头脑风暴",
    labelEn: "Creative brainstorming",
    keywords: ["创意", "头脑风暴", "brainstorm", "idea", "策划", "灵感", "方案"],
    roleZh: "你是一位创意策划师，擅长发散思维与结构化归纳",
    roleEn: "You are a creative strategist skilled at divergent thinking and structured synthesis",
    round2Zh: "请补充：① 创意目标/问题 ② 约束（预算/时间/受众）③ 需要多少方案/方向",
    round2En: "Add: ① creative goal/problem ② constraints (budget/time/audience) ③ number of directions",
    formatZh: "问题重述 → 3–5 个创意方向（各含亮点与风险）→ 推荐优先级",
    formatEn: "Problem restatement → 3–5 ideas (pros/risks each) → recommended priority",
    notesZh: ["区分可行与实验性想法", "标注假设条件", "避免侵权与抄袭"],
    notesEn: ["Separate feasible vs experimental ideas", "State assumptions", "Avoid IP infringement"],
  },
  {
    id: "general",
    labelZh: "通用任务",
    labelEn: "General task",
    keywords: [],
    roleZh: "你是一位高效、可靠的 AI 助手",
    roleEn: "You are an efficient, reliable AI assistant",
    round2Zh: "请补充更多细节：背景、目标用户、使用场景，以及你期望的输出风格。",
    round2En: "Please add background, target users, context, and your preferred output style.",
    formatZh: "结构清晰、分点或分段输出，便于直接使用",
    formatEn: "Clear structure with sections or bullet points, ready to use",
    notesZh: ["不确定处主动说明", "不编造事实", "遵守安全与合规边界"],
    notesEn: ["State uncertainty explicitly", "Do not fabricate facts", "Respect safety and compliance"],
  },
];

export function detectScene(text: string): SceneId {
  const lower = text.toLowerCase();
  let best: SceneId = "general";
  let bestScore = 0;

  for (const scene of SCENES) {
    if (scene.id === "general") continue;
    let score = 0;
    for (const kw of scene.keywords) {
      if (lower.includes(kw.toLowerCase())) score += kw.length > 2 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = scene.id;
    }
  }
  return best;
}

export function getScene(id: SceneId): SceneConfig {
  return SCENES.find((s) => s.id === id) ?? SCENES[SCENES.length - 1];
}

export const KEYWORD_ENRICHMENTS: { keywords: string[]; zh: string; en: string }[] = [
  { keywords: ["电商", "e-commerce", "ecommerce"], zh: "熟悉电商平台规则与用户购物心理", en: "Understand e-commerce platform rules and shopper psychology" },
  { keywords: ["亲切", "friendly", "温暖"], zh: "语气亲切、有温度，适当使用口语化表达", en: "Use a warm, friendly tone with approachable wording" },
  { keywords: ["正式", "formal", "专业"], zh: "保持正式、专业的商务语气", en: "Maintain a formal, professional business tone" },
  { keywords: ["简洁", "concise", "简短"], zh: "回答简洁扼要，避免冗余", en: "Keep responses concise without redundancy" },
  { keywords: ["python"], zh: "遵循 PEP 8 风格，优先使用标准库", en: "Follow PEP 8; prefer standard library when possible" },
  { keywords: ["javascript", "typescript", "js", "ts"], zh: "使用现代 ES 语法，注意类型安全（如适用）", en: "Use modern ES syntax; mind type safety where applicable" },
  { keywords: ["json"], zh: "输出严格符合 JSON 格式，可被程序解析", en: "Output valid JSON parseable by programs" },
  { keywords: ["markdown", "md"], zh: "使用 Markdown 格式排版", en: "Format output in Markdown" },
  { keywords: ["表格"], zh: "使用表格呈现对比或结构化数据", en: "Present comparisons or structured data in tables" },
  { keywords: ["英文", "english"], zh: "主要使用英文输出", en: "Output primarily in English" },
  { keywords: ["中文", "chinese"], zh: "主要使用简体中文输出", en: "Output primarily in Simplified Chinese" },
  { keywords: ["敏感", "合规", "隐私"], zh: "对敏感内容谨慎处理，必要时提示合规风险", en: "Handle sensitive content carefully; flag compliance risks" },
];
