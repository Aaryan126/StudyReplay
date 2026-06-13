import { formatTimestampRange } from "@/lib/utils/time";

type TimestampEvidenceCardProps = {
  startSec: number;
  endSec: number;
  reason: string;
  transcript?: string;
  onSelect?: (startSec: number) => void;
};

export function TimestampEvidenceCard({ startSec, endSec, reason, transcript, onSelect }: TimestampEvidenceCardProps) {
  return (
    <article className="rounded-xl border border-[#c9ded2] bg-[var(--accent-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">Video evidence</p>
          <p className="mt-1 text-sm font-semibold">{reason}</p>
        </div>
        <button className="cursor-pointer rounded-full bg-[var(--accent)] px-3.5 py-2 text-xs font-bold tabular-nums text-white hover:bg-[var(--accent-strong)]" onClick={() => onSelect?.(startSec)} type="button">
          {formatTimestampRange(startSec, endSec)}
        </button>
      </div>
      {transcript ? <blockquote className="mt-3 border-l-2 border-[#9ac1aa] pl-3 text-sm leading-6 text-[#42604f]">“{transcript}”</blockquote> : null}
    </article>
  );
}
