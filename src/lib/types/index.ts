export type ProviderMode = "mock" | "real";

export type Video = {
  id: string;
  title: string;
  description: string;
  sourceType: "upload" | "url" | "demo";
  sourceUrl?: string;
  videoDbId?: string;
  status: "uploaded" | "indexing" | "ready" | "failed";
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
};

export type TranscriptSegment = {
  id: string;
  videoId: string;
  startSec: number;
  endSec: number;
  text: string;
  concepts: string[];
  embeddingId?: string;
};

export type RetrievedSegment = {
  segmentId: string;
  startSec: number;
  endSec: number;
  text: string;
  score: number;
  reason?: string;
};

export type RetrievalConfidence = "high" | "medium" | "low";

export type TranscriptSearchResult = {
  query: string;
  confidence: RetrievalConfidence;
  segments: RetrievedSegment[];
};

export type Chapter = {
  id: string;
  videoId: string;
  title: string;
  summary: string;
  startSec: number;
  endSec: number;
  keyConcepts: string[];
};

export type QuizQuestion = {
  id: string;
  videoId: string;
  chapterId?: string;
  question: string;
  type: "short_answer" | "multiple_choice" | "true_false" | "code";
  options?: string[];
  expectedAnswer: string;
  sourceStartSec: number;
  sourceEndSec: number;
  difficulty: "easy" | "medium" | "hard";
};

export type LearnerAnswer = {
  id: string;
  questionId: string;
  answer: string;
  status: "correct" | "partial" | "incorrect" | "unclear";
  misconception?: string;
  explanation?: string;
  recommendedStartSec?: number;
  recommendedEndSec?: number;
  followUpQuestion?: string;
  createdAt: string;
};

export type ToolName = "VideoDB" | "Kimi" | "Daytona" | "TokenRouter" | "Nosana" | "Local";

export type ToolCallLog = {
  id: string;
  tool: ToolName;
  operation: string;
  status: "pending" | "success" | "failed";
  latencyMs?: number;
  inputSummary?: string;
  outputSummary?: string;
  createdAt: string;
};

export type DemoTutorResponse = {
  answer: string;
  evidence: {
    startSec: number;
    endSec: number;
    reason: string;
    transcript: string;
  };
};

export type PracticeTask = {
  title: string;
  instructions: string;
  starterCode?: string;
  successCriteria: string[];
};
