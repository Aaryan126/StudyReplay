import Link from "next/link";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-white">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        >
          <Link className="text-lg font-bold tracking-tight" href="/">
            StudyReplay
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium text-[var(--muted)]">
            <Link className="hover:text-[var(--foreground)]" href="/videos">
              Videos
            </Link>
            <Link className="hover:text-[var(--foreground)]" href="/demo">
              Demo
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
