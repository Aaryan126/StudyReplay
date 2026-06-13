import { VideoWorkspace } from "@/components/video-workspace";
import {
  DEMO_VIDEO_ID,
  demoTutorResponse,
  demoWrongAnswerFeedback,
} from "@/lib/db/demo-data";
import {
  getChaptersByVideoId,
  getQuizQuestionsByVideoId,
  getVideoById,
  listToolLogs,
} from "@/lib/db/demo-store";

export default function DemoPage() {
  const video = getVideoById(DEMO_VIDEO_ID)!;
  const question = getQuizQuestionsByVideoId(video.id)[0];

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
      question={question}
      tutor={demoTutorResponse}
      video={video}
    />
  );
}
