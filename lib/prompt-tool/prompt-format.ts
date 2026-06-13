import type { Locale } from "@/lib/i18n";
import { getScene } from "./scenes";
import {
  COMBO_ROLE_OVERRIDES,
  collectEnrichments,
  extractSlots,
  fillTemplate,
  getTemplate,
  toBullets,
  type PromptTemplate,
} from "./templates";
import type { CollectedAnswers, SceneId } from "./types";

type TaskProfile = "app_education" | "app_general" | "default";

function detectTaskProfile(text: string): TaskProfile {
  if (/错题|考点|刷题|错题本|作业辅导|学习分析/i.test(text)) return "app_education";
  if (/App|应用|小程序|软件|系统|平台/i.test(text)) return "app_general";
  return "default";
}

function bracketOrValue(value: string | null | undefined, options: string): string {
  const v = value?.trim();
  return v ? v : `[${options}]`;
}

function pickGrade(text: string, isZh: boolean): string | null {
  const grades: [RegExp, string][] = isZh
    ? [
        [/小学|小学生/, "小学"],
        [/初中|中学生/, "初中"],
        [/高中|高中生/, "高中"],
        [/大学|大学生/, "大学生"],
        [/考研/, "考研党"],
      ]
    : [
        [/elementary|primary school/i, "elementary"],
        [/middle school|junior high/i, "middle school"],
        [/high school|senior/i, "high school"],
        [/college|university/i, "college"],
        [/graduate exam|postgrad/i, "grad exam prep"],
      ];
  for (const [re, val] of grades) {
    if (re.test(text)) return val;
  }
  return null;
}

function pickSubjects(text: string, isZh: boolean): string | null {
  const subjects = isZh
    ? ["数学", "英语", "物理", "化学", "语文", "生物", "历史", "地理"]
    : ["math", "English", "physics", "chemistry", "Chinese", "biology"];
  const found = subjects.filter((s) => text.toLowerCase().includes(s.toLowerCase()));
  if (found.length === 1) return found[0];
  if (found.length > 1) return found.join("、");
  if (/多科目|全科|通用/i.test(text)) return isZh ? "多科目通用" : "multi-subject";
  return null;
}

function pickInputMethod(text: string, isZh: boolean): string | null {
  const methods: [RegExp, string][] = isZh
    ? [
        [/拍照|OCR|识别/, "拍照识别"],
        [/手动输入|手输/, "手动输入"],
        [/导入图片|上传图片/, "导入图片"],
        [/语音/, "语音输入"],
      ]
    : [
        [/photo|OCR|camera/i, "photo OCR"],
        [/manual input|type in/i, "manual input"],
        [/import image|upload image/i, "image import"],
        [/voice|speech/i, "voice input"],
      ];
  for (const [re, val] of methods) {
    if (re.test(text)) return val;
  }
  return null;
}

interface CoreInfoField {
  labelZh: string;
  labelEn: string;
  placeholderZh: string;
  placeholderEn: string;
  extract: (
    text: string,
    answers: Partial<CollectedAnswers>,
    slots: Record<string, string>,
    isZh: boolean
  ) => string | null;
}

