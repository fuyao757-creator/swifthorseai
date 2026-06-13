"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { PageHeader } from "@/components/PageHeader";
import { LegalNotice } from "@/components/LegalNotice";
import { ModelWorkflowNav } from "@/components/ModelWorkflowNav";
import { getModelById } from "@/lib/data";
import { getLocalizedValue } from "@/lib/i18n";
import {
  buildMatchUrl,
  buildServicesUrl,
  parseModelIdsParam,
  parseSceneParam,
} from "@/lib/model-workflow";
import {
  createInitialSession,
  getPreviewPrompt,
  processUserMessage,
  QUICK_SCENARIOS,
  roundLabel,
  runQuickScenario,
  sceneLabel,
  STORAGE_HISTORY,
  STORAGE_SESSION,
} from "@/lib/prompt-tool/chat-engine";
import { optimizePrompt, type OptimizeMode } from "@/lib/prompt-tool/optimizer";
import {
  fetchPromptApiStatus,
  requestPromptChat,
  requestPromptOptimize,
  type PromptApiStatus,
} from "@/lib/prompt-tool/client-api";
import type { ChatSession, PromptHistoryEntry } from "@/lib/prompt-tool/types";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

type TabId = "optimize" | "chat";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadSession(locale: Locale): ChatSession {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (raw) return JSON.parse(raw) as ChatSession;
  } catch {
    /* ignore corrupt data */
  }
  return createInitialSession(locale);
}

function loadHistory(): PromptHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY);
    if (raw) return (JSON.parse(raw) as PromptHistoryEntry[]).slice(0, 20);
  } catch {
    /* ignore */
  }
  return [];
}

