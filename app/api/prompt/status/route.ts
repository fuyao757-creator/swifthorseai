import { NextResponse } from "next/server";
import { getPromptLlmConfig } from "@/lib/prompt-tool/llm-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const { configured, model, baseUrl } = getPromptLlmConfig();
  return NextResponse.json({
    configured,
    model: configured ? model : null,
    provider: configured ? baseUrl.replace(/\/v1$/, "") : null,
  });
}
