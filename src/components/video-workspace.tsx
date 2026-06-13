import Link from "next/link";

import { ChapterList, type ChapterListItem } from "@/components/chapter-list";
import { MisconceptionFeedback } from "@/components/misconception-feedback";
import { PageShell } from "@/components/page-shell";
import { Panel } from "@/components/panel";
import { QuizPanel } from "@/components/quiz-panel";
import { StatusBadge } from "@/components/status-badge";
import { ToolCallTimeline } from "@/components/tool-call-timeline";
import { TutorPanel } from "@/components/tutor-panel";
import { VideoPlayer } from "@/components/video-player";
import type { ToolCallLog } from "@/lib/types";

type VideoWorkspaceProps = {
  video: { id: string; title: string; durationSeconds?: number; status: string };
  chapters?: ChapterListItem[];
  question?: { question: string; sourceStartSec: number; sourceEndSec: number };
  tutor?: { answer: string; evidence: { startSec: number; endSec: number; reason: string; transcript?: string } };
  feedback?: { misconception: string; explanation: string; startSec: number; endSec: number; followUpQuestion?: string };
  logs?: ToolCallLog[];
};

export function VideoWorkspace({ video, chapters = [], question, tutor, feedback, logs = [] }: VideoWorkspaceProps) {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link className="text-sm font-semibold text-[var(--accent)] hover:underline" href="/videos">← Video library</Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{video.title}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Watch, ask, test, and replay the moment that matters.</p>
          </div>
          <StatusBadge label={video.status === "ready" ? "Ready to learn" : video.status} tone="success" />
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
          <div className="space-y-5">
            <VideoPlayer durationSeconds={video.durationSeconds} title={video.title} />
            {feedback ? <MisconceptionFeedback {...feedback} /> : null}
            <Panel description="Jump directly to a concept" title="Chapter map">
              <ChapterList chapters={chapters} />
            </Panel>
          </div>

          <div className="space-y-5">
            <TutorPanel {...tutor} />
            <QuizPanel {...question} />
            <Panel description="How the answer was assembled" title="Orchestration log">
              <ToolCallTimeline items={logs} />
            </Panel>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
