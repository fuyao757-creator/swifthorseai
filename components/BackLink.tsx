import Link from "next/link";

export function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="back-link">
      <span className="back-link-icon" aria-hidden>
        ←
      </span>
      {label}
    </Link>
  );
}
