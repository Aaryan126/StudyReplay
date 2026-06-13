import {
  demoChapters,
  demoQuizQuestions,
  demoTranscriptSegments,
  demoVideo,
  initialToolLogs,
} from "@/lib/db/demo-data";
import type { ToolCallLog } from "@/lib/types";

const toolLogs = [...initialToolLogs];

export function listVideos() {
  return [demoVideo];
}

export function getVideoById(videoId: string) {
  return videoId === demoVideo.id ? demoVideo : undefined;
}

export function getChaptersByVideoId(videoId: string) {
  return demoChapters.filter((chapter) => chapter.videoId === videoId);
}

export function getTranscriptByVideoId(videoId: string) {
  return demoTranscriptSegments.filter((segment) => segment.videoId === videoId);
}

export function findTranscriptSegments(videoId: string, term: string) {
  const normalizedTerm = term.trim().toLowerCase();

  if (!normalizedTerm) {
    return [];
  }

  return getTranscriptByVideoId(videoId).filter((segment) =>
    `${segment.text} ${segment.concepts.join(" ")}`.toLowerCase().includes(normalizedTerm),
  );
}

export function getQuizQuestionsByVideoId(videoId: string) {
  return demoQuizQuestions.filter((question) => question.videoId === videoId);
}

export function listToolLogs() {
  return [...toolLogs];
}

export function createToolLog(input: Omit<ToolCallLog, "id" | "createdAt">) {
  const log: ToolCallLog = {
    ...input,
    id: `log-${toolLogs.length + 1}`,
    createdAt: new Date().toISOString(),
  };

  toolLogs.push(log);
  return log;
}
