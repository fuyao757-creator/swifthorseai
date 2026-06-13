const LOGO_SRC = "/logos/swift-horse.png?v=5";

export function SiteLogo({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Swift Horse"
      width={size}
      height={size}
      className={`block max-h-full max-w-full object-contain ${className}`}
      decoding="async"
    />
  );
}

export function SiteLogoBadge({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-11 w-11" : "h-12 w-12";
  const logoPx = size === "sm" ? 38 : 44;
  const logoClass = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <div
      className={`logo-cosmos ${box} ${className}`}
      aria-label="Swift Horse"
    >
      <span className="logo-cosmos__aurora" aria-hidden />
      <span className="logo-cosmos__stars" aria-hidden />
      <span className="logo-cosmos__glow" aria-hidden />
      <SiteLogo
        size={logoPx}
        className={`logo-cosmos__horse ${logoClass}`}
      />
    </div>
  );
}