const APP_EDUCATION_FIELDS: CoreInfoField[] = [
  {
    labelZh: "App名称",
    labelEn: "App name",
    placeholderZh: "例如：智学错题本 / 考点狙击",
    placeholderEn: "e.g. Smart Mistake Book / Exam Snipe",
    extract: (text) => {
      const m = text.match(/(?:App|应用|软件|产品)名[称]?[：:\s]*[「"']?([^「"'\n，。]+)/i);
      if (m?.[1]) return m[1].trim();
      if (/智学错题本|考点狙击/.test(text)) return text.match(/智学错题本|考点狙击/)?.[0] ?? null;
      return null;
    },
  },
  {
    labelZh: "目标用户年级",
    labelEn: "Target grade level",
    placeholderZh: "小学 / 初中 / 高中 / 大学生 / 考研党",
    placeholderEn: "elementary / middle / high school / college / grad exam prep",
    extract: (text, _a, _s, isZh) => pickGrade(text, isZh),
  },
  {
    labelZh: "主要科目",
    labelEn: "Main subjects",
    placeholderZh: "数学 / 英语 / 物理 / 化学 / 多科目通用",
    placeholderEn: "math / English / physics / chemistry / multi-subject",
    extract: (text, _a, _s, isZh) => pickSubjects(text, isZh),
  },
  {
    labelZh: "题目录入方式",
    labelEn: "Question input method",
    placeholderZh: "拍照识别 / 手动输入 / 导入图片 / 语音输入",
    placeholderEn: "photo OCR / manual input / image import / voice input",
    extract: (text, _a, _s, isZh) => pickInputMethod(text, isZh),
  },
  {
    labelZh: "核心分析需求",
    labelEn: "Core analysis needs",
    placeholderZh: "例如：按知识点统计错误率 / 推荐同类题 / 分析薄弱考点",
    placeholderEn: "e.g. error rate by topic / similar-question recommendations / weak-area analysis",
    extract: (text, answers) => {
      if (/错误率|薄弱|同类题|知识点|考点|推荐/.test(text)) {
        const parts = toBullets(answers.details ?? answers.constraints ?? text).slice(0, 2);
        if (parts.length) return parts.join("；");
      }
      return null;
    },
  },
];

const APP_GENERAL_FIELDS: CoreInfoField[] = [
  {
    labelZh: "产品/应用名称",
    labelEn: "Product / app name",
    placeholderZh: "例如：XX 助手 / XX 管理平台",
    placeholderEn: "e.g. XX Assistant / XX Admin",
    extract: (text) =>
      text.match(/(?:App|应用|产品|软件)名[称]?[：:\s]*[「"']?([^「"'\n，。]+)/i)?.[1]?.trim() ?? null,
  },
  {
    labelZh: "目标用户",
    labelEn: "Target users",
    placeholderZh: "描述主要用户群体与使用场景",
    placeholderEn: "Describe primary users and usage context",
    extract: (_t, answers, slots, isZh) =>
      slots.受众 !== (isZh ? "目标读者" : "target audience") ? slots.受众 : answers.details?.slice(0, 60) ?? null,
  },
  {
    labelZh: "核心功能",
    labelEn: "Core features",
    placeholderZh: "列出 3–5 个核心功能点",
    placeholderEn: "List 3–5 core features",
    extract: (_t, answers) => answers.details?.slice(0, 100) ?? null,
  },
  {
    labelZh: "技术/平台约束",
    labelEn: "Tech / platform constraints",
    placeholderZh: "Web / iOS / Android / 小程序 / 本地部署",
    placeholderEn: "Web / iOS / Android / mini-program / on-prem",
    extract: (text, answers) => {
      const m = text.match(/(?:平台|技术栈|框架)[：:\s]*([^\n。]+)/i);
      if (m?.[1]) return m[1].trim();
      return answers.constraints?.slice(0, 80) ?? null;
    },
  },
  {
    labelZh: "交付目标",
    labelEn: "Delivery goal",
    placeholderZh: "需求分析 / 原型方案 / MVP 功能清单 / 技术实现路径",
    placeholderEn: "requirements / prototype / MVP scope / implementation path",
    extract: (text) =>
      /需求分析|实现方案|MVP|原型/.test(text)
        ? (text.match(/需求分析[^，。\n]*|实现方案[^，。\n]*|MVP[^，。\n]*/)?.[0] ?? null)
        : null,
  },
];

function sceneCoreFields(sceneId: SceneId): CoreInfoField[] {
  const map: Record<SceneId, CoreInfoField[]> = {
    customer_service: [
      {
        labelZh: "产品/服务",
        labelEn: "Product / service",
        placeholderZh: "例如：服装配饰电商 / SaaS 客服",
        placeholderEn: "e.g. fashion e-commerce / SaaS support",
        extract: (_t, _a, s, isZh) => (s.产品 !== (isZh ? "该产品/服务" : "the product/service") ? s.产品 : null),
      },
      {
        labelZh: "常见处理场景",
        labelEn: "Common scenarios",
        placeholderZh: "退款 / 物流 / 投诉 / 售前咨询",
        placeholderEn: "refunds / shipping / complaints / pre-sales",
        extract: (_t, _a, s) => s.场景列表,
      },
      {
        labelZh: "语气风格",
        labelEn: "Tone",
        placeholderZh: "亲切 / 正式 / 简洁",
        placeholderEn: "warm / formal / concise",
        extract: (_t, _a, s) => s.风格,
      },
      {
        labelZh: "语言要求",
        labelEn: "Language",
        placeholderZh: "中文 / 英文 / 中英双语",
        placeholderEn: "Chinese / English / bilingual",
        extract: (_t, _a, s) => s.语言偏好,
      },
    ],
    code: [
      {
        labelZh: "编程语言/框架",
        labelEn: "Language / framework",
        placeholderZh: "例如：Python 3.11 / React 18",
        placeholderEn: "e.g. Python 3.11 / React 18",
        extract: (_t, _a, s, isZh) =>
          s.语言 !== (isZh ? "指定编程语言" : "specified language") ? s.语言 : null,
      },
      {
        labelZh: "功能目标",
        labelEn: "Feature goal",
        placeholderZh: "描述要实现的功能",
        placeholderEn: "Describe the feature to build",
        extract: (_t, a) => a.task?.slice(0, 100) ?? null,
      },
      {
        labelZh: "运行环境",
        labelEn: "Runtime environment",
        placeholderZh: "本地脚本 / Web 服务 / API / 移动端",
        placeholderEn: "local script / web service / API / mobile",
        extract: (text) => text.match(/(?:环境|部署|平台)[：:\s]*([^\n。]+)/i)?.[1]?.trim() ?? null,
      },
      {
        labelZh: "代码风格",
        labelEn: "Code style",
        placeholderZh: "简洁 / 详细注释 / 类型注解 / 函数式",
        placeholderEn: "minimal / commented / typed / functional",
        extract: (text) =>
          /注释|类型注解|函数式/.test(text)
            ? (text.match(/(?:风格|要求)[：:\s]*([^\n。]+)/i)?.[1]?.trim() ?? null)
            : null,
      },
    ],
    writing: [
      {
        labelZh: "主题/产品",
        labelEn: "Topic / product",
        placeholderZh: "写作对象或主题",
        placeholderEn: "Subject or product",
        extract: (_t, a, s, isZh) =>
          a.task?.slice(0, 80) ?? (s.主题 !== (isZh ? "用户指定的主题" : "user-specified topic") ? s.主题 : null),
      },
      {
        labelZh: "目标受众",
        labelEn: "Target audience",
        placeholderZh: "例如：25–35 岁都市白领",
        placeholderEn: "e.g. urban professionals aged 25–35",
        extract: (_t, _a, s, isZh) =>
          s.受众 !== (isZh ? "目标读者" : "target audience") ? s.受众 : null,
      },
      {
        labelZh: "写作风格",
        labelEn: "Writing style",
        placeholderZh: "专业 / 轻松 / 种草 / 故事化",
        placeholderEn: "professional / casual / engaging / storytelling",
        extract: (_t, _a, s) => s.风格,
      },
      {
        labelZh: "篇幅要求",
        labelEn: "Length",
        placeholderZh: "例如：400 字 / 800 字",
        placeholderEn: "e.g. 400 / 800 words",
        extract: (_t, _a, s) => s.字数,
      },
      {
        labelZh: "发布渠道",
        labelEn: "Channel",
        placeholderZh: "公众号 / 电商详情页 / 邮件 / 短视频脚本",
        placeholderEn: "WeChat / marketplace / email / short video",
        extract: (text) => text.match(/(?:渠道|平台)[：:\s]*([^\n。]+)/i)?.[1]?.trim() ?? null,
      },
    ],
    translation: [
      {
        labelZh: "语言对",
        labelEn: "Language pair",
        placeholderZh: "中文 → 英文",
        placeholderEn: "Chinese → English",
        extract: (_t, _a, s) => `${s.源语言} → ${s.目标语言}`,
      },
      {
        labelZh: "文本类型",
        labelEn: "Text type",
        placeholderZh: "技术 / 营销 / 法律 / 日常",
        placeholderEn: "technical / marketing / legal / general",
        extract: (_t, _a, s, isZh) => (s.领域 !== (isZh ? "通用" : "general") ? s.领域 : null),
      },
      {
        labelZh: "术语要求",
        labelEn: "Terminology",
        placeholderZh: "保留术语对照 / 自然流畅即可",
        placeholderEn: "glossary required / natural flow",
        extract: (_t, _a, s) => s.术语要求,
      },
    ],
    analysis: [
      {
        labelZh: "数据来源",
        labelEn: "Data source",
        placeholderZh: "CSV / 数据库 / API / 用户上传",
        placeholderEn: "CSV / database / API / user upload",
        extract: (_t, _a, s, isZh) =>
          s.数据来源 !== (isZh ? "用户提供的数据" : "user-provided data") ? s.数据来源 : null,
      },
      {
        labelZh: "分析目标",
        labelEn: "Analysis goal",
        placeholderZh: "描述要回答的业务问题",
        placeholderEn: "Business question to answer",
        extract: (_t, a) => a.task?.slice(0, 100) ?? null,
      },
      {
        labelZh: "输出形式",
        labelEn: "Output format",
        placeholderZh: "摘要 + 图表 + 建议行动",
        placeholderEn: "summary + charts + recommendations",
        extract: (_t, _a, s) => s.输出格式,
      },
    ],
    meeting: [
      {
        labelZh: "会议主题",
        labelEn: "Meeting topic",
        placeholderZh: "会议名称或议题",
        placeholderEn: "Meeting title or agenda",
        extract: (_t, a) => a.task?.slice(0, 80) ?? null,
      },
      {
        labelZh: "重点关注",
        labelEn: "Focus areas",
        placeholderZh: "决议 / 待办 / 风险 / 数据",
        placeholderEn: "decisions / todos / risks / data",
        extract: (_t, _a, s, isZh) =>
          s.重点内容 !== (isZh ? "决策与待办" : "decisions and todos") ? s.重点内容 : null,
      },
    ],
    email: [
      {
        labelZh: "邮件目的",
        labelEn: "Email purpose",
        placeholderZh: "邀请 / 跟进 / 通知 / 道歉",
        placeholderEn: "invitation / follow-up / notice / apology",
        extract: (_t, _a, s, isZh) =>
          s.目的 !== (isZh ? "商务沟通" : "business communication") ? s.目的 : null,
      },
      {
        labelZh: "收件人关系",
        labelEn: "Recipient relationship",
        placeholderZh: "客户 / 同事 / 上级 / 合作方",
        placeholderEn: "client / colleague / manager / partner",
        extract: (_t, _a, s) => s.关系,
      },
      {
        labelZh: "语气风格",
        labelEn: "Tone",
        placeholderZh: "正式 / 友好 / 简洁",
        placeholderEn: "formal / friendly / concise",
        extract: (_t, _a, s) => s.风格,
      },
    ],
    resume: [
      {
        labelZh: "目标岗位",
        labelEn: "Target role",
        placeholderZh: "岗位名称与级别",
        placeholderEn: "Role title and level",
        extract: (_t, _a, s, isZh) =>
          s.岗位 !== (isZh ? "目标岗位" : "target role") ? s.岗位 : null,
      },
      {
        labelZh: "核心要求",
        labelEn: "Core requirements",
        placeholderZh: "列出岗位关键要求",
        placeholderEn: "List key role requirements",
        extract: (_t, _a, s, isZh) =>
          s.核心要求 !== (isZh ? "岗位核心要求" : "core requirements") ? s.核心要求 : null,
      },
    ],
    tutoring: [
      {
        labelZh: "学科/知识点",
        labelEn: "Subject / topic",
        placeholderZh: "例如：二次函数 / Python 基础",
        placeholderEn: "e.g. quadratic functions / Python basics",
        extract: (_t, a) => a.task?.slice(0, 80) ?? null,
      },
      {
        labelZh: "学习者水平",
        labelEn: "Learner level",
        placeholderZh: "初学者 / 中等 / 进阶",
        placeholderEn: "beginner / intermediate / advanced",
        extract: (_t, _a, s, isZh) => (s.水平 !== (isZh ? "中等" : "intermediate") ? s.水平 : null),
      },
      {
        labelZh: "讲解方式",
        labelEn: "Teaching approach",
        placeholderZh: "逐步讲解 / 举例 / 练习巩固",
        placeholderEn: "step-by-step / examples / practice",
        extract: (_t, _a, s) => s.讲解方式,
      },
    ],
    brainstorm: [
      {
        labelZh: "创意目标",
        labelEn: "Creative goal",
        placeholderZh: "要解决的问题或目标",
        placeholderEn: "Problem or goal to solve",
        extract: (_t, a) => a.task?.slice(0, 80) ?? null,
      },
      {
        labelZh: "约束条件",
        labelEn: "Constraints",
        placeholderZh: "预算 / 时间 / 受众 / 资源",
        placeholderEn: "budget / timeline / audience / resources",
        extract: (_t, _a, s, isZh) =>
          s.约束 !== (isZh ? "无特殊约束" : "no special constraints") ? s.约束 : null,
      },
    ],
    general: [
      {
        labelZh: "背景/场景",
        labelEn: "Background / context",
        placeholderZh: "描述使用背景与场景",
        placeholderEn: "Describe background and context",
        extract: (_t, a) => a.details?.slice(0, 80) ?? null,
      },
      {
        labelZh: "目标用户",
        labelEn: "Target users",
        placeholderZh: "谁会使用这份输出",
        placeholderEn: "Who will use this output",
        extract: (_t, _a, s, isZh) =>
          s.受众 !== (isZh ? "目标读者" : "target audience") ? s.受众 : null,
      },
      {
        labelZh: "核心诉求",
        labelEn: "Core request",
        placeholderZh: "最想达成的结果",
        placeholderEn: "Primary outcome desired",
        extract: (_t, a) => a.task?.slice(0, 100) ?? null,
      },
    ],
  };
  return map[sceneId];
}

const STANDARD_OUTPUT_REQ = {
  zh: [
    "分 5 个步骤输出，每个步骤标注进度（步骤 1/5 至步骤 5/5）",
    "每个要求单独成句，不使用「大概、可能、尽量」等模糊词",
    "首次出现的关键术语加粗并简要定义",
    "假设按最常用场景执行，并注明假设",
    "输出内容可直接用于后续提示词或开发文档",
  ],
  en: [
    "Deliver in 5 steps, each labeled with progress (Step 1/5 through Step 5/5)",
    "One requirement per sentence; avoid vague words like \"maybe\", \"possibly\", or \"try to\"",
    "Bold and briefly define key terms on first use",
    "Assume the most common scenario and state your assumption explicitly",
    "Output should be ready for reuse in follow-up prompts or development docs",
  ],
};

const SCENE_QUESTIONS: Record<SceneId, { zh: string[]; en: string[] }> = {
  customer_service: {
    zh: [
      "客服对话的标准处理流程是什么？",
      "常见咨询场景如何分类与应对？",
      "回复话术应包含哪些必备要素？",
      "升级人工的触发条件是什么？",
      "如何衡量回复质量与用户满意度？",
    ],
    en: [
      "What is the standard support conversation flow?",
      "How should common inquiry scenarios be categorized and handled?",
      "What elements must each reply include?",
      "When should cases be escalated to a human agent?",
      "How should reply quality and satisfaction be measured?",
    ],
  },
  code: {
    zh: [
      "整体技术方案与模块划分是什么？",
      "核心函数/类应如何设计？",
      "关键依赖与环境要求有哪些？",
      "需要覆盖哪些边界与异常情况？",
      "可先实现哪 3 个最小功能点？",
    ],
    en: [
      "What is the overall technical approach and module breakdown?",
      "How should core functions/classes be designed?",
      "What are the key dependencies and environment requirements?",
      "Which edge cases and failures must be handled?",
      "Which 3 minimal features should be built first?",
    ],
  },
  writing: {
    zh: [
      "内容结构应如何组织（标题、段落、要点）？",
      "开头如何抓住目标受众注意力？",
      "核心卖点或信息如何分层表达？",
      "语气与篇幅如何匹配发布渠道？",
      "结尾行动号召应如何设计？",
    ],
    en: [
      "How should content be structured (title, sections, key points)?",
      "How should the opening hook the target audience?",
      "How should key messages be layered?",
      "How should tone and length match the channel?",
      "How should the closing call-to-action be designed?",
    ],
  },
  translation: {
    zh: [
      "译文应如何处理专有名词与术语？",
      "文化差异处是否需要译注？",
      "语体风格如何与原文类型匹配？",
      "质量自检应关注哪些要点？",
      "术语对照表应包含哪些条目？",
    ],
    en: [
      "How should proper nouns and terminology be handled?",
      "Where are translator notes needed for cultural differences?",
      "How should register match the source text type?",
      "What should quality self-check focus on?",
      "Which entries belong in the terminology glossary?",
    ],
  },
  analysis: {
    zh: [
      "分析应回答哪些核心业务问题？",
      "数据清洗与探索步骤是什么？",
      "关键指标与可视化应如何呈现？",
      "结论与推断应如何区分？",
      "建议行动项应如何排序与落地？",
    ],
    en: [
      "Which core business questions should the analysis answer?",
      "What are the data cleaning and exploration steps?",
      "How should key metrics and visuals be presented?",
      "How should conclusions be separated from inferences?",
      "How should recommended actions be prioritized?",
    ],
  },
  meeting: {
    zh: [
      "会议纪要应包含哪些基本信息？",
      "讨论要点应如何归纳？",
      "决议与待办应如何区分记录？",
      "待办事项的负责人与截止时间如何标注？",
      "哪些内容需保留原话或数据引用？",
    ],
    en: [
      "What basic metadata should meeting minutes include?",
      "How should discussion points be summarized?",
      "How should decisions vs. open todos be recorded?",
      "How should owners and deadlines be assigned?",
      "What quotes or figures must be preserved?",
    ],
  },
  email: {
    zh: [
      "主题行应如何撰写才清晰有力？",
      "正文段落应如何组织逻辑？",
      "称呼与敬语如何匹配收件人关系？",
      "需要对方行动时应如何明确截止与期望？",
      "发送前应做哪些合规与语气检查？",
    ],
    en: [
      "How should the subject line be written clearly?",
      "How should body paragraphs be organized?",
      "How should greeting and sign-off match the relationship?",
      "How should deadlines and expected actions be stated?",
      "What compliance and tone checks are needed before sending?",
    ],
  },
  resume: {
    zh: [
      "候选人应如何对照岗位要求逐项评估？",
      "优势与风险点各有哪些依据？",
      "匹配度评分标准是什么？",
      "建议追问哪些面试问题？",
      "哪些信息需进一步核实？",
    ],
    en: [
      "How should the candidate be evaluated against each requirement?",
      "What evidence supports strengths and risks?",
      "What is the fit scoring criteria?",
      "Which interview questions should be asked?",
      "What information needs further verification?",
    ],
  },
  tutoring: {
    zh: [
      "核心概念应如何分步讲解？",
      "用什么例子最能帮助理解？",
      "如何确认学习者已掌握当前步骤？",
      "应布置什么练习巩固？",
      "常见误区应如何纠正？",
    ],
    en: [
      "How should core concepts be explained step by step?",
      "Which examples best aid understanding?",
      "How to confirm the learner grasps each step?",
      "What practice should reinforce learning?",
      "How should common misconceptions be corrected?",
    ],
  },
  brainstorm: {
    zh: [
      "问题应如何重述以明确边界？",
      "可发散出哪些创意方向？",
      "各方向的亮点与风险是什么？",
      "哪些想法立即可行、哪些需验证？",
      "推荐优先级及理由是什么？",
    ],
    en: [
      "How should the problem be restated with clear boundaries?",
      "Which creative directions can be explored?",
      "What are the pros and risks of each direction?",
      "Which ideas are immediately feasible vs. need validation?",
      "What is the recommended priority and why?",
    ],
  },
  general: {
    zh: [
      "任务的核心目标是什么？",
      "执行应分哪几个关键步骤？",
      "输出物应包含哪些必备要素？",
      "有哪些约束或边界需遵守？",
      "如何验证输出是否满足需求？",
    ],
    en: [
      "What is the core goal of this task?",
      "What are the key execution steps?",
      "What essential elements must the output include?",
      "What constraints or boundaries apply?",
      "How can the output be verified against requirements?",
    ],
  },
};

function hashSection(title: string, body: string): string {
  if (!body.trim()) return "";
  return `${title}\n${body.trim()}`;
}

function buildRoleSection(
  sceneId: SceneId,
  answers: Partial<CollectedAnswers>,
  slots: Record<string, string>,
  tpl: PromptTemplate,
  locale: Locale
): string {
  const isZh = locale === "zh-CN";
  const allText = Object.values(answers).filter(Boolean).join("\n");
  const profile = detectTaskProfile(allText);

  if (profile === "app_education") {
    return isZh
      ? "你是一位资深的教育产品经理兼 AI 应用开发顾问，擅长将学习场景需求转化为可执行的技术方案。"
      : "You are a senior education product manager and AI application consultant who turns learning-scenario needs into executable technical plans.";
  }
  if (profile === "app_general") {
    return isZh
      ? "你是一位资深产品经理兼技术方案顾问，擅长将产品需求拆解为可落地的功能与技术路径。"
      : "You are a senior product manager and technical advisor who breaks product requirements into actionable features and implementation paths.";
  }

  for (const combo of COMBO_ROLE_OVERRIDES) {
    if (combo.test(allText)) {
      return isZh ? combo.roleZh : combo.roleEn;
    }
  }

  const role = fillTemplate(isZh ? tpl.roleZh : tpl.roleEn, slots);
  const scene = getScene(sceneId);
  const expertise = isZh
    ? `擅长${scene.labelZh}场景下的专业交付，输出可直接用于生产环境。`
    : `Expert in ${scene.labelEn} deliverables ready for production use.`;
  return `${role}，${expertise}`;
}

function buildTaskSection(answers: Partial<CollectedAnswers>, sceneId: SceneId, locale: Locale): string {
  const isZh = locale === "zh-CN";
  const task = answers.task?.trim();
  if (task) return task;
  const scene = getScene(sceneId);
  return isZh ? `完成「${scene.labelZh}」相关任务。` : `Complete a ${scene.labelEn} task.`;
}

function buildCoreInfoSection(
  sceneId: SceneId,
  answers: Partial<CollectedAnswers>,
  slots: Record<string, string>,
  locale: Locale
): string {
  const isZh = locale === "zh-CN";
  const allText = Object.values(answers).filter(Boolean).join("\n");
  const profile = detectTaskProfile(allText);

  let fields: CoreInfoField[];
  if (profile === "app_education") fields = APP_EDUCATION_FIELDS;
  else if (profile === "app_general") fields = APP_GENERAL_FIELDS;
  else fields = sceneCoreFields(sceneId);

  const lines = fields.map((f) => {
    const label = isZh ? f.labelZh : f.labelEn;
    const placeholder = isZh ? f.placeholderZh : f.placeholderEn;
    const extracted = f.extract(allText, answers, slots, isZh);
    return `- ${label}：${bracketOrValue(extracted, placeholder)}`;
  });

  if (answers.example?.trim()) {
    lines.push(
      isZh
        ? `- 参考示例：${answers.example.trim()}`
        : `- Reference example: ${answers.example.trim()}`
    );
  }

  return lines.join("\n");
}

function buildOutputRequirements(
  answers: Partial<CollectedAnswers>,
  sceneId: SceneId,
  slots: Record<string, string>,
  tpl: PromptTemplate,
  locale: Locale
): string {
  const isZh = locale === "zh-CN";
  const base = [...STANDARD_OUTPUT_REQ[isZh ? "zh" : "en"]];
  const formatRule = fillTemplate(isZh ? tpl.formatZh : tpl.formatEn, slots);
  base.push(isZh ? `遵守输出格式：${formatRule}` : `Follow output format: ${formatRule}`);

  if (answers.constraints?.trim()) {
    toBullets(answers.constraints).forEach((b) => base.push(b));
  }

  collectEnrichments(Object.values(answers).filter(Boolean).join("\n"), locale).forEach((e) =>
    base.push(e)
  );

  return base.map((r) => `- ${r}`).join("\n");
}

function buildQuestionsSection(
  sceneId: SceneId,
  answers: Partial<CollectedAnswers>,
  locale: Locale
): string {
  const isZh = locale === "zh-CN";
  const allText = [answers.task, answers.details, answers.constraints].filter(Boolean).join("\n");
  const profile = detectTaskProfile(allText);

  let questions: string[];

  if (profile === "app_education" && /错题/.test(allText)) {
    questions = isZh
      ? [
          "这款 App 的核心功能模块有哪些？",
          "拍照识别错题的技术实现路径是什么？",
          "错题分析报告应包含哪些维度的数据？",
          "推荐同类题的算法逻辑是什么？",
          "最小可行产品（MVP）建议先做哪 3 个功能？",
        ]
      : [
          "What are the core feature modules of this app?",
          "What is the technical path for photo-based mistake capture?",
          "What data dimensions should the mistake analysis report include?",
          "What is the algorithm logic for recommending similar questions?",
          "Which 3 features should the MVP include first?",
        ];
  } else if (profile === "app_education" || profile === "app_general") {
    questions = isZh
      ? [
          "核心功能模块应如何划分？",
          "关键技术实现路径是什么？",
          "输出物/报告应包含哪些核心维度？",
          "核心算法或业务逻辑如何设计？",
          "MVP 建议优先实现哪 3 个功能？",
        ]
      : [
          "How should core feature modules be organized?",
          "What is the key technical implementation path?",
          "What core dimensions should deliverables/reports include?",
          "How should core algorithms or business logic be designed?",
          "Which 3 features should the MVP prioritize?",
        ];
  } else {
    questions = SCENE_QUESTIONS[sceneId][isZh ? "zh" : "en"];
  }

  return questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
}

export function generatePrompt(
  sceneId: SceneId,
  answers: Partial<CollectedAnswers>,
  locale: Locale
): string {
  const isZh = locale === "zh-CN";
  const tpl = getTemplate(sceneId);
  const slots = extractSlots(answers, locale);

  const parts = [
    hashSection(isZh ? "# 角色设定" : "# Role", buildRoleSection(sceneId, answers, slots, tpl, locale)),
    hashSection(isZh ? "# 任务" : "# Task", buildTaskSection(answers, sceneId, locale)),
    hashSection(
      isZh
        ? "# 核心信息（请根据实际情况替换 [ ] 中的内容）"
        : "# Core Information (replace bracketed items as needed)",
      buildCoreInfoSection(sceneId, answers, slots, locale)
    ),
    hashSection(
      isZh ? "# 输出要求" : "# Output Requirements",
      buildOutputRequirements(answers, sceneId, slots, tpl, locale)
    ),
    hashSection(
      isZh ? "# 你需要回答的具体问题（请逐条输出）" : "# Questions to Answer (respond to each item)",
      buildQuestionsSection(sceneId, answers, locale)
    ),
  ];

  return parts.filter(Boolean).join("\n\n");
}
