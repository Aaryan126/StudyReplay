import type {
  Chapter,
  DemoTutorResponse,
  LearnerAnswer,
  QuizQuestion,
  ToolCallLog,
  TranscriptSegment,
  Video,
} from "@/lib/types";

export const DEMO_VIDEO_ID = "building-fast-ai-systems";

export const demoVideo: Video = {
  id: DEMO_VIDEO_ID,
  title: "Building Fast AI Systems",
  description: "A practical workshop on retrieval, model routing, caching, and safe agent execution.",
  sourceType: "demo",
  status: "ready",
  durationSeconds: 768,
  createdAt: "2026-06-13T04:00:00.000Z",
  updatedAt: "2026-06-13T04:00:00.000Z",
};

export const demoTranscriptSegments: TranscriptSegment[] = [
  {
    id: "segment-intro",
    videoId: DEMO_VIDEO_ID,
    startSec: 0,
    endSec: 76,
    text: "A fast AI product is not just a fast model. It is a system that retrieves less, routes deliberately, reuses work, and keeps slow operations off the critical path.",
    concepts: ["latency", "tool orchestration"],
  },
  {
    id: "segment-retrieval",
    videoId: DEMO_VIDEO_ID,
    startSec: 76,
    endSec: 194,
    text: "Timestamp retrieval narrows a long recording to the few transcript segments that directly support an answer. The timestamp is part of the evidence, not decoration.",
    concepts: ["video timestamp retrieval", "grounding", "evidence"],
  },
  {
    id: "segment-caching",
    videoId: DEMO_VIDEO_ID,
    startSec: 194,
    endSec: 242,
    text: "Context caching reuses previously processed context or computation. It reduces repeated token processing, latency, and cost when the same source material is used again.",
    concepts: ["context caching", "latency", "cost"],
  },
  {
    id: "segment-routing",
    videoId: DEMO_VIDEO_ID,
    startSec: 242,
    endSec: 356,
    text: "Model routing is a different decision. It chooses which model handles a task based on capability, speed, and cost. Routing selects a worker; caching avoids repeating work.",
    concepts: ["model routing", "context caching", "cost"],
  },
  {
    id: "segment-sandbox",
    videoId: DEMO_VIDEO_ID,
    startSec: 356,
    endSec: 492,
    text: "An agent sandbox isolates generated code from the application host. The agent writes files and executes tests inside a controlled environment with clear limits.",
    concepts: ["agent sandbox", "safe execution", "Daytona"],
  },
  {
    id: "segment-orchestration",
    videoId: DEMO_VIDEO_ID,
    startSec: 492,
    endSec: 768,
    text: "Reliable tool orchestration gives every provider one job, records latency and failure, and maintains a local fallback so one unavailable API never breaks the learning loop.",
    concepts: ["tool orchestration", "fallback", "observability"],
  },
];

export const demoChapters: Chapter[] = [
  {
    id: "chapter-system-speed",
    videoId: DEMO_VIDEO_ID,
    title: "Speed is a system property",
    summary: "Why end-to-end latency depends on more than model inference.",
    startSec: 0,
    endSec: 76,
    keyConcepts: ["latency", "tool orchestration"],
  },
  {
    id: "chapter-retrieval",
    videoId: DEMO_VIDEO_ID,
    title: "Timestamp retrieval",
    summary: "Grounding answers in precise transcript evidence.",
    startSec: 76,
    endSec: 194,
    keyConcepts: ["video timestamp retrieval", "grounding"],
  },
  {
    id: "chapter-cache-route",
    videoId: DEMO_VIDEO_ID,
    title: "Caching versus routing",
    summary: "Two optimizations that solve different system problems.",
    startSec: 194,
    endSec: 356,
    keyConcepts: ["context caching", "model routing"],
  },
  {
    id: "chapter-sandboxes",
    videoId: DEMO_VIDEO_ID,
    title: "Safe agent sandboxes",
    summary: "Executing generated practice code without risking the host.",
    startSec: 356,
    endSec: 492,
    keyConcepts: ["agent sandbox", "safe execution"],
  },
  {
    id: "chapter-orchestration",
    videoId: DEMO_VIDEO_ID,
    title: "Reliable orchestration",
    summary: "Clear provider roles, observability, and fallback paths.",
    startSec: 492,
    endSec: 768,
    keyConcepts: ["tool orchestration", "fallback"],
  },
];

export const demoQuizQuestions: QuizQuestion[] = [
  {
    id: "quiz-cache-routing",
    videoId: DEMO_VIDEO_ID,
    chapterId: "chapter-cache-route",
    question: "What is the difference between context caching and model routing?",
    type: "short_answer",
    expectedAnswer: "Context caching reuses prior context or computation, while model routing chooses which model handles a task based on capability, speed, or cost.",
    sourceStartSec: 194,
    sourceEndSec: 356,
    difficulty: "medium",
  },
  {
    id: "quiz-timestamp-evidence",
    videoId: DEMO_VIDEO_ID,
    chapterId: "chapter-retrieval",
    question: "Why should a timestamp be treated as evidence rather than decoration?",
    type: "short_answer",
    expectedAnswer: "It identifies the exact source segment supporting an answer so the learner can verify and revisit the teaching moment.",
    sourceStartSec: 76,
    sourceEndSec: 194,
    difficulty: "easy",
  },
  {
    id: "quiz-sandbox",
    videoId: DEMO_VIDEO_ID,
    chapterId: "chapter-sandboxes",
    question: "What risk does an agent sandbox reduce?",
    type: "multiple_choice",
    options: ["Slow video playback", "Unsafe execution on the application host", "Missing chapter titles", "Repeated transcript storage"],
    expectedAnswer: "Unsafe execution on the application host",
    sourceStartSec: 356,
    sourceEndSec: 492,
    difficulty: "easy",
  },
];

export const demoWrongAnswerFeedback: LearnerAnswer = {
  id: "answer-known-misconception",
  questionId: "quiz-cache-routing",
  answer: "Context caching is when the system chooses the cheapest model for each request.",
  status: "incorrect",
  misconception: "Context caching vs model routing",
  explanation: "Choosing a model is routing. Context caching instead reuses previously processed context or computation to reduce repeated work, latency, and cost.",
  recommendedStartSec: 194,
  recommendedEndSec: 356,
  followUpQuestion: "What does context caching reuse, and what does model routing choose?",
  createdAt: "2026-06-13T04:05:00.000Z",
};

export const demoTutorResponse: DemoTutorResponse = {
  answer: "Context caching and model routing both improve efficiency, but at different layers. Caching reuses prior work for repeated context. Routing selects the most appropriate model for the current task.",
  evidence: {
    startSec: 194,
    endSec: 356,
    reason: "This section defines both strategies and contrasts them directly.",
    transcript: "Routing selects a worker; caching avoids repeating work.",
  },
};

export const initialToolLogs: ToolCallLog[] = [
  {
    id: "log-local-video",
    tool: "Local",
    operation: "Load demo workspace",
    status: "success",
    latencyMs: 12,
    outputSummary: "Loaded one video, five chapters, and three quiz questions.",
    createdAt: "2026-06-13T04:05:01.000Z",
  },
  {
    id: "log-local-evidence",
    tool: "VideoDB",
    operation: "Mock · Search transcript",
    status: "success",
    latencyMs: 4,
    outputSummary: "Matched timestamped spoken-word evidence with local fallback data.",
    createdAt: "2026-06-13T04:05:02.000Z",
  },
];
