import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { listVideos } from "@/lib/db/demo-store";
import { formatTimestamp } from "@/lib/utils/time";

export default function VideosPage() {
  const videos = listVideos();

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Video library</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Choose a lesson to replay.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">The local demo is pre-indexed so every screen works without external credentials.</p>
          </div>
          <StatusBadge label="Mock data active" tone="success" />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {videos.map((video) => (
            <Link className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_10px_35px_rgba(36,60,46,0.06)] transition-transform hover:-translate-y-1" href={`/videos/${video.id}`} key={video.id}>
              <div className="grid min-h-52 place-items-center bg-[radial-gradient(circle_at_50%_30%,#345f49,#17231d_68%)] text-white">
                <span className="grid size-14 place-items-center rounded-full bg-white pl-1 text-xl text-[var(--accent-strong)] shadow-xl">▶</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">Demo workshop</p>
                  <span className="text-xs font-bold tabular-nums text-[var(--muted)]">{formatTimestamp(video.durationSeconds ?? 0)}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight group-hover:text-[var(--accent)]">{video.title}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{video.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
