export default function LocaleLoading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6">
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
        <div className="page-loading-bar h-full w-1/3 rounded-full bg-gradient-brand" />
      </div>
      <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
        Loading…
      </p>
    </div>
  );
}
