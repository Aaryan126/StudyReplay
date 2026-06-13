import { formatTimestamp } from "@/lib/utils/time";

type VideoPlayerProps = {
  title: string;
  durationSeconds?: number;
};

export function VideoPlayer({ title, durationSeconds = 0 }: VideoPlayerProps) {
  return (
    <section aria-label="Video player" className="overflow-hidden rounded-2xl border border-[#26362d] bg-[#17231d] shadow-[0_18px_50px_rgba(23,35,29,0.16)]">
      <div className="flex min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#345f49,#17231d_68%)] p-8 text-center text-white sm:min-h-[390px]">
        <div>
          <button aria-label={`Play ${title}`} className="mx-auto grid size-16 cursor-pointer place-items-center rounded-full bg-white pl-1 text-2xl text-[var(--accent-strong)] shadow-2xl transition-transform hover:scale-105" type="button">
            ▶
          </button>
          <p className="mt-5 text-sm font-semibold text-white/90">{title}</p>
          <p className="mt-2 text-xs text-white/55">Video preview placeholder</p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3 text-xs text-white/65">
        <span>00:00</span>
        <div className="h-1 flex-1 rounded-full bg-white/15">
          <div className="h-1 w-[18%] rounded-full bg-[#70c698]" />
        </div>
        <span>{formatTimestamp(durationSeconds)}</span>
      </div>
    </section>
  );
}
