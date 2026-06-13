import type { AIProvider } from "@/lib/ai/contracts";
import { runRoutedAITask } from "@/lib/ai/orchestrator";
import {
  createToolLog,
  getQuizQuestionById,
  getTranscriptByVideoId,
  getVideoById,
  saveLearnerAnswer,
} from "@/lib/db/demo-store";
import type { LearnerAnswer } from "@/lib/types";

export class AnswerGradingService {
  constructor(private readonly provider?: AIProvider) {}

  async grade(questionId: string, answer: string): Promise<LearnerAnswer> {
    const question = getQuizQuestionById(questionId);
    if (!question) {
      throw new Error("Quiz question not found.");
    }

    const video = getVideoById(question.videoId);
    if (!video) {
      throw new Error("Video not found.");
    }

    const evidence = getTranscriptByVideoId(question.videoId).filter(
      (segment) =>
        segment.endSec > question.sourceStartSec &&
        segment.startSec < question.sourceEndSec,
    );
    const startedAt = performance.now();
    const input = {
      question,
      learnerAnswer: answer,
      evidence,
    };
    const feedback = this.provider
      ? await this.provider.gradeAnswer(input)
      : (await runRoutedAITask("misconception", (provider) => provider.gradeAnswer(input))).result;

    const start = feedback.recommendedStartSec;
    const end = feedback.recommendedEndSec;
    if (
      start !== undefined &&
      end !== undefined &&
      (start < 0 || end <= start || end > (video.durationSeconds ?? Number.POSITIVE_INFINITY))
    ) {
      throw new Error("AI provider returned a timestamp outside the source video.");
    }

    const learnerAnswer = saveLearnerAnswer({
      id: `answer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      questionId,
      answer,
      ...feedback,
      createdAt: new Date().toISOString(),
    });

    createToolLog({
      tool: "Local",
      operation: "Store graded answer",
      status: "success",
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputSummary: `Recorded ${learnerAnswer.status} answer feedback.`,
    });

    return learnerAnswer;
  }
}
