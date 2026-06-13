import Link from "next/link";
import type { ReactNode } from "react";

export function LegalNotice({
  children,
  linkHref,
  linkLabel,
}: {
  children: ReactNode;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div role="note" className="legal-notice">
      {children}
      {linkHref && linkLabel && (
        <p className="mt-2">
          <Link
            href={linkHref}
            className="font-mono text-xs font-semibold text-jade underline underline-offset-2 hover:text-jade-light"
          >
            {linkLabel} →
          </Link>
        </p>
      )}
    </div>
  );
}
