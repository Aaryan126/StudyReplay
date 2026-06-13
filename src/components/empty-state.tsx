type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-[#cfd8d2] bg-[var(--surface-subtle)] p-6 text-center">
      <div>
        <div className="mx-auto size-8 rounded-full border-2 border-[#b8c8be] bg-white" />
        <p className="mt-3 font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
    </div>
  );
}
