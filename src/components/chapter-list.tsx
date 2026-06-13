import { EmptyState } from "@/components/empty-state";
import { formatTimestamp } from "@/lib/utils/time";

export type ChapterListItem = {
  id: string;
  title: string;
  summary?: string;
  startSec: number;
};

export function ChapterList({ chapters }: { chapters: ChapterListItem[] }) {
  if (chapters.length === 0) {
    return <EmptyState title="No chapters yet" description="Chapters will appear after the video is indexed." />;
  }

  return (
    <ol className="space-y-1">
      {chapters.map((chapter, index) => (
        <li key={chapter.id}>
          <button className="group flex w-full cursor-pointer items-start gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-[var(--surface-subtle)]" type="button">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold group-hover:text-[var(--accent)]">{chapter.title}</span>
              {chapter.summary ? <span className="mt-1 block text-sm leading-5 text-[var(--muted)]">{chapter.summary}</span> : null}
            </span>
            <span className="rounded-full bg-[#eef2ef] px-2.5 py-1 text-xs font-bold tabular-nums text-[var(--accent-strong)]">
              {formatTimestamp(chapter.startSec)}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
