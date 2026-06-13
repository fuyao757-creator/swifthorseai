import type { Company } from "./data";

export const companyAccent: Record<Company | "other", string> = {
  deepseek: "#1d4ed8",
  alibaba: "#c2410c",
  baidu: "#2563eb",
  baichuan: "#0d9488",
  lingyi: "#7c3aed",
  zhipu: "#047857",
  moonshot: "#6d28d9",
  bytedance: "#be123c",
  tencent: "#0052d9",
  qihoo: "#16a34a",
  kunlun: "#ea580c",
  sensetime: "#0891b2",
  jd: "#dc2626",
  other: "#57534e",
};

export const companyLabel: Record<Company | "other", string> = {
  deepseek: "DS",
  alibaba: "AL",
  baidu: "BD",
  baichuan: "BC",
  lingyi: "YI",
  zhipu: "ZP",
  moonshot: "MS",
  bytedance: "BY",
  tencent: "TX",
  qihoo: "360",
  kunlun: "KL",
  sensetime: "ST",
  jd: "JD",
  other: "QT",
};
