import { z } from "zod";

export const chapterSchema = z.object({
  id: z.string().min(1),
  videoId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  startSec: z.number().nonnegative(),
  endSec: z.number().positive(),
  keyConcepts: z.array(z.string().min(1)),
}).refine((value) => value.endSec > value.startSec, {
  message: "Chapter endSec must be greater than startSec",
});

export const chaptersSchema = z.array(chapterSchema);

export const answerQuestionResultSchema = z.object({
  answer: z.string().min(1),
  evidence: z.array(z.object({
    startSec: z.number().nonnegative(),
    endSec: z.number().positive(),
    reason: z.string().min(1),
  }).refine((value) => value.endSec > value.startSec, {
    message: "Evidence endSec must be greater than startSec",
  })),
  confidence: z.enum(["high", "medium", "low"]),
  followUpSuggestions: z.array(z.string().min(1)),
});

export const quizQuestionSchema = z.object({
  id: z.string().min(1),
  videoId: z.string().min(1),
  chapterId: z.string().min(1).optional(),
  question: z.string().min(1),
  type: z.enum(["short_answer", "multiple_choice", "true_false", "code"]),
  options: z.array(z.string()).optional(),
  expectedAnswer: z.string().min(1),
  sourceStartSec: z.number().nonnegative(),
  sourceEndSec: z.number().positive(),
  difficulty: z.enum(["easy", "medium", "hard"]),
}).refine((value) => value.sourceEndSec > value.sourceStartSec, {
  message: "Quiz sourceEndSec must be greater than sourceStartSec",
});

export const quizQuestionsSchema = z.array(quizQuestionSchema);

export const answerFeedbackSchema = z.object({
  status: z.enum(["correct", "partial", "incorrect", "unclear"]),
  misconception: z.string().optional(),
  explanation: z.string().min(1),
  recommendedStartSec: z.number().nonnegative().optional(),
  recommendedEndSec: z.number().positive().optional(),
  followUpQuestion: z.string().optional(),
}).refine(
  (value) =>
    value.recommendedStartSec === undefined ||
    value.recommendedEndSec === undefined ||
    value.recommendedEndSec > value.recommendedStartSec,
  { message: "Feedback timestamp range is invalid" },
);

export const practiceTaskSchema = z.object({
  title: z.string().min(1),
  instructions: z.string().min(1),
  starterCode: z.string().optional(),
  successCriteria: z.array(z.string().min(1)).min(1),
});

export const conceptSummarySchema = z.object({
  summary: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(1),
});

export function parseStructuredOutput<T>(raw: string, schema: z.ZodType<T>): T {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI provider returned invalid JSON.");
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI provider returned an invalid response: ${result.error.issues[0]?.message ?? "schema mismatch"}`);
  }

  return result.data;
}
