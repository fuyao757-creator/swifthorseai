/** 服务端 LLM 配置（OpenAI 兼容接口，默认 DeepSeek） */

export function getPromptLlmConfig() {
  const apiKey =
    process.env.PROMPT_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    "";

  const baseUrl = (
    process.env.PROMPT_API_BASE_URL?.trim() ||
    "https://api.deepseek.com/v1"
  ).replace(/\/$/, "");

  const model =
    process.env.PROMPT_API_MODEL?.trim() || "deepseek-chat";

  return { apiKey, baseUrl, model, configured: Boolean(apiKey) };
}
