type PanelProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, description, action, children, className = "" }: PanelProps) {
  return (
    <section className={`rounded-2xl border border-[var(--border)] bg-white shadow-[0_8px_30px_rgba(36,60,46,0.04)] ${className}`}>
      <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
        <div>
          <h2 className="font-bold tracking-tight">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[var(--muted)]">{description}</p> : null}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
