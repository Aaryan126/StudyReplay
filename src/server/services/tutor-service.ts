import type { AIProvider, AnswerQuestionResult } from "@/lib/ai/contracts";
import { runRoutedAITask } from "@/lib/ai/orchestrator";
import { createStableCacheKey, responseCache } from "@/lib/cache/response-cache";
import { createToolLog, getVideoById } from "@/lib/db/demo-store";
import { VideoMemoryService } from "@/server/services/video-memory-service";

export type AskVideoResult = AnswerQuestionResult & {
  provider: AIProvider["name"] | "Local";
  latencyMs: number;
  cached: boolean;
};

export class TutorService {
  constructor(
    private readonly videoMemory = new VideoMemoryService(),
    private readonly provider?: AIProvider,
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
        cached: false,
      };
    }

    const cacheKey = createStableCacheKey("timestamp-explanation", {
      videoId,
      question: question.trim().toLowerCase(),
      evidence: segments.map(({ segmentId, startSec, endSec }) => ({ segmentId, startSec, endSec })),
    });
    const cached = responseCache.get<AskVideoResult>(cacheKey);
    if (cached) {
      createToolLog({
        tool: "TokenRouter",
        operation: "Cache hit · timestamp explanation",
        status: "success",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
        outputSummary: "Returned repeated explanation without another model call.",
      });
      return { ...cached, cached: true, latencyMs: Math.max(0, Math.round(performance.now() - startedAt)) };
    }

    createToolLog({
      tool: "TokenRouter",
      operation: "Cache miss · timestamp explanation",
      status: "success",
      latencyMs: 0,
      outputSummary: "No matching explanation was cached; routing to a provider.",
    });
    const input = { video, question, evidence: segments };
    const routed = this.provider
      ? { result: await this.provider.answerQuestion(input), provider: this.provider.name }
      : await runRoutedAITask("explanation", (provider) => provider.answerQuestion(input));

    const result: AskVideoResult = {
      ...routed.result,
      provider: routed.provider,
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      cached: false,
    };
    return responseCache.set(cacheKey, result);
  }
}