export function PromptToolClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.promptTool;
  const isZh = locale === "zh-CN";
  const searchParams = useSearchParams();
  const linkedModelIds = useMemo(
    () => parseModelIdsParam(searchParams.get("models")),
    [searchParams]
  );
  const linkedModelNames = useMemo(
    () =>
      linkedModelIds
        .map((id) => {
          const model = getModelById(id);
          return model ? getLocalizedValue(model.name, locale) : id;
        })
        .join(" · "),
    [linkedModelIds, locale]
  );

  const [tab, setTab] = useState<TabId>("optimize");
  const [rawPrompt, setRawPrompt] = useState("");
  const [optimized, setOptimized] = useState("");
  const [optimizeMode, setOptimizeMode] = useState<OptimizeMode>("auto");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeSource, setOptimizeSource] = useState<"api" | "local" | null>(null);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<PromptApiStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const [clientReady, setClientReady] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [history, setHistory] = useState<PromptHistoryEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const optimizeResultsRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLElement>(null);

  const scrollToResults = useCallback((target: "optimize" | "preview") => {
    const el =
      target === "optimize" ? optimizeResultsRef.current : previewPanelRef.current;
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const scrollToOptimizeResults = useCallback(() => {
    scrollToResults("optimize");
  }, [scrollToResults]);

  const preview = useMemo(
    () => (session ? getPreviewPrompt(session, locale) : ""),
    [session, locale]
  );

  useEffect(() => {
    const stored = loadSession(locale);
    const sceneFromUrl = parseSceneParam(searchParams.get("scene"));
    if (sceneFromUrl && stored.scene === "general" && !stored.completed) {
      stored.scene = sceneFromUrl;
    }
    setSession(stored);
    setHistory(loadHistory());
    setClientReady(true);
    void fetchPromptApiStatus().then(setApiStatus);
  }, [locale, searchParams]);

  const runOptimize = useCallback(
    async (text: string, mode: OptimizeMode) => {
      const trimmed = text.trim();
      if (!trimmed) {
        setOptimized("");
        setOptimizeSource(null);
        setOptimizeError(null);
        return;
      }

      setIsOptimizing(true);
      setOptimizeError(null);

      try {
        const data = await requestPromptOptimize(trimmed, mode, locale);
        setOptimized(data.result);
        setOptimizeSource(data.source);
        if (data.fallback && data.error) {
          setOptimizeError(data.error);
        }
        scrollToOptimizeResults();
      } catch (err) {
        setOptimized(optimizePrompt(trimmed, mode, locale));
        setOptimizeSource("local");
        setOptimizeError(err instanceof Error ? err.message : t.optimizeFailed);
        scrollToOptimizeResults();
      } finally {
        setIsOptimizing(false);
      }
    },
    [locale, scrollToOptimizeResults, t.optimizeFailed]
  );

  useEffect(() => {
    const trimmed = rawPrompt.trim();
    if (!trimmed) {
      setOptimized("");
      setOptimizeSource(null);
      setOptimizeError(null);
      setIsOptimizing(false);
      return;
    }

    const delay = apiStatus?.configured ? 900 : 450;
    setIsOptimizing(true);
    const timer = window.setTimeout(() => {
      void runOptimize(trimmed, optimizeMode);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [rawPrompt, optimizeMode, apiStatus?.configured, runOptimize]);

  useEffect(() => {
    if (!clientReady || !session) return;
    try {
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
    } catch {
      /* ignore */
    }
  }, [session, clientReady]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const copyText = useCallback(
    async (text: string) => {
      const ok = await copyToClipboard(text);
      if (ok) {
        setCopyError(false);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } else {
        setCopyError(true);
        window.setTimeout(() => setCopyError(false), 4000);
      }
    },
    []
  );

  const selectPromptField = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.select();
  }, []);

  const saveToHistory = useCallback(
    (prompt: string, src: ChatSession) => {
      const entry: PromptHistoryEntry = {
        id: uid(),
        title: src.answers.task?.slice(0, 40) || t.historyUntitled,
        scene: src.scene,
        prompt,
        createdAt: Date.now(),
      };
      setHistory((prev) => {
        const next = [entry, ...prev.filter((h) => h.prompt !== prompt)].slice(0, 20);
        try {
          localStorage.setItem(STORAGE_HISTORY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [t.historyUntitled]
  );

  const handleSend = async () => {
    if (!session || isChatSending) return;
    const text = input.trim();
    if (!text || session.completed) return;

    setIsChatSending(true);
    setChatError(null);

    try {
      const data = await requestPromptChat(session, text, locale);
      setSession(data.session);
      setInput("");
      if (data.session.completed) {
        saveToHistory(getPreviewPrompt(data.session, locale), data.session);
      }
      if (data.fallback && data.error) {
        setChatError(data.error);
      }
    } catch (err) {
      const next = processUserMessage(session, text, locale);
      setSession(next);
      setInput("");
      if (next.completed) {
        saveToHistory(getPreviewPrompt(next, locale), next);
      }
      setChatError(err instanceof Error ? err.message : t.chatFailed);
    } finally {
      setIsChatSending(false);
      window.setTimeout(() => scrollToResults("preview"), 200);
    }
  };

  const resetChat = useCallback(
    (showClearedNotice = false) => {
      const hadProgress =
        session && (session.round > 1 || session.messages.some((m) => m.role === "user"));
      try {
        localStorage.removeItem(STORAGE_SESSION);
      } catch {
        /* ignore */
      }
      const fresh = createInitialSession(locale);
      if (showClearedNotice && hadProgress) {
        fresh.messages = [
          ...fresh.messages,
          {
            id: uid(),
            role: "assistant",
            content: t.clearedReply,
          },
        ];
      }
      setSession(fresh);
      setInput("");
    },
    [locale, session, t.clearedReply]
  );

  const clearAndRestart = () => resetChat(true);

  const clearOptimizer = () => {
    setRawPrompt("");
    setOptimized("");
    setIsOptimizing(false);
    setOptimizeSource(null);
    setOptimizeError(null);
  };

  const runScenario = (index: number) => {
    const scenario = QUICK_SCENARIOS[index];
    if (!scenario) return;
    const next = runQuickScenario(scenario, locale);
    setSession(next);
    saveToHistory(getPreviewPrompt(next, locale), next);
    setTab("chat");
    window.setTimeout(() => scrollToResults("preview"), 100);
  };

  const tabClass = (id: TabId) =>
    `rounded-lg px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider transition-all ${
      tab === id
        ? "bg-ink text-white dark:bg-tech-cyan dark:text-[#06080f]"
        : "text-ink-muted hover:bg-stone-100 dark:hover:bg-white/5"
    }`;

  const modeButtons: [OptimizeMode, string][] = [
    ["auto", t.modeAuto],
    ["structure", t.modeStructure],
    ["clarity", t.modeClarity],
    ["constraints", t.modeConstraints],
    ["professional", t.modeProfessional],
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        badge={t.badge}
        code="PROMPT · OPTIMIZE"
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
        backHref={`/${locale}`}
        backLabel={dict.nav.backHome}
      />

      <ModelWorkflowNav locale={locale} dict={dict} current="prompts" />

      {linkedModelIds.length > 0 ? (
        <div className="model-workflow-context mb-6">
          <p className="model-workflow-context-text">
            {dict.workflow.contextBanner.replace("{models}", linkedModelNames)}
          </p>
          <div className="model-workflow-context-actions">
            {linkedModelIds.length >= 2 ? (
              <Link href={buildServicesUrl(locale, linkedModelIds)} className="btn-ghost text-xs">
                {dict.workflow.goCompare} →
              </Link>
            ) : null}
            <Link href={buildMatchUrl(locale)} className="btn-ghost text-xs">
              {dict.workflow.goMatch} →
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mb-6">
        <LegalNotice linkHref={`/${locale}/disclaimer`} linkLabel={dict.footer.readMore}>
          {apiStatus?.configured ? t.disclaimerApi : t.disclaimer}
        </LegalNotice>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" className={tabClass("optimize")} onClick={() => setTab("optimize")}>
          {t.tabOptimize}
        </button>
        <button type="button" className={tabClass("chat")} onClick={() => setTab("chat")}>
          {t.tabChat}
        </button>
      </div>
      <p className="mb-6 rounded-lg border border-stone-200/70 bg-stone-50/50 px-4 py-3 font-mono text-xs leading-relaxed text-ink-muted dark:border-white/10 dark:bg-white/[0.03]">
        {tab === "optimize" ? t.tabOptimizeDesc : t.tabChatDesc}
        <span className="mt-1 block text-[10px] text-ink-faint">{t.complementaryNote}</span>
      </p>

      {tab === "optimize" ? (
        <div className="space-y-6">
          <div className="card-static p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold">{t.optimizeInputTitle}</h2>
            <p className="mt-2 text-sm text-ink-muted">
              {apiStatus?.configured ? t.optimizeInputHintApi : t.optimizeInputHint}
            </p>
            <textarea
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              rows={5}
              placeholder={t.optimizePlaceholder}
              className="mt-4 w-full rounded-xl border border-stone-200/80 bg-white/80 p-4 font-mono text-sm leading-relaxed text-ink outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {modeButtons.map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setOptimizeMode(mode)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                    optimizeMode === mode
                      ? "border-cyan-500/50 bg-cyan-500/10 text-ink dark:text-white"
                      : "border-stone-200/80 text-ink-muted dark:border-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
              {(rawPrompt.trim() || optimized) && (
                <button type="button" onClick={clearOptimizer} className="btn-outline text-[10px]">
                  {t.clearOptimize}
                </button>
              )}
              {rawPrompt.trim() && apiStatus?.configured && (
                <button
                  type="button"
                  onClick={() => void runOptimize(rawPrompt, optimizeMode)}
                  disabled={isOptimizing}
                  className="btn-primary px-3 py-1.5 text-[10px] disabled:opacity-50"
                >
                  {isOptimizing ? t.autoOptimizing : t.optimizeNow}
                </button>
              )}
              {isOptimizing && rawPrompt.trim() && (
                <span className="font-mono text-[10px] text-ink-faint">{t.autoOptimizing}</span>
              )}
              {optimizeSource === "api" && optimized && !isOptimizing && (
                <span className="font-mono text-[10px] text-cyan-700 dark:text-tech-cyan">
                  {t.optimizedByApi}
                </span>
              )}
              {optimizeError && (
                <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
                  {t.apiFallbackNote}
                </span>
              )}
            </div>
          </div>

          <div ref={optimizeResultsRef} className="grid scroll-mt-24 gap-4 md:grid-cols-2">
            <div className="card-static flex flex-col p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="badge">{t.beforeLabel}</span>
                <span className="font-mono text-[10px] text-ink-faint">{t.beforeHint}</span>
              </div>
              <pre className="min-h-[20rem] flex-1 overflow-auto whitespace-pre-wrap rounded-xl border border-stone-200/80 bg-stone-100/60 p-4 font-mono text-xs leading-relaxed text-ink-muted dark:border-white/10 dark:bg-white/[0.02] dark:text-stone-400">
                {rawPrompt.trim() || t.beforeEmpty}
              </pre>
            </div>

            <div className="card-static flex flex-col p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="badge border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-tech-cyan">
                    {t.afterLabel}
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint">{t.afterHint}</span>
                </div>
                {optimized && (
                  <button
                    type="button"
                    onClick={() => void copyText(optimized)}
                    className="btn-outline min-h-[44px] touch-manipulation text-xs"
                  >
                    {copied ? t.copied : t.copy}
                  </button>
                )}
              </div>
              {copyError && optimized && (
                <p className="mb-2 font-mono text-[10px] text-amber-700 dark:text-amber-400">
                  {t.copyFailed}
                </p>
              )}
              <textarea
                readOnly
                value={optimized || t.optimizeEmpty}
                onFocus={optimized ? selectPromptField : undefined}
                aria-label={t.afterLabel}
                className="prompt-output-field min-h-[20rem] flex-1 overflow-auto rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 text-ink dark:border-cyan-500/15 dark:bg-cyan-500/[0.06] dark:text-stone-200"
              />
            </div>
          </div>
        </div>
      ) : !clientReady || !session ? (
        <div className="card-static flex min-h-[20rem] items-center justify-center p-8">
          <p className="font-mono text-sm text-ink-muted">{t.loadingChat}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{roundLabel(session.round, locale)}</span>
            {session.scene !== "general" && (
              <span className="font-mono text-[10px] text-ink-muted">
                {t.sceneLabel}: {sceneLabel(session.scene, locale)}
              </span>
            )}
            <div className="ml-auto flex flex-wrap gap-2">
              <button type="button" onClick={() => resetChat(false)} className="btn-outline text-xs">
                {t.clearChat}
              </button>
              {(session.round > 1 || session.completed) && (
                <button type="button" onClick={clearAndRestart} className="btn-outline text-xs">
                  {t.clearResults}
                </button>
              )}
            </div>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-[1fr_min(100%,22rem)] lg:grid-cols-[3fr_2fr]">
            <section className="card-static flex min-h-[24rem] flex-col overflow-hidden md:min-h-[28rem]">
              <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
                {session.messages.map((msg, i) => (
                  <div
                    key={`${msg.role}-${i}`}
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "ml-auto bg-ink text-white dark:bg-tech-cyan dark:text-[#06080f]"
                        : "border border-stone-200/80 bg-white/90 dark:border-white/10 dark:bg-white/[0.04]"
                    }`}
                  >
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider opacity-50">
                      {msg.role === "user" ? t.youLabel : "Swift Horse"}
                    </span>
                    {msg.content}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="shrink-0 border-t border-stone-200/70 p-4 dark:border-white/10">
                <div className="mb-3 flex flex-wrap gap-2">
                  {QUICK_SCENARIOS.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => runScenario(i)}
                      className="rounded-lg border border-stone-200/80 px-2.5 py-1 font-mono text-[10px] text-ink-muted transition hover:border-cyan-500/30 dark:border-white/10"
                    >
                      {isZh ? s.label : t.quickLabels[i]}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
                    }
                    disabled={session.completed || isChatSending}
                    placeholder={session.completed ? t.chatDonePlaceholder : t.chatPlaceholder}
                    className="min-w-0 flex-1 rounded-xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm outline-none focus:border-cyan-500/40 dark:border-white/10 dark:bg-white/[0.04]"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={!input.trim() || session.completed || isChatSending}
                    className="btn-primary shrink-0 disabled:opacity-40"
                  >
                    {isChatSending ? t.sending : t.send}
                  </button>
                </div>
                {chatError && (
                  <p className="mt-2 font-mono text-[10px] text-amber-700 dark:text-amber-400">
                    {t.apiFallbackNote}
                  </p>
                )}
                {(session.round > 1 || session.completed) && (
                  <button
                    type="button"
                    onClick={clearAndRestart}
                    className="mt-3 font-mono text-[10px] text-ink-muted underline-offset-2 hover:text-ink hover:underline dark:hover:text-stone-200"
                  >
                    {t.clearResults}
                  </button>
                )}
              </div>
            </section>

            <aside
              ref={previewPanelRef}
              className="card-static flex scroll-mt-24 flex-col p-4 sm:p-6 md:sticky md:top-28 md:max-h-[calc(100vh-8rem)]"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-base font-semibold">{t.previewTitle}</h2>
                <div className="flex flex-wrap gap-2">
                  {(session.round > 1 || session.completed) && (
                    <button type="button" onClick={clearAndRestart} className="btn-outline text-xs">
                      {t.clearResults}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void copyText(preview)}
                    disabled={!preview.trim()}
                    className="btn-outline min-h-[44px] touch-manipulation text-xs disabled:opacity-40"
                  >
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
              </div>
              {copyError && preview.trim() && (
                <p className="mb-2 font-mono text-[10px] text-amber-700 dark:text-amber-400">
                  {t.copyFailed}
                </p>
              )}
              <p className="mb-3 font-mono text-[10px] text-ink-muted">{t.previewHint}</p>
              <textarea
                readOnly
                value={preview || t.previewEmpty}
                onFocus={preview.trim() ? selectPromptField : undefined}
                aria-label={t.previewTitle}
                className="prompt-output-field max-h-[20rem] min-h-[12rem] flex-1 overflow-auto rounded-xl border border-stone-200/80 bg-stone-50/80 p-4 text-ink dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300 md:max-h-none"
              />
              {session.completed && preview.trim() && (
                <p className="mt-3 font-mono text-[10px] text-cyan-600 dark:text-tech-cyan">
                  {t.completeHint}
                </p>
              )}
            </aside>
          </div>

          {history.length > 0 && (
            <div className="card-static p-6">
              <h3 className="font-display text-base font-semibold">{t.historyTitle}</h3>
              <ul className="mt-4 space-y-2">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200/70 px-3 py-2 dark:border-white/10"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="font-mono text-[10px] text-ink-muted">
                        {sceneLabel(item.scene, locale)} ·{" "}
                        {new Date(item.createdAt).toLocaleString(locale)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyText(item.prompt)}
                      className="btn-outline min-h-[44px] touch-manipulation text-xs"
                    >
                      {t.copy}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
