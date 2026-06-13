import { notFound } from "next/navigation";

import { VideoWorkspace } from "@/components/video-workspace";
import { demoTutorResponse, demoWrongAnswerFeedback } from "@/lib/db/demo-data";
import {
  getChaptersByVideoId,
  getQuizQuestionsByVideoId,
  getVideoById,
  listToolLogs,
} from "@/lib/db/demo-store";

type VideoWorkspacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoWorkspacePage({ params }: VideoWorkspacePageProps) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  return (
    <VideoWorkspace
      chapters={getChaptersByVideoId(video.id)}
      feedback={{
        misconception: demoWrongAnswerFeedback.misconception!,
        explanation: demoWrongAnswerFeedback.explanation!,
        startSec: demoWrongAnswerFeedback.recommendedStartSec!,
        endSec: demoWrongAnswerFeedback.recommendedEndSec!,
        followUpQuestion: demoWrongAnswerFeedback.followUpQuestion,
      }}
      logs={listToolLogs()}
      question={getQuizQuestionsByVideoId(video.id)[0]}
      tutor={demoTutorResponse}
      video={video}
    />
  );
}
