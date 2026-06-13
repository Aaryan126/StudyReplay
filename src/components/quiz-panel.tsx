import { EmptyState } from "@/components/empty-state";
import { Panel } from "@/components/panel";
import { formatTimestampRange } from "@/lib/utils/time";

type QuizPanelProps = {
  question?: string;
  sourceStartSec?: number;
  sourceEndSec?: number;
};

export function QuizPanel({ question, sourceStartSec, sourceEndSec }: QuizPanelProps) {
  const hasTimestamp = sourceStartSec !== undefined && sourceEndSec !== undefined;

  return (
    <Panel action={<span className="rounded-full bg-[#eef2ef] px-2.5 py-1 text-xs font-bold text-[var(--muted)]">1 of 3</span>} description="Check understanding, not memory" title="Knowledge check">
      {question ? (
        <div>
          <p className="text-base font-semibold leading-7">{question}</p>
          {hasTimestamp ? <p className="mt-2 text-xs font-bold text-[var(--accent)]">Source: {formatTimestampRange(sourceStartSec, sourceEndSec)}</p> : null}
          <textarea aria-label="Quiz answer" className="mt-4 min-h-24 w-full resize-none rounded-xl border border-[var(--border)] p-3 text-sm outline-none placeholder:text-[#98a29b] focus:border-[#8cb8a0]" placeholder="Explain in your own words..." />
          <button className="mt-3 w-full cursor-pointer rounded-xl bg-[#18231d] px-4 py-3 text-sm font-bold text-white hover:bg-[#26372e]" type="button">Check my answer</button>
        </div>
      ) : (
        <EmptyState title="Ready for a knowledge check?" description="Generate a focused question from this video." />
      )}
    </Panel>
  );
}
