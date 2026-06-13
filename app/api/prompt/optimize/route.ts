import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n";
import { getPromptLlmConfig } from "@/lib/prompt-tool/llm-config";
import { optimizePromptViaApi } from "@/lib/prompt-tool/optimize-api";
import { optimizePrompt, type OptimizeMode } from "@/lib/prompt-tool/optimizer";
import { PromptLlmError } from "@/lib/prompt-tool/llm-client";

const MODES: OptimizeMode[] = [
  "auto",
  "structure",
  "clarity",
  "constraints",
  "professional",
];

export async function POST(req: Request) {
  let body: { prompt?: string; mode?: OptimizeMode; locale?: Locale };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim() ?? "";
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const mode = MODES.includes(body.mode as OptimizeMode)
    ? (body.mode as OptimizeMode)
    : "auto";
  const locale: Locale = body.locale === "en" ? "en" : "zh-CN";

  const { configured } = getPromptLlmConfig();

  if (!configured) {
    return NextResponse.json({
      result: optimizePrompt(prompt, mode, locale),
      source: "local" as const,
    });
  }

  try {
    const result = await optimizePromptViaApi(prompt, mode, locale);
    return NextResponse.json({ result, source: "api" as const });
  } catch (err) {
    if (err instanceof PromptLlmError && err.status === 503) {
      return NextResponse.json({
        result: optimizePrompt(prompt, mode, locale),
        source: "local" as const,
      });
    }

    const message =
      err instanceof PromptLlmError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Optimization failed";

    return NextResponse.json(
      {
        error: message,
        result: optimizePrompt(prompt, mode, locale),
        source: "local" as const,
        fallback: true,
      },
      { status: err instanceof PromptLlmError ? err.status : 500 }
    );
  }
}
