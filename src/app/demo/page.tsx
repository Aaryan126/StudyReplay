import { VideoWorkspace } from "@/components/video-workspace";
import {
  DEMO_VIDEO_ID,
  demoTutorResponse,
  demoWrongAnswerFeedback,
} from "@/lib/db/demo-data";
import {
  getChaptersByVideoId,
  getVideoById,
  listToolLogs,
} from "@/lib/db/demo-store";

export default function DemoPage() {
  const video = getVideoById(DEMO_VIDEO_ID)!;
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
      tutor={demoTutorResponse}
      video={video}
    />
  );
}
