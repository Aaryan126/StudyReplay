import type {
  Chapter,
  LearnerAnswer,
  PracticeTask,
  QuizQuestion,
  RetrievedSegment,
  TranscriptSegment,
  Video,
} from "@/lib/types";

export type AnswerQuestionInput = {
  video: Video;
  question: string;
  evidence: RetrievedSegment[];
};

export type AnswerQuestionResult = {
  answer: string;
  evidence: Array<{
    startSec: number;
    endSec: number;
    reason: string;
  }>;
  confidence: "high" | "medium" | "low";
  followUpSuggestions: string[];
};

export type GenerateChaptersInput = {
  video: Video;
  transcript: TranscriptSegment[];
};

export type GenerateQuizInput = {
  video: Video;
  chapters: Chapter[];
  transcript: TranscriptSegment[];
  count?: number;
};

export type GradeAnswerInput = {
  question: QuizQuestion;
  learnerAnswer: string;
  evidence: TranscriptSegment[];
};

export type GeneratePracticeInput = {
  concept: string;
  misconception?: string;
  evidence: TranscriptSegment[];
};

export type SummarizeConceptInput = {
  concept: string;
  evidence: TranscriptSegment[];
};

export type SummarizeConceptResult = {
  summary: string;
  keyPoints: string[];
};

export interface AIProvider {
  readonly name: "Mock" | "Kimi" | "TokenRouter";
  generateChapters(input: GenerateChaptersInput): Promise<Chapter[]>;
  answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionResult>;
  generateQuiz(input: GenerateQuizInput): Promise<QuizQuestion[]>;
  gradeAnswer(input: GradeAnswerInput): Promise<Omit<LearnerAnswer, "id" | "questionId" | "answer" | "createdAt">>;
  generatePractice(input: GeneratePracticeInput): Promise<PracticeTask>;
  summarizeConcept(input: SummarizeConceptInput): Promise<SummarizeConceptResult>;
}
