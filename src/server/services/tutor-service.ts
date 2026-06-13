import type { AIProvider, AnswerQuestionResult } from "@/lib/ai/contracts";
import { createAIProvider } from "@/lib/ai/provider-factory";
import { createToolLog, getVideoById } from "@/lib/db/demo-store";
import { VideoMemoryService } from "@/server/services/video-memory-service";

export type AskVideoResult = AnswerQuestionResult & {
  provider: AIProvider["name"] | "Local";
  latencyMs: number;
};

export class TutorService {
  constructor(
    private readonly videoMemory = new VideoMemoryService(),
    private readonly provider: AIProvider = createAIProvider(),
  ) {}

  async ask(videoId: string, question: string): Promise<AskVideoResult> {
    const video = getVideoById(videoId);
    if (!video) {
      throw new Error("Video not found.");
    }

    const startedAt = performance.now();
    const segments = await this.videoMemory.search(videoId, question, 3);
    const retrievalLatencyMs = Math.max(0, Math.round(performance.now() - startedAt));

    createToolLog({
      tool: "Local",
      operation: "Search timestamped transcript",
      status: "success",
      latencyMs: retrievalLatencyMs,
      inputSummary: question.slice(0, 120),
      outputSummary:
        segments.length > 0
          ? `Found ${segments.length} evidence segment(s).`
          : "No sufficiently relevant transcript evidence found.",
    });

    if (segments.length === 0) {
      return {
        answer:
          "I could not find enough evidence in this video to answer that confidently. Try asking about a concept covered in the chapter map.",
        evidence: [],
        confidence: "low",
        followUpSuggestions: [
          "What is context caching?",
          "How does model routing work?",
        ],
        provider: "Local",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      };
    }

    const response = await this.provider.answerQuestion({
      video,
      question,
      evidence: segments,
    });

    return {
      ...response,
      provider: this.provider.name,
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
    };
  }
}
