import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "models.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const patches = {
  "chatglm-app": [
    {
      id: "reasoning",
      label: { en: "General Dialogue", "zh-CN": "通用对话" },
      category: "text",
    },
    {
      id: "image-gen",
      label: { en: "Multimodal Understanding", "zh-CN": "多模态理解" },
      category: "image",
    },
  ],
  "nano-ai": [
    {
      id: "search",
      label: { en: "AI Search", "zh-CN": "AI 搜索" },
      category: "text",
    },
    {
      id: "reasoning",
      label: { en: "Intelligent Assistant", "zh-CN": "智能助手" },
      category: "text",
    },
  ],
  "metaso-search": [
    {
      id: "search",
      label: { en: "AI Search", "zh-CN": "AI 搜索" },
      category: "text",
    },
    {
      id: "search",
      label: { en: "Information Refinement", "zh-CN": "信息精炼" },
      category: "text",
    },
  ],
  "quark-ai": [
    {
      id: "search",
      label: { en: "AI Search", "zh-CN": "AI 搜索" },
      category: "text",
    },
    {
      id: "reasoning",
      label: { en: "Learning Assistant", "zh-CN": "学习助手" },
      category: "text",
    },
  ],
  "tiangong-ai": [
    {
      id: "search",
      label: { en: "Intelligent Search", "zh-CN": "智能搜索" },
      category: "text",
    },
    {
      id: "reasoning",
      label: { en: "AI Dialogue", "zh-CN": "AI 对话" },
      category: "text",
    },
    {
      id: "writing",
      label: { en: "Content Generation", "zh-CN": "内容生成" },
      category: "text",
    },
  ],
  "iflytek-spark": [
    {
      id: "translation",
      label: { en: "Multilingual Translation", "zh-CN": "多语言翻译" },
      category: "text",
    },
    {
      id: "reasoning",
      label: { en: "Intelligent Q&A", "zh-CN": "智能问答" },
      category: "text",
    },
  ],
};

for (const model of data.models) {
  if (patches[model.id]) {
    model.useCases = patches[model.id];
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log("Updated:", Object.keys(patches).join(", "));
