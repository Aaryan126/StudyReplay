import { LocalVideoMemoryAdapter } from "@/lib/adapters/local-video-memory-adapter";
import { createToolLog } from "@/lib/db/demo-store";
import { createVideoMemoryProvider } from "@/lib/video-memory/provider-factory";
import type {
  RegisterVideoInput,
  VideoMemoryProvider,
} from "@/lib/video-memory/contracts";

export class VideoMemoryService {
  private readonly fallback = new LocalVideoMemoryAdapter();

  constructor(
    private readonly provider: VideoMemoryProvider = createVideoMemoryProvider(),
  ) {}

  registerVideo(input: RegisterVideoInput) {
    return this.provider.registerVideo(input);
  }

  async getTranscript(videoId: string) {
    try {
      const transcript = await this.provider.getTranscript(videoId);
      return transcript.length > 0 ? transcript : this.fallback.getTranscript(videoId);
    } catch (error) {
      this.logFallback("Get transcript", error);
      return this.fallback.getTranscript(videoId);
    }
  }

  async search(videoId: string, query: string, topK: number) {
    try {
      const results = await this.provider.search(videoId, query, topK);
      if (results.length > 0) return results;
      createToolLog({
        tool: "Local",
        operation: "VideoDB empty-result fallback",
        status: "success",
        outputSummary: "VideoDB returned no evidence; local retrieval was used.",
      });
      return this.fallback.search(videoId, query, topK);
    } catch (error) {
      this.logFallback("Search transcript", error);
      return this.fallback.search(videoId, query, topK);
    }
  }

  private logFallback(operation: string, error: unknown) {
    createToolLog({
      tool: "Local",
      operation: `${operation} fallback`,
      status: "success",
      outputSummary: `Continued with local data after provider failure: ${error instanceof Error ? error.message : "unknown error"}`,
    });
  }
}
