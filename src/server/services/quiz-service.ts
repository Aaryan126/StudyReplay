import type { AIProvider } from "@/lib/ai/contracts";
import { createAIProvider } from "@/lib/ai/provider-factory";
import {
  createToolLog,
  getChaptersByVideoId,
  getQuizQuestionsByVideoId,
  getTranscriptByVideoId,
  getVideoById,
  saveGeneratedQuiz,
} from "@/lib/db/demo-store";
import type { PublicQuizQuestion, QuizQuestion } from "@/lib/types";

function toPublicQuestion({ expectedAnswer: _expectedAnswer, ...question }: QuizQuestion): PublicQuizQuestion {
  void _expectedAnswer;
  return question;
}

export class QuizService {
  constructor(private readonly provider: AIProvider = createAIProvider()) {}

  async generate(videoId: string, count = 3): Promise<PublicQuizQuestion[]> {
    const video = getVideoById(videoId);
    if (!video) {
      throw new Error("Video not found.");
    }

    const startedAt = performance.now();
    const questions = await this.provider.generateQuiz({
      video,
      chapters: getChaptersByVideoId(videoId),
      transcript: getTranscriptByVideoId(videoId),
      count,
    });
    const validQuestions = questions
      .filter(
        (question) =>
          question.videoId === videoId &&
          question.sourceEndSec > question.sourceStartSec,
      )
      .slice(0, count);

    if (validQuestions.length === 0) {
      throw new Error("Quiz provider returned no valid questions.");
    }

    saveGeneratedQuiz(videoId, validQuestions);
    createToolLog({
      tool: "Local",
      operation: "Store generated quiz",
      status: "success",
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputSummary: `Stored ${validQuestions.length} timestamp-grounded question(s).`,
    });

    return validQuestions.map(toPublicQuestion);
  }

  list(videoId: string): PublicQuizQuestion[] {
    if (!getVideoById(videoId)) {
      throw new Error("Video not found.");
    }
    return getQuizQuestionsByVideoId(videoId).map(toPublicQuestion);
  }
}
