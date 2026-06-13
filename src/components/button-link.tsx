import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[#4b4bc4]"
      : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-slate-50";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${styles}`}
      href={href}
    >
      {children}
    </Link>
  );
}
