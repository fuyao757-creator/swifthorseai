import type { Locale } from "@/lib/i18n";
import type { OptimizeMode } from "./optimizer";
import type { ChatSession } from "./types";

export type PromptApiStatus = {
  configured: boolean;
  model: string | null;
  provider: string | null;
};

export async function fetchPromptApiStatus(): Promise<PromptApiStatus> {
  const res = await fetch("/api/prompt/status", { cache: "no-store" });
  if (!res.ok) {
    return { configured: false, model: null, provider: null };
  }
  return res.json() as Promise<PromptApiStatus>;
}

export async function requestPromptOptimize(
  prompt: string,
  mode: OptimizeMode,
  locale: Locale
): Promise<{ result: string; source: "api" | "local"; fallback?: boolean; error?: string }> {
  const res = await fetch("/api/prompt/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, mode, locale }),
  });

  const data = (await res.json()) as {
    result?: string;
    source?: "api" | "local";
    fallback?: boolean;
    error?: string;
  };

  if (!data.result) {
    throw new Error(data.error || "Optimization failed");
  }

  return {
    result: data.result,
    source: data.source ?? "local",
    fallback: data.fallback,
    error: data.error,
  };
}

export async function requestPromptChat(
  session: ChatSession,
  userMessage: string,
  locale: Locale
): Promise<{
  session: ChatSession;
  source: "api" | "local";
  fallback?: boolean;
  error?: string;
}> {
  const res = await fetch("/api/prompt/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session, userMessage, locale }),
  });

  const data = (await res.json()) as {
    session?: ChatSession;
    source?: "api" | "local";
    fallback?: boolean;
    error?: string;
  };

  if (!data.session) {
    throw new Error(data.error || "Chat request failed");
  }

  return {
    session: data.session,
    source: data.source ?? "local",
    fallback: data.fallback,
    error: data.error,
  };
}
