import type { AIProvider } from "@/lib/ai/contracts";
import { runRoutedAITask } from "@/lib/ai/orchestrator";
import { createStableCacheKey, responseCache } from "@/lib/cache/response-cache";
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
  constructor(private readonly provider?: AIProvider) {}

  async generate(videoId: string, count = 3): Promise<PublicQuizQuestion[]> {
    const video = getVideoById(videoId);
    if (!video) {
      throw new Error("Video not found.");
    }

    const startedAt = performance.now();
    const input = {
      video,
      chapters: getChaptersByVideoId(videoId),
      transcript: getTranscriptByVideoId(videoId),
      count,
    };
    const cacheKey = createStableCacheKey("quiz", { videoId, count });
    let questions = responseCache.get<QuizQuestion[]>(cacheKey);
    if (questions) {
      createToolLog({
        tool: "TokenRouter",
        operation: "Cache hit · quiz",
        status: "success",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
        outputSummary: `Returned ${questions.length} cached question(s).`,
      });
    } else {
      createToolLog({
        tool: "TokenRouter",
        operation: "Cache miss · quiz",
        status: "success",
        latencyMs: 0,
        outputSummary: "No matching quiz was cached; routing generation.",
      });
      const routed = this.provider
        ? { result: await this.provider.generateQuiz(input) }
        : await runRoutedAITask("quiz", (provider) => provider.generateQuiz(input));
      questions = responseCache.set(cacheKey, routed.result);
    }
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
