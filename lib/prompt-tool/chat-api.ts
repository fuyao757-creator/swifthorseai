import type { Locale } from "@/lib/i18n";
import { callPromptLlm } from "./llm-client";
import type { ChatSession } from "./types";
import { sceneLabel } from "./chat-engine";

function buildChatSystemPrompt(session: ChatSession, locale: Locale): string {
  const isZh = locale === "zh-CN";
  const scene =
    session.scene !== "general"
      ? sceneLabel(session.scene, locale)
      : isZh
        ? "未确定"
        : "not set";

  if (isZh) {
    return `你是 Swift Horse 提示词助手，通过最多 5 轮对话帮用户生成结构化提示词。

当前状态：
- 轮次：${session.round}/5
- 场景：${scene}
- 已完成：${session.completed ? "是" : "否"}

规则：
1. 每次只问一个问题，语气简洁专业。
2. 第 1 轮：了解用户想用 AI 做什么。
3. 第 2 轮：追问场景细节（受众、输入、输出等）。
4. 第 3 轮：询问格式、约束或敏感内容处理。
5. 第 4 轮：请求一个输入示例（可选跳过说明）。
6. 第 5 轮：根据全部对话生成完整结构化提示词，用 --- 分隔，下方只放可复制的提示词正文。
7. 不要编造用户未提供的信息。
8. 使用简体中文回复。`;
  }

  return `You are Swift Horse's prompt assistant. Guide the user in up to 5 rounds to build a structured prompt.

State:
- Round: ${session.round}/5
- Scene: ${scene}
- Completed: ${session.completed ? "yes" : "no"}

Rules:
1. One question per turn; concise and professional.
2. Round 1: what they want AI to do.
3. Round 2: scene details (audience, inputs, outputs).
4. Round 3: format, constraints, sensitive content.
5. Round 4: sample input (user may skip).
6. Round 5: output the full structured prompt after a --- line.
7. Do not invent facts the user did not provide.
8. Reply in English.`;
}

export async function chatReplyViaApi(
  session: ChatSession,
  userMessage: string,
  locale: Locale
): Promise<string> {
  const system = buildChatSystemPrompt(session, locale);

  const history = session.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return callPromptLlm(
    [
      { role: "system", content: system },
      ...history,
      { role: "user", content: userMessage },
    ],
    { temperature: 0.5, maxTokens: 4096 }
  );
}
