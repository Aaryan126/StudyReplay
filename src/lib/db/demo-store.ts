import {
  demoChapters,
  demoQuizQuestions,
  demoTranscriptSegments,
  demoVideo,
  initialToolLogs,
} from "@/lib/db/demo-data";
import type { LearnerAnswer, QuizQuestion, ToolCallLog } from "@/lib/types";

const toolLogs = [...initialToolLogs];
const generatedQuizzes = new Map<string, QuizQuestion[]>();
const learnerAnswers: LearnerAnswer[] = [];

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
  return (
    generatedQuizzes.get(videoId) ??
    demoQuizQuestions.filter((question) => question.videoId === videoId)
  );
}

export function saveGeneratedQuiz(videoId: string, questions: QuizQuestion[]) {
  const saved = questions.filter((question) => question.videoId === videoId);
  generatedQuizzes.set(videoId, saved);
  return [...saved];
}

export function getQuizQuestionById(questionId: string) {
  const generated = [...generatedQuizzes.values()].flat();
  return [...generated, ...demoQuizQuestions].find(
    (question) => question.id === questionId,
  );
}

export function saveLearnerAnswer(answer: LearnerAnswer) {
  learnerAnswers.push(answer);
  return answer;
}

export function listLearnerAnswers() {
  return [...learnerAnswers];
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
