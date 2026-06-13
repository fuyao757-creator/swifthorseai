export default function ModelDetailLoading() {
  return (
    <div className="animate-pulse space-y-8 py-4">
      <div className="h-48 rounded-2xl bg-blue-100/60 dark:bg-white/5" />
      <div className="flex gap-3">
        <div className="h-12 w-32 rounded-xl bg-blue-100/60 dark:bg-white/5" />
        <div className="h-12 w-40 rounded-xl bg-blue-100/60 dark:bg-white/5" />
      </div>
      <div className="h-40 rounded-2xl bg-blue-100/40 dark:bg-white/5" />
    </div>
  );
}
