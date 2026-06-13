import { BackLink } from "./BackLink";

export function PageHeader({
  badge,
  title,
  subtitle,
  code,
  backHref,
  backLabel,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  code?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="mb-12 animate-slide-up lg:mb-16">
      {backHref && backLabel && (
        <BackLink href={backHref} label={backLabel} />
      )}
      <div className="glass-hero relative">
        <div className="relative px-8 py-12 sm:px-12 sm:py-14 lg:px-14 lg:py-16">
          {(badge || code) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {badge && <span className="badge">{badge}</span>}
              {code && <span className="mono-label">{code}</span>}
            </div>
          )}
          <div className="accent-rule mt-5" />
          <h1 className="display-hero mt-7 max-w-4xl">{title}</h1>
          {subtitle && (
            <p className="section-subtitle mt-6 max-w-2xl text-xl">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
