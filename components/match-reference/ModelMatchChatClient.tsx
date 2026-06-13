"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { ModelWorkflowNav } from "@/components/ModelWorkflowNav";
import { ModelBatchActions } from "@/components/ModelRelatedActions";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionary";
import { MODEL_COMPARE_METRICS } from "@/lib/match-reference/compare-metrics";
import {
  computeMatchesFromProfile,
  MATCH_LAST_UPDATED,
  type MatchLevel,
  type MatchResult,
  type Scenario,
} from "@/lib/match-reference/engine";
import {
  extractFromConversation,
  getNextFollowUpField,
  isProfileReady,
  type ExtractedProfile,
} from "@/lib/match-reference/extract";
import {
  buildPromptsUrl,
  buildServicesUrl,
  matchScenarioToPromptScene,
  parseScenarioParam,
} from "@/lib/model-workflow";

const STORAGE_KEY = "swift-horse-match-chats";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface StoredSession {
  id: string;
  updatedAt: number;
  preview: string;
  messages: ChatMessage[];
  profile: Partial<ExtractedProfile>;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function levelLabel(level: MatchLevel, t: Dictionary["modelMatch"]) {
  if (level === "high") return t.matchHigh;
  if (level === "mid-high") return t.matchMidHigh;
  return t.matchMid;
}

export function ModelMatchChatClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.modelMatch;
  const c = dict.modelMatchChat;
  const isZh = locale === "zh-CN";
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<Partial<ExtractedProfile>>({});
  const [followUpCount, setFollowUpCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<StoredSession[]>([]);
  const [sessionId, setSessionId] = useState(() => uid());
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLElement>(null);
  const scrollToChatAfterSend = useRef(false);
  const skipUrlScenarioRef = useRef(false);

  const results = useMemo(() => {
    if (!profile.scenario) return [];
    return computeMatchesFromProfile(profile);
  }, [profile]);

  const initWelcome = useCallback(() => {
    setMessages([{ id: uid(), role: "assistant", content: c.welcome }]);
  }, [c.welcome]);

  useEffect(() => {
    initWelcome();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw).slice(0, 10));
    } catch {
      /* ignore */
    }
  }, [initWelcome]);

  useEffect(() => {
    if (skipUrlScenarioRef.current) return;
    const scenario = parseScenarioParam(searchParams.get("scenario"));
    if (!scenario) return;
    setProfile((prev) => (prev.scenario ? prev : { ...prev, scenario }));
    setReady(true);
  }, [searchParams]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollToChatAfterSend.current) {
        scrollToChatAfterSend.current = false;
        chatSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages]);

  const persistHistory = useCallback(
    (msgs: ChatMessage[], prof: Partial<ExtractedProfile>) => {
      const userPreview = msgs.find((m) => m.role === "user")?.content ?? "";
      const entry: StoredSession = {
        id: sessionId,
        updatedAt: Date.now(),
        preview: userPreview.slice(0, 60),
        messages: msgs,
        profile: prof,
      };
      setHistory((prev) => {
        const next = [entry, ...prev.filter((h) => h.id !== sessionId)].slice(
          0,
          10
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [sessionId]
  );

  const processUserMessage = (text: string) => {
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    const userTexts = nextMessages
      .filter((m) => m.role === "user")
      .map((m) => m.content);
    const merged = extractFromConversation(userTexts);

    const replies: ChatMessage[] = [];
    let newFollowUp = followUpCount;
    let isReady = false;

    if (!merged.scenario && followUpCount < 2) {
      replies.push({
        id: uid(),
        role: "assistant",
        content: c.followUp.scenario,
      });
      newFollowUp += 1;
    } else if (isProfileReady(merged, followUpCount)) {
      isReady = true;
      replies.push({ id: uid(), role: "assistant", content: c.readyReply });
    } else if (followUpCount < 3) {
      const field = getNextFollowUpField(merged);
      if (field) {
        replies.push({
          id: uid(),
          role: "assistant",
          content: c.followUp[field],
        });
        newFollowUp += 1;
      } else {
        isReady = true;
        replies.push({ id: uid(), role: "assistant", content: c.readyReply });
      }
    } else {
      isReady = true;
      replies.push({ id: uid(), role: "assistant", content: c.readyReply });
    }

    const finalMessages = [...nextMessages, ...replies];
    setProfile(merged);
    setMessages(finalMessages);
    setFollowUpCount(newFollowUp);
    setReady(isReady);
    if (isReady) persistHistory(finalMessages, merged);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    scrollToChatAfterSend.current = true;
    processUserMessage(text);
  };

  const clearPanelState = () => {
    setProfile({});
    setFollowUpCount(0);
    setReady(false);
    setInput("");
  };

  const resetMatch = () => {
    skipUrlScenarioRef.current = true;
    clearPanelState();
    setSessionId(uid());
    setMessages([{ id: uid(), role: "assistant", content: c.clearedReply }]);
  };

  const clearChat = () => {
    skipUrlScenarioRef.current = true;
    clearPanelState();
    setSessionId(uid());
    setMessages([{ id: uid(), role: "assistant", content: c.welcome }]);
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const updateProfile = <K extends keyof ExtractedProfile>(
    key: K,
    value: ExtractedProfile[K] | ""
  ) => {
    const next = { ...profile };
    if (value === "") delete next[key];
    else next[key] = value as ExtractedProfile[K];
    setProfile(next);
    if (next.scenario) setReady(true);
    else setReady(false);
  };

  const detectedFields = (
    [
      ["scenario", "scenario"],
      ["mediaFocus", "mediaFocus"],
      ["language", "language"],
      ["volume", "volume"],
      ["budget", "budget"],
      ["deployment", "deployment"],
    ] as const
  ).filter(([key]) => profile[key] !== undefined);

  const userHasSpoken = messages.some((m) => m.role === "user");
  const panelActive = userHasSpoken || ready;
  const showPanel = panelActive && detectedFields.length > 0;
  const hasResults =
    panelActive && Boolean(profile.scenario) && results.length > 0;
  const strictNoMatch =
    panelActive && Boolean(profile.scenario) && results.length === 0;
  const showAnalyzing = panelActive && userHasSpoken && !profile.scenario;

  return (
    <div className="animate-fade-in">
      <BackLink href={`/${locale}`} label={dict.nav.backHome} />
      <ModelWorkflowNav locale={locale} dict={dict} current="match" />

      <div
        className="mb-6 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300"
        role="status"
      >
        {t.topBanner}
      </div>

      <header className="mb-6">
        <p className="mono-label">{c.badge}</p>
        <h1 className="display-title mt-2 text-3xl sm:text-4xl">{c.pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">{c.pageSubtitle}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <section
          ref={chatSectionRef}
          className="glass flex min-h-[32rem] scroll-mt-24 flex-col lg:col-span-3"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-ink text-white dark:bg-tech-cyan dark:text-[#06080f]"
                      : "border border-stone-200/80 bg-white/90 text-ink dark:border-white/10 dark:bg-slate-900/80 dark:text-stone-200"
                  }`}
                >
                  {m.role === "assistant" && (
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider opacity-60">
                      Swift Horse
                    </span>
                  )}
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-stone-200/80 p-4 dark:border-white/10">
            <div className="mb-3 flex flex-wrap gap-2">
              {c.examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setInput(ex)}
                  className="rounded-lg border border-stone-200/80 px-2.5 py-1 text-xs text-ink-muted transition hover:border-stone-300 dark:border-white/10"
                >
                  {ex}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={c.inputPlaceholder}
                className="flex-1 rounded-xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm outline-none focus:border-cinnabar dark:border-white/10 dark:bg-white/5"
              />
              <button type="button" onClick={send} className="btn-primary shrink-0 px-5">
                {c.send}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {hasResults && (
                <button
                  type="button"
                  onClick={resetMatch}
                  className="btn-ghost text-xs"
                >
                  {c.clearResults}
                </button>
              )}
              <button
                type="button"
                onClick={clearChat}
                className="text-xs text-ink-muted hover:underline"
              >
                {c.clearChat}
              </button>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-ink-muted hover:underline"
                >
                  {c.clearHistory}
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-2 scroll-mt-24">
          <div className="card-static sticky top-28 max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="section-title text-base">{c.panelTitle}</h2>
              {hasResults && (
                <button
                  type="button"
                  onClick={resetMatch}
                  className="btn-ghost shrink-0 px-3 py-2 text-xs"
                >
                  {c.clearResults}
                </button>
              )}
            </div>

            {!showPanel && !showAnalyzing ? (
              <p className="text-sm text-ink-muted">{c.panelEmpty}</p>
            ) : (
              <>
                {detectedFields.length > 0 && (
                <div className="rounded-xl border border-stone-200/80 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="mono-label mb-3">{c.profileTitle}</p>
                  <div className="space-y-2 text-xs">
                    {detectedFields.map(([key, qKey]) => (
                      <label key={key} className="flex items-center gap-2">
                        <span className="w-14 shrink-0 text-ink-muted">
                          {c.profileFields[key]}
                        </span>
                        <select
                          value={profile[key] ?? ""}
                          onChange={(e) =>
                            updateProfile(
                              key,
                              e.target.value as ExtractedProfile[typeof key] | ""
                            )
                          }
                          className="flex-1 rounded-md border border-stone-200/80 bg-white px-2 py-1 dark:border-white/10 dark:bg-slate-900"
                        >
                          {Object.entries(
                            t.questions[qKey].options as Record<string, string>
                          ).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-ink-faint">{c.profileEditHint}</p>
                </div>
                )}

                {showAnalyzing && (
                  <p className="rounded-lg border border-dashed border-stone-200/80 bg-stone-50/50 px-3 py-4 text-center text-sm text-ink-muted dark:border-white/10 dark:bg-white/[0.02]">
                    {c.panelAnalyzing}
                  </p>
                )}

                {strictNoMatch && (
                  <p
                    className="rounded-lg border border-amber-300/60 bg-amber-50/90 px-3 py-4 text-sm leading-relaxed text-amber-950 dark:border-amber-500/35 dark:bg-amber-950/35 dark:text-amber-100"
                    role="status"
                  >
                    {c.noStrictMatch}
                  </p>
                )}

                {hasResults && (
                  <>
                    <div>
                      <p className="mono-label mb-3">{c.matchResultsTitle}</p>
                      <div className="space-y-3">
                        {results.map((r) => (
                          <MatchCard
                            key={r.id}
                            r={r}
                            locale={locale}
                            t={t}
                            isZh={isZh}
                            scenario={profile.scenario}
                            writePromptLabel={dict.workflow.writePrompt}
                          />
                        ))}
                      </div>
                      <ModelBatchActions
                        locale={locale}
                        dict={dict}
                        modelIds={results
                          .map((r) => r.catalogId)
                          .filter((id): id is string => Boolean(id))}
                        scenario={profile.scenario}
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <p className="mono-label mb-2">{c.compareTitle}</p>
                      <p className="mb-2 text-[10px] text-ink-faint">{c.compareHint}</p>
                      <table className="w-full min-w-[16rem] text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-200/80 dark:border-white/10">
                            <th className="py-2 pr-2">{c.compareModel}</th>
                            <th className="py-2 pr-2">{c.compareSpeed}</th>
                            <th className="py-2 pr-2">{c.compareChinese}</th>
                            <th className="py-2 pr-2">{c.compareCoding}</th>
                            <th className="py-2">{c.compareCost}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((r) => {
                            const m = MODEL_COMPARE_METRICS[r.id];
                            if (!m) return null;
                            return (
                              <tr
                                key={r.id}
                                className="border-b border-stone-100 dark:border-white/5"
                              >
                                <td className="py-2 pr-2 font-medium">
                                  {isZh ? r.name["zh-CN"] : r.name.en}
                                </td>
                                <td className="py-2 pr-2">
                                  {isZh ? m.speed["zh-CN"] : m.speed.en}
                                </td>
                                <td className="py-2 pr-2">
                                  {isZh ? m.chinese["zh-CN"] : m.chinese.en}
                                </td>
                                <td className="py-2 pr-2">
                                  {isZh ? m.coding["zh-CN"] : m.coding.en}
                                </td>
                                <td className="py-2">
                                  {isZh ? m.cost["zh-CN"] : m.cost.en}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold">{c.historyTitle}</h2>
          <ul className="mt-2 space-y-1 text-xs text-ink-muted">
            {history.map((h) => (
              <li key={h.id} className="truncate">
                {new Date(h.updatedAt).toLocaleString(isZh ? "zh-CN" : "en")} —{" "}
                {h.preview || "—"}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="benchmark-disclosure mt-10" role="contentinfo">
        <h2 className="font-semibold">{t.disclaimerTitle}</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
          {t.disclaimerBody}
        </p>
        <p className="mt-3 font-mono text-xs opacity-80">
          {t.lastUpdated.replace("{date}", MATCH_LAST_UPDATED)}
        </p>
        <p className="mt-3">
          <Link
            href={`/${locale}/disclaimer`}
            className="font-mono text-xs font-semibold underline underline-offset-2"
          >
            {dict.footer.readMore} →
          </Link>
        </p>
      </footer>
    </div>
  );
}

function MatchCard({
  r,
  locale,
  t,
  isZh,
  scenario,
  writePromptLabel,
}: {
  r: MatchResult;
  locale: Locale;
  t: Dictionary["modelMatch"];
  isZh: boolean;
  scenario?: Scenario;
  writePromptLabel: string;
}) {
  const labelSep = isZh ? "：" : ": ";
  const promptHref = r.catalogId
    ? buildPromptsUrl(locale, {
        scene: scenario ? matchScenarioToPromptScene(scenario) : undefined,
        models: [r.catalogId],
      })
    : null;

  return (
    <article className="rounded-xl border border-stone-200/80 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{isZh ? r.name["zh-CN"] : r.name.en}</h3>
          <p className="text-xs text-ink-muted">
            {isZh ? r.vendor["zh-CN"] : r.vendor.en}
          </p>
        </div>
        <span className="rounded-md bg-jade/10 px-2 py-0.5 text-[10px] font-medium text-jade dark:text-emerald-400">
          {t.matchLevelLabel}{labelSep}{levelLabel(r.matchLevel, t)}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        {isZh ? r.description["zh-CN"] : r.description.en}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {r.scenes.map((s) => (
          <span
            key={s.en}
            className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] dark:bg-white/10"
          >
            {isZh ? s["zh-CN"] : s.en}
          </span>
        ))}
      </div>
      <p
        className="mt-2 text-[10px] text-ink-faint"
        title={isZh ? r.dataSourceDetail["zh-CN"] : r.dataSourceDetail.en}
      >
        {t.dataSourceLabel}{labelSep}{isZh ? r.dataSource["zh-CN"] : r.dataSource.en}
      </p>
      {r.catalogId && (
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/models/${r.catalogId}`}
            className="match-result-action-link text-xs font-medium text-cinnabar hover:underline dark:text-tech-cyan"
          >
            {t.catalogLink} →
          </Link>
          {promptHref ? (
            <Link
              href={promptHref}
              className="match-result-action-link text-xs font-medium text-cyan-700 hover:underline dark:text-cyan-400"
            >
              {writePromptLabel} →
            </Link>
          ) : null}
        </div>
      )}
    </article>
  );
}
