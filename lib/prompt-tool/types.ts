export type SceneId =
  | "customer_service"
  | "code"
  | "writing"
  | "translation"
  | "analysis"
  | "meeting"
  | "email"
  | "resume"
  | "tutoring"
  | "brainstorm"
  | "general";

export type ChatRound = 1 | 2 | 3 | 4 | 5;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface CollectedAnswers {
  task: string;
  details: string;
  constraints: string;
  example: string;
}

export interface ChatSession {
  round: ChatRound;
  scene: SceneId;
  answers: Partial<CollectedAnswers>;
  messages: ChatMessage[];
  completed: boolean;
  /** API 对话第 5 轮生成的完整提示词 */
  finalPrompt?: string;
}

export interface PromptHistoryEntry {
  id: string;
  title: string;
  scene: SceneId;
  prompt: string;
  createdAt: number;
}

export interface QuickScenario {
  id: string;
  label: string;
  scene: SceneId;
  answers: CollectedAnswers;
}
