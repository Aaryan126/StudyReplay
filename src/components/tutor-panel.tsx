import { EmptyState } from "@/components/empty-state";
import { Panel } from "@/components/panel";
import { TimestampEvidenceCard } from "@/components/timestamp-evidence-card";

type TutorPanelProps = {
  answer?: string;
  evidence?: { startSec: number; endSec: number; reason: string; transcript?: string };
};

export function TutorPanel({ answer, evidence }: TutorPanelProps) {
  return (
    <Panel description="Grounded in the lecture transcript" title="Ask StudyReplay">
      {answer ? (
        <div>
          <div className="rounded-xl bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[#3d4941]">{answer}</div>
          {evidence ? <div className="mt-4"><TimestampEvidenceCard {...evidence} /></div> : null}
        </div>
      ) : (
        <EmptyState title="Ask about this lesson" description="Your answer and timestamp evidence will appear here." />
      )}
      <form className="mt-4 flex gap-2">
        <input aria-label="Ask a question" className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#98a29b] focus:border-[#8cb8a0]" placeholder="What is context caching?" />
        <button className="cursor-pointer rounded-xl bg-[var(--accent)] px-4 text-sm font-bold text-white hover:bg-[var(--accent-strong)]" type="button">Ask</button>
      </form>
    </Panel>
  );
}
