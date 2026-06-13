import { getPromptLlmConfig } from "./llm-config";

export class PromptLlmError extends Error {
  constructor(
    message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "PromptLlmError";
  }
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callPromptLlm(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const { apiKey, baseUrl, model, configured } = getPromptLlmConfig();

  if (!configured) {
    throw new PromptLlmError("Prompt API is not configured", 503);
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.4,
      max_tokens: options?.maxTokens ?? 4096,
      stream: false,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new PromptLlmError(
      detail.slice(0, 280) || `LLM request failed (${res.status})`,
      res.status
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new PromptLlmError("Empty response from LLM", 502);
  }

  return content;
}
