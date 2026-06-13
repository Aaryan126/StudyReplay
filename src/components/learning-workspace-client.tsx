"use client";

import { useState } from "react";

import { QuizPanel } from "@/components/quiz-panel";
import { TutorPanel } from "@/components/tutor-panel";
import { VideoPlayer } from "@/components/video-player";

type LearningWorkspaceClientProps = {
  video: { id: string; title: string; durationSeconds?: number };
  tutor?: {
    answer: string;
    evidence: { startSec: number; endSec: number; reason: string; transcript?: string };
  };
};

export function LearningWorkspaceClient({ video, tutor }: LearningWorkspaceClientProps) {
  const [selectedTimeSec, setSelectedTimeSec] = useState(0);

  return (
    <>
      <div className="xl:col-start-1 xl:row-start-1">
        <VideoPlayer
          durationSeconds={video.durationSeconds}
          selectedTimeSec={selectedTimeSec}
          title={video.title}
        />
      </div>
      <div className="space-y-5 xl:col-start-2 xl:row-span-3 xl:row-start-1">
        <TutorPanel
          initialAnswer={tutor?.answer}
          initialEvidence={tutor?.evidence}
          onSelectTimestamp={setSelectedTimeSec}
          videoId={video.id}
        />
        <QuizPanel videoId={video.id} />
      </div>
    </>
  );
}
