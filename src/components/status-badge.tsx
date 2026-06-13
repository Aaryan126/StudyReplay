type StatusBadgeProps = {
  label: string;
  tone?: "success" | "warning" | "neutral";
};

const tones = {
  success: "border-[#c6dfd0] bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  warning: "border-[#f0d5a8] bg-[var(--warning-soft)] text-[var(--warning)]",
  neutral: "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted)]",
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
