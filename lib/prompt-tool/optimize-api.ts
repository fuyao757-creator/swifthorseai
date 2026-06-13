import type { Locale } from "@/lib/i18n";
import { callPromptLlm } from "./llm-client";
import type { OptimizeMode } from "./optimizer";

const MODE_GUIDE: Record<
  OptimizeMode,
  { zh: string; en: string }
> = {
  auto: {
    zh: "全面优化：补齐角色、任务、输出格式与约束，提升清晰度与可执行性。",
    en: "Holistic pass: role, task, output format, and constraints—clearer and more actionable.",
  },
  structure: {
    zh: "按「角色 → 任务 → 核心信息 → 输出要求 → 具体问题」重组结构，使用小标题与列表。",
    en: "Reorganize as Role → Task → Core Info → Output Requirements → Specific Questions with headings/lists.",
  },
  clarity: {
    zh: "消除模糊表述，每句一个要求，关键术语首次出现时简要定义。",
    en: "Remove ambiguity; one requirement per sentence; define key terms on first use.",
  },
  constraints: {
    zh: "补充不编造事实、标注不确定性、合规/隐私风险提示等约束。",
    en: "Add constraints: no fabrication, flag uncertainty, compliance/privacy notes.",
  },
  professional: {
    zh: "使用正式、准确的行业术语，语气客观，适合职场交付。",
    en: "Formal, precise terminology; objective tone for workplace deliverables.",
  },
};

function buildOptimizeSystemPrompt(mode: OptimizeMode, locale: Locale): string {
  const isZh = locale === "zh-CN";
  const guide = MODE_GUIDE[mode][isZh ? "zh" : "en"];

  if (isZh) {
    return `你是专业的提示词工程师。用户会提供原始提示词，请按指定模式优化。

优化模式：${guide}

要求：
1. 保留用户原意，不添加原文没有的业务事实、数据或承诺。
2. 输出可直接复制使用的完整提示词（Markdown 格式）。
3. 不要输出解释、前言或「以下是优化结果」等套话，只输出优化后的提示词正文。
4. 使用简体中文。`;
  }

  return `You are a professional prompt engineer. The user provides a raw prompt; optimize it per the selected mode.

Mode: ${guide}

Rules:
1. Preserve user intent; do not invent facts, metrics, or promises not in the source.
2. Output a ready-to-use full prompt in Markdown.
3. No preamble or meta commentary—only the optimized prompt body.
4. Write in English.`;
}

export async function optimizePromptViaApi(
  raw: string,
  mode: OptimizeMode,
  locale: Locale
): Promise<string> {
  const system = buildOptimizeSystemPrompt(mode, locale);
  const isZh = locale === "zh-CN";

  return callPromptLlm(
    [
      { role: "system", content: system },
      {
        role: "user",
        content: isZh
          ? `请优化以下提示词：\n\n${raw}`
          : `Optimize this prompt:\n\n${raw}`,
      },
    ],
    { temperature: 0.35, maxTokens: 4096 }
  );
}
