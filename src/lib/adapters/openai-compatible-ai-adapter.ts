import type { z } from "zod";

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
import type { AIProviderConfig } from "@/lib/ai/provider-config";
import { assertRealProviderConfig } from "@/lib/ai/provider-config";
import { withTimeoutAndRetry } from "@/lib/ai/resiliency";
import {
  answerFeedbackSchema,
  answerQuestionResultSchema,
  chaptersSchema,
  conceptSummarySchema,
  parseStructuredOutput,
  practiceTaskSchema,
  quizQuestionsSchema,
} from "@/lib/ai/schemas";
import { createToolLog } from "@/lib/db/demo-store";
import type { Chapter, PracticeTask, QuizQuestion, ToolName } from "@/lib/types";

type FetchLike = typeof fetch;

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export abstract class OpenAICompatibleAIAdapter implements AIProvider {
  abstract readonly name: "Kimi" | "TokenRouter";
  protected abstract readonly toolName: ToolName;

  constructor(
    protected readonly config: AIProviderConfig,
    private readonly fetcher: FetchLike = fetch,
  ) {
    assertRealProviderConfig(config);
  }

  generateChapters(input: GenerateChaptersInput): Promise<Chapter[]> {
    return this.request("Generate chapters", chaptersSchema, {
      task: "Generate timestamped chapters from this transcript.",
      input,
    });
  }

  answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionResult> {
    return this.request("Answer question", answerQuestionResultSchema, {
      task: "Answer only from the supplied timestamped evidence. Admit uncertainty when evidence is weak.",
      input,
    });
  }

  generateQuiz(input: GenerateQuizInput): Promise<QuizQuestion[]> {
    return this.request("Generate quiz", quizQuestionsSchema, {
      task: "Generate grounded quiz questions with source timestamps.",
      input,
    });
  }

  gradeAnswer(input: GradeAnswerInput) {
    return this.request("Grade answer", answerFeedbackSchema, {
      task: "Grade the learner answer and identify a specific misconception with a source timestamp.",
      input,
    });
  }

  generatePractice(input: GeneratePracticeInput): Promise<PracticeTask> {
    return this.request("Generate practice", practiceTaskSchema, {
      task: "Generate a short targeted practice task from the misconception and evidence.",
      input,
    });
  }

  summarizeConcept(input: SummarizeConceptInput): Promise<SummarizeConceptResult> {
    return this.request("Summarize concept", conceptSummarySchema, {
      task: "Summarize the concept concisely using only the supplied evidence.",
      input,
    });
  }

  protected async request<T>(operation: string, schema: z.ZodType<T>, payload: unknown): Promise<T> {
    const startedAt = performance.now();

    try {
      const raw = await withTimeoutAndRetry(
        async (signal) => {
          const response = await this.fetcher(`${this.config.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.config.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: this.config.model,
              messages: [
                {
                  role: "system",
                  content: "You are StudyReplay's server-side tutoring engine. Return valid JSON only, matching the requested structure. Never invent timestamps outside the supplied evidence.",
                },
                { role: "user", content: JSON.stringify(payload) },
              ],
              temperature: 0.2,
            }),
            signal,
          });

          if (!response.ok) {
            throw new Error(`${this.name} request failed with status ${response.status}.`);
          }

          const body = (await response.json()) as ChatCompletionResponse;
          const content = body.choices?.[0]?.message?.content;
          if (!content) {
            throw new Error(`${this.name} returned an empty response.`);
          }
          return content;
        },
        { timeoutMs: this.config.timeoutMs, maxRetries: this.config.maxRetries },
      );

      const result = parseStructuredOutput(raw, schema);
      this.log(operation, "success", startedAt, "Validated structured response.");
      return result;
    } catch (error) {
      this.log(operation, "failed", startedAt, error instanceof Error ? error.message : "Unknown provider error");
      throw error;
    }
  }

  private log(
    operation: string,
    status: "success" | "failed",
    startedAt: number,
    outputSummary: string,
  ) {
    createToolLog({
      tool: this.toolName,
      operation,
      status,
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputSummary,
    });
  }
}
