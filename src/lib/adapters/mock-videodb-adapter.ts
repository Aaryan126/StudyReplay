import { createToolLog } from "@/lib/db/demo-store";
import { LocalVideoMemoryAdapter } from "@/lib/adapters/local-video-memory-adapter";
import type {
  RegisterVideoInput,
  VideoMemoryProvider,
  VideoRegistrationResult,
} from "@/lib/video-memory/contracts";

export class MockVideoDBAdapter implements VideoMemoryProvider {
  readonly name = "VideoDB" as const;
  private readonly local = new LocalVideoMemoryAdapter();

  async registerVideo(input: RegisterVideoInput): Promise<VideoRegistrationResult> {
    const result = {
      videoDbId: "m-mock-studyreplay",
      collectionId: "mock",
      status: "ready" as const,
      streamUrl: input.url,
    };
    this.log("Register video", "Mock registration completed.");
    return result;
  }

  async getTranscript(videoId: string) {
    const transcript = await this.local.getTranscript(videoId);
    this.log("Get transcript", `Returned ${transcript.length} local fallback segments.`);
    return transcript;
  }

  async search(videoId: string, query: string, topK: number) {
    const segments = await this.local.search(videoId, query, topK);
    this.log("Search transcript", `Found ${segments.length} timestamped segment(s) in mock mode.`);
    return segments;
  }

  private log(operation: string, outputSummary: string) {
    createToolLog({
      tool: "VideoDB",
      operation: `Mock · ${operation}`,
      status: "success",
      latencyMs: 0,
      outputSummary,
    });
  }
}
