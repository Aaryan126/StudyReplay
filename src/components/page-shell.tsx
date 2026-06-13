import Link from "next/link";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        >
          <Link className="flex items-center gap-2.5 text-lg font-bold tracking-tight" href="/">
            <span className="grid size-8 place-items-center rounded-xl bg-[var(--accent)] text-sm text-white">
              SR
            </span>
            <span>StudyReplay</span>
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
