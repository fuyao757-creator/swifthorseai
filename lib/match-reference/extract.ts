import type {
  Budget,
  Deployment,
  Language,
  MediaFocus,
  Scenario,
  Volume,
} from "./engine";

export interface ExtractedProfile {
  scenario?: Scenario;
  language?: Language;
  volume?: Volume;
  budget?: Budget;
  deployment?: Deployment;
  mediaFocus?: MediaFocus;
}

type Field = keyof ExtractedProfile;

const SCENARIO_RULES: { keys: Scenario; patterns: RegExp[] }[] = [
  {
    keys: "customer-service",
    patterns: [
      /客服|智能客服|在线客服|售后|对话机器人|对话系统|多轮对话|customer\s*service|support\s*chat|chatbot/i,
    ],
  },
  {
    keys: "coding",
    patterns: [
      /代码|编程|程序|开发(?!.*创作)|助手|debug|programming|developer|code\s*assist/i,
    ],
  },
  {
    keys: "translation",
    patterns: [/翻译|translate|translation/i],
  },
  {
    keys: "data-analysis",
    patterns: [/数据|分析|报表|analytics|data\s*analysis/i],
  },
  {
    keys: "content",
    patterns: [
      /对话创作|内容创作|故事创作|文案创作|创意写作|广告写作|营销文案|小说|短篇/i,
      /写作|文案|创意|营销|广告|创作|content|copywriting|creative/i,
    ],
  },
];

const MEDIA_FOCUS_RULES: { keys: MediaFocus; patterns: RegExp[] }[] = [
  {
    keys: "video",
    patterns: [/视频|文生视频|做视频|video\s*gen|video\s*production|短视频制作/i],
  },
  {
    keys: "image",
    patterns: [/图像|图片|文生图|image\s*gen|visual\s*design/i],
  },
  {
    keys: "search",
    patterns: [/智能搜索|ai\s*搜索|信息检索|search\s*engine/i],
  },
  {
    keys: "voice",
    patterns: [/语音|voice|口语交互|语音交互/i],
  },
  {
    keys: "text",
    patterns: [
      /广告写作|广告文案|营销文案|品牌文案|软文|种草|文案|写作|文本|长文本|文档写作|文章|copywriting|marketing\s*copy|ad\s*writing/i,
    ],
  },
];

export function extractFromText(text: string): Partial<ExtractedProfile> {
  const t = text.toLowerCase();
  const out: Partial<ExtractedProfile> = {};

  for (const rule of SCENARIO_RULES) {
    if (rule.patterns.some((p) => p.test(text) || p.test(t))) {
      out.scenario = rule.keys;
      break;
    }
  }

  for (const rule of MEDIA_FOCUS_RULES) {
    if (rule.patterns.some((p) => p.test(text) || p.test(t))) {
      out.mediaFocus = rule.keys;
      break;
    }
  }

  if (/中英文|中英双语|双语|bilingual|chinese\s*and\s*english/i.test(text)) {
    out.language = "multilingual";
  } else if (/多语言|multilingual|多国语言/i.test(text)) {
    out.language = "multilingual";
  } else if (/电商|东南亚|欧美|跨境|海外|global|e-?commerce|southeast\s*asia/i.test(text)) {
    out.language = "multilingual";
  } else if (/英文|英语|english|en\b/i.test(text)) {
    out.language = "en";
  } else if (/日文|韩文|日语|韩语|japanese|korean/i.test(text)) {
    out.language = "ja-ko";
  } else if (/中文|汉语|chinese/i.test(text)) {
    out.language = "zh";
  }

  const volNum =
    text.match(/(\d[\d,]*)\s*(次|calls?|requests?|调用)/i) ??
    text.match(/(?:每天|daily|约|大概|大约)\s*(\d[\d,]*)/i);
  if (volNum) {
    const n = parseInt(volNum[1].replace(/,/g, ""), 10);
    if (n < 1000) out.volume = "lt1k";
    else if (n < 10000) out.volume = "1k-10k";
    else if (n < 100000) out.volume = "10k-100k";
    else out.volume = "gt100k";
  } else if (/调用量不大|量不大|低频|low\s*volume/i.test(text)) {
    out.volume = "lt1k";
  } else if (/高并发|大量|high\s*volume|百万/i.test(text)) {
    out.volume = "gt100k";
  }

  if (/预算有限|省钱|便宜|低成本|budget.*limited|low\s*cost|cheap/i.test(text)) {
    out.budget = "lt50";
  } else if (
    /\$200|200\s*美元|月预算.*200|budget.*200|预算.*200/i.test(text)
  ) {
    out.budget = "50-200";
  } else if (/不限|无预算限制|unlimited\s*budget/i.test(text)) {
    out.budget = "unlimited";
  } else if (/\$1000|千元|高预算|budget.*1000/i.test(text)) {
    out.budget = "200-1000";
  } else if (/\$50|50\s*美元|预算.*50/i.test(text)) {
    out.budget = "lt50";
  }

  if (/私有化|本地部署|内网|on-?prem|private\s*deploy|self-?host/i.test(text)) {
    out.deployment = "private";
  } else if (/云\s*api|云api|cloud\s*api|saas|api\s*调用/i.test(text)) {
    out.deployment = "cloud-api";
  } else if (/两者|都可以|flexible/i.test(text)) {
    out.deployment = "both";
  }

  return out;
}

