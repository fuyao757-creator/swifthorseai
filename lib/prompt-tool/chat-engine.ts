import type { Locale } from "@/lib/i18n";
import {
  detectScene,
  getScene,
  type SceneConfig,
} from "./scenes";
import { generatePrompt } from "./prompt-format";
import type {
  ChatMessage,
  ChatRound,
  ChatSession,
  CollectedAnswers,
  QuickScenario,
  SceneId,
} from "./types";

export const STORAGE_SESSION = "swift-horse-prompt-chat-session";
export const STORAGE_HISTORY = "swift-horse-prompt-history";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createInitialSession(locale: Locale): ChatSession {
  const isZh = locale === "zh-CN";
  return {
    round: 1,
    scene: "general",
    answers: {},
    completed: false,
    messages: [
      {
        id: uid(),
        role: "assistant",
        content: isZh
          ? "我来帮你生成提示词。先说说你想用 AI 做什么？（例如：写周报、客服回复、代码生成…）"
          : "I'll help you build a prompt. What do you want to use AI for? (e.g. weekly reports, support replies, code generation…)",
      },
    ],
  };
}

export function getRound3Question(locale: Locale): string {
  return locale === "zh-CN"
    ? "有没有特别要求？比如输出格式、注意事项、敏感内容处理？"
    : "Any special requirements? Output format, cautions, or sensitive-content handling?";
}

export function getRound4Question(locale: Locale): string {
  return locale === "zh-CN"
    ? "可以给一个输入示例吗？我来根据你的示例优化提示词。"
    : "Can you share a sample input? I'll refine the prompt around it.";
}

export function getRound5Intro(locale: Locale): string {
  return locale === "zh-CN"
    ? "好的！根据你的回答，我生成了以下提示词，你可以直接复制使用。"
    : "Done! Based on your answers, here is a prompt you can copy and use.";
}

export function getRound2Question(scene: SceneConfig, locale: Locale): string {
  return locale === "zh-CN" ? scene.round2Zh : scene.round2En;
}

export function processUserMessage(
  session: ChatSession,
  userText: string,
  locale: Locale
): ChatSession {
  const trimmed = userText.trim();
  if (!trimmed) return session;

  const isZh = locale === "zh-CN";
  const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
  const messages = [...session.messages, userMsg];
  const answers = { ...session.answers };

  if (session.round === 1) {
    answers.task = trimmed;
    const scene = detectScene(trimmed);
    const sceneConfig = getScene(scene);
    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: getRound2Question(sceneConfig, locale),
    };
    return {
      ...session,
      round: 2,
      scene,
      answers,
      messages: [...messages, assistantMsg],
      completed: false,
    };
  }

  if (session.round === 2) {
    answers.details = trimmed;
    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: getRound3Question(locale),
    };
    return {
      ...session,
      round: 3,
      answers,
      messages: [...messages, assistantMsg],
      completed: false,
    };
  }

  if (session.round === 3) {
    answers.constraints = trimmed;
    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: getRound4Question(locale),
    };
    return {
      ...session,
      round: 4,
      answers,
      messages: [...messages, assistantMsg],
      completed: false,
    };
  }

  if (session.round === 4) {
    answers.example = trimmed;
    const prompt = buildFinalPrompt(session.scene, answers as CollectedAnswers, locale);
    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: `${getRound5Intro(locale)}\n\n---\n\n${prompt}`,
    };
    return {
      ...session,
      round: 5,
      answers,
      messages: [...messages, assistantMsg],
      completed: true,
    };
  }

  answers.constraints = [answers.constraints, trimmed].filter(Boolean).join("\n");
  const assistantMsg: ChatMessage = {
    id: uid(),
    role: "assistant",
    content: isZh
      ? "已记录补充说明，右侧预览已更新。"
      : "Noted. The preview panel has been updated.",
  };
  return {
    ...session,
    answers,
    messages: [...messages, assistantMsg],
    completed: true,
  };
}

