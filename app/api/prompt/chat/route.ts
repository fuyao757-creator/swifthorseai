import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";
import { chatReplyViaApi } from "@/lib/prompt-tool/chat-api";
import { processUserMessage } from "@/lib/prompt-tool/chat-engine";
import { detectScene } from "@/lib/prompt-tool/scenes";
import { getPromptLlmConfig } from "@/lib/prompt-tool/llm-config";
import { PromptLlmError } from "@/lib/prompt-tool/llm-client";
import type { ChatSession } from "@/lib/prompt-tool/types";

function extractFinalPrompt(reply: string): string | undefined {
  const parts = reply.split(/\n---\n/);
  if (parts.length < 2) return undefined;
  const body = parts.slice(1).join("\n---\n").trim();
  return body || undefined;
}

export async function POST(req: Request) {
  let body: {
    session?: ChatSession;
    userMessage?: string;
    locale?: Locale;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userMessage = body.userMessage?.trim() ?? "";
  const session = body.session;
  const locale: Locale = body.locale === "en" ? "en" : "zh-CN";

  if (!session || !userMessage) {
    return NextResponse.json(
      { error: "session and userMessage are required" },
      { status: 400 }
    );
  }

  const { configured } = getPromptLlmConfig();

  if (!configured) {
    const next = processUserMessage(session, userMessage, locale);
    return NextResponse.json({ session: next, source: "local" as const });
  }

  try {
    const reply = await chatReplyViaApi(session, userMessage, locale);
    const userMsg = {
      id: `${Date.now()}-u`,
      role: "user" as const,
      content: userMessage,
    };
    const assistantMsg = {
      id: `${Date.now()}-a`,
      role: "assistant" as const,
      content: reply,
    };
    const completed = session.round === 4;
    const nextRound = completed ? 5 : ((session.round + 1) as ChatSession["round"]);
    const scene =
      session.round === 1 ? detectScene(userMessage) : session.scene;
    const finalPrompt = completed ? extractFinalPrompt(reply) : undefined;

    const next: ChatSession = {
      ...session,
      round: nextRound,
      scene,
      messages: [...session.messages, userMsg, assistantMsg],
      answers: {
        ...session.answers,
        ...(session.round === 1 ? { task: userMessage } : {}),
        ...(session.round === 2 ? { details: userMessage } : {}),
        ...(session.round === 3 ? { constraints: userMessage } : {}),
        ...(session.round === 4 ? { example: userMessage } : {}),
      },
      completed,
      finalPrompt: finalPrompt ?? session.finalPrompt,
    };

    return NextResponse.json({ session: next, source: "api" as const });
  } catch (err) {
    const next = processUserMessage(session, userMessage, locale);
    const message =
      err instanceof PromptLlmError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Chat request failed";

    return NextResponse.json(
      {
        session: next,
        source: "local" as const,
        fallback: true,
        error: message,
      },
      { status: err instanceof PromptLlmError ? err.status : 500 }
    );
  }
}
