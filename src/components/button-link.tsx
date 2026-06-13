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
      ? "bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-strong)]"
      : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[#cbd5ce] hover:bg-[var(--surface-subtle)]";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${styles}`}
      href={href}
    >
      {children}
    </Link>
  );
}
