"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-bg flex min-h-screen flex-col items-center justify-center px-6">
      <div className="glass-hero max-w-md px-10 py-12 text-center">
        <p className="mono-label">ERROR</p>
        <h1 className="display-title mt-4 text-2xl text-blue-900 dark:text-white">
          Page failed to load
        </h1>
        <p className="mt-3 text-sm text-blue-600 dark:text-stone-400">
          Please try again or return home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="btn-primary">
            Retry
          </button>
          <Link href="/zh-CN" className="btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