export function mergeProfiles(
  ...profiles: Partial<ExtractedProfile>[]
): Partial<ExtractedProfile> {
  const merged: Partial<ExtractedProfile> = {};
  for (const p of profiles) {
    (Object.keys(p) as Field[]).forEach((k) => {
      const v = p[k];
      if (v !== undefined) (merged as Record<Field, ExtractedProfile[Field]>)[k] = v;
    });
  }
  return merged;
}

const FIELD_PRIORITY: Field[] = [
  "scenario",
  "deployment",
  "language",
  "budget",
  "volume",
];

export function getMissingFields(profile: Partial<ExtractedProfile>): Field[] {
  return FIELD_PRIORITY.filter((f) => profile[f] === undefined);
}

export function isProfileReady(
  profile: Partial<ExtractedProfile>,
  followUpCount: number
): boolean {
  if (!profile.scenario) return false;
  const missing = getMissingFields(profile);
  if (missing.length === 0) return true;
  if (followUpCount >= 3 && missing.length <= 1) return true;
  if (followUpCount >= 2 && missing.length <= 2) return true;
  return false;
}

export function extractFromConversation(
  userMessages: string[]
): Partial<ExtractedProfile> {
  const merged = userMessages.reduce(
    (acc, msg) => mergeProfiles(acc, extractFromText(msg)),
    {} as Partial<ExtractedProfile>
  );
  return inferDefaultMediaFocus(merged, userMessages.join("\n"));
}

/** 内容创作场景下，根据对话推断文本/视频/图像等形态，避免文案需求误推视频模型 */
function inferDefaultMediaFocus(
  profile: Partial<ExtractedProfile>,
  fullText: string
): Partial<ExtractedProfile> {
  if (profile.mediaFocus) return profile;

  if (/视频|文生视频|做视频|video/i.test(fullText)) {
    return { ...profile, mediaFocus: "video" };
  }
  if (/图像|图片|文生图|image\s*gen/i.test(fullText)) {
    return { ...profile, mediaFocus: "image" };
  }
  if (/智能搜索|ai\s*搜索|信息检索/i.test(fullText)) {
    return { ...profile, mediaFocus: "search" };
  }
  if (/语音|voice/i.test(fullText)) {
    return { ...profile, mediaFocus: "voice" };
  }

  if (
    profile.scenario === "content" &&
    /写作|文案|广告|营销|创意|内容|copy|writing|creative|故事|小说/i.test(fullText)
  ) {
    return { ...profile, mediaFocus: "text" };
  }

  return profile;
}

export type FollowUpKey = Exclude<Field, "mediaFocus">;

export function getNextFollowUpField(
  profile: Partial<ExtractedProfile>
): FollowUpKey | null {
  const missing = getMissingFields(profile);
  return (missing.find((f) => f !== "mediaFocus") as FollowUpKey | undefined) ?? null;
}
