import { EmptyState } from "@/components/empty-state";

export type TimelineItem = {
  id: string;
  tool: string;
  operation: string;
  status: "pending" | "success" | "failed";
  latencyMs?: number;
  outputSummary?: string;
};

export function ToolCallTimeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="No tool calls yet" description="Sponsor and local operations will be visible here." />;
  }

  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li className="relative flex gap-3" key={item.id}>
          {index < items.length - 1 ? <span className="absolute left-[5px] top-4 h-[calc(100%+8px)] w-px bg-[var(--border)]" /> : null}
          <span className={`relative mt-1 size-3 shrink-0 rounded-full border-2 border-white ${item.status === "success" ? "bg-[var(--accent)]" : item.status === "failed" ? "bg-red-500" : "bg-amber-500"}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold">{item.tool} <span className="font-normal text-[var(--muted)]">· {item.operation}</span></p>
              {item.latencyMs !== undefined ? <span className="text-xs tabular-nums text-[var(--muted)]">{item.latencyMs} ms</span> : null}
            </div>
            {item.outputSummary ? <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.outputSummary}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