export function buildDraftPrompt(
  sceneId: SceneId,
  answers: Partial<CollectedAnswers>,
  locale: Locale
): string {
  return generatePrompt(sceneId, answers, locale);
}

export function buildFinalPrompt(
  sceneId: SceneId,
  answers: CollectedAnswers,
  locale: Locale
): string {
  return generatePrompt(sceneId, answers, locale);
}

export function getPreviewPrompt(session: ChatSession, locale: Locale): string {
  const hasUserInput =
    session.messages.some((m) => m.role === "user") ||
    Boolean(session.answers.task?.trim());

  if (!hasUserInput) return "";

  if (session.completed && session.finalPrompt?.trim()) {
    return session.finalPrompt.trim();
  }

  if (session.completed && session.round >= 5) {
    return buildFinalPrompt(
      session.scene,
      {
        task: session.answers.task ?? "",
        details: session.answers.details ?? "",
        constraints: session.answers.constraints ?? "",
        example: session.answers.example ?? "",
      },
      locale
    );
  }
  return buildDraftPrompt(session.scene, session.answers, locale);
}

export const QUICK_SCENARIOS: QuickScenario[] = [
  {
    id: "ecommerce-cs",
    label: "做电商客服",
    scene: "customer_service",
    answers: {
      task: "做跨境电商客服，处理买家咨询和售后",
      details: "主营服装配饰，场景包括物流查询、尺码建议、退换货；语气亲切专业，中英文双语",
      constraints: "回复简洁，先安抚再解决；涉及退款超过7天需转人工；输出 Markdown 分段",
      example: "客户：我的包裹显示已签收但我没收到，订单 #8821",
    },
  },
  {
    id: "python-code",
    label: "写Python代码",
    scene: "code",
    answers: {
      task: "用 Python 写一个批量处理 CSV 的小工具",
      details: "Python 3.11，读取 sales.csv，按月份汇总销售额并导出 report.json；代码要有类型注解和注释",
      constraints: "输出完整可运行脚本 + 使用说明；处理空值和文件不存在的情况",
      example: "CSV 列：date, product, amount, region",
    },
  },
  {
    id: "product-copy",
    label: "写产品文案",
    scene: "writing",
    answers: {
      task: "为一款无线降噪耳机写电商详情页文案",
      details: "目标受众 25-35 岁都市白领，风格种草但不浮夸，突出续航和降噪，约 400 字",
      constraints: "标题 + 3 个卖点小标题 + 正文；避免绝对化用语；适合天猫/京东详情页",
      example: "产品名：Swift Air Pro，续航 40h，混合主动降噪",
    },
  },
];

export function runQuickScenario(scenario: QuickScenario, locale: Locale): ChatSession {
  let session = createInitialSession(locale);
  session.scene = scenario.scene;

  for (const step of [
    scenario.answers.task,
    scenario.answers.details,
    scenario.answers.constraints,
    scenario.answers.example,
  ]) {
    session = processUserMessage(session, step, locale);
  }
  return session;
}

export function roundLabel(round: ChatRound, locale: Locale): string {
  const isZh = locale === "zh-CN";
  const labels: Record<ChatRound, string> = isZh
    ? {
        1: "第 1/5 轮 · 场景",
        2: "第 2/5 轮 · 细节",
        3: "第 3/5 轮 · 约束",
        4: "第 4/5 轮 · 示例",
        5: "第 5/5 轮 · 完成",
      }
    : {
        1: "Round 1/5 · Scenario",
        2: "Round 2/5 · Details",
        3: "Round 3/5 · Constraints",
        4: "Round 4/5 · Example",
        5: "Round 5/5 · Done",
      };
  return labels[round];
}

export function sceneLabel(sceneId: SceneId, locale: Locale): string {
  const scene = getScene(sceneId);
  return locale === "zh-CN" ? scene.labelZh : scene.labelEn;
}

export { extractSlots, fillTemplate, getTemplate } from "./templates";
export { generatePrompt } from "./prompt-format";
