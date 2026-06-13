import type {
  AIProvider,
  AnswerQuestionInput,
  AnswerQuestionResult,
  GenerateChaptersInput,
  GeneratePracticeInput,
  GenerateQuizInput,
  GradeAnswerInput,
  SummarizeConceptInput,
  SummarizeConceptResult,
} from "@/lib/ai/contracts";
import { demoChapters, demoQuizQuestions, demoWrongAnswerFeedback } from "@/lib/db/demo-data";
import { createToolLog } from "@/lib/db/demo-store";
import type { Chapter, PracticeTask, QuizQuestion } from "@/lib/types";

export class MockAIAdapter implements AIProvider {
  readonly name = "Mock" as const;

  async generateChapters(input: GenerateChaptersInput): Promise<Chapter[]> {
    return this.logged("Generate chapters", () =>
      demoChapters.filter((chapter) => chapter.videoId === input.video.id),
    );
  }

  async answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionResult> {
    return this.logged("Answer question", () => ({
      answer:
        input.evidence.length > 0
          ? "Context caching reuses prior context or computation, while model routing chooses which model should handle a task."
          : "I could not find enough transcript evidence to answer that confidently.",
      evidence: input.evidence.map((segment) => ({
        startSec: segment.startSec,
        endSec: segment.endSec,
        reason: segment.reason ?? "Relevant transcript evidence",
      })),
      confidence: input.evidence.length > 0 ? "high" : "low",
      followUpSuggestions: ["How does each strategy reduce cost?"],
    }));
  }

  async generateQuiz(input: GenerateQuizInput): Promise<QuizQuestion[]> {
    return this.logged("Generate quiz", () =>
      demoQuizQuestions
        .filter((question) => question.videoId === input.video.id)
        .slice(0, input.count ?? 3),
    );
  }

  async gradeAnswer(input: GradeAnswerInput) {
    void input;
    return this.logged("Grade answer", () => ({
      status: demoWrongAnswerFeedback.status,
      misconception: demoWrongAnswerFeedback.misconception,
      explanation: demoWrongAnswerFeedback.explanation!,
      recommendedStartSec: demoWrongAnswerFeedback.recommendedStartSec,
      recommendedEndSec: demoWrongAnswerFeedback.recommendedEndSec,
      followUpQuestion: demoWrongAnswerFeedback.followUpQuestion,
    }));
  }

  async generatePractice(input: GeneratePracticeInput): Promise<PracticeTask> {
    return this.logged("Generate practice", () => ({
      title: `Practice: ${input.concept}`,
      instructions: "Write one sentence that distinguishes caching from routing, then give one use case for each.",
      successCriteria: ["Defines what is reused", "Defines what is selected", "Uses the terms accurately"],
    }));
  }

  async summarizeConcept(input: SummarizeConceptInput): Promise<SummarizeConceptResult> {
    return this.logged("Summarize concept", () => ({
      summary: `${input.concept} is explained using the selected timestamped transcript evidence.`,
      keyPoints: input.evidence.flatMap((segment) => segment.concepts).slice(0, 3),
    }));
  }

  private async logged<T>(operation: string, callback: () => T): Promise<T> {
    const startedAt = performance.now();
    const result = callback();
    createToolLog({
      tool: "Local",
      operation: `Mock AI · ${operation}`,
      status: "success",
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputSummary: "Returned deterministic mock output.",
    });
    return result;
  }
}
