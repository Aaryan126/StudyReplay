import {
  getTranscriptByVideoId,
  getVideoById,
} from "@/lib/db/demo-store";
import type {
  RegisterVideoInput,
  VideoMemoryProvider,
  VideoRegistrationResult,
} from "@/lib/video-memory/contracts";
import { TranscriptSearchService } from "@/server/services/transcript-search-service";

export class LocalVideoMemoryAdapter implements VideoMemoryProvider {
  readonly name = "Local" as const;
  private readonly searchService = new TranscriptSearchService();

  async registerVideo(_input: RegisterVideoInput): Promise<VideoRegistrationResult> {
    void _input;
    throw new Error("Local video registration is not supported.");
  }

  async getTranscript(videoId: string) {
    return getTranscriptByVideoId(videoId);
  }

  async search(videoId: string, query: string, topK: number) {
    if (!getVideoById(videoId)) return [];
    return this.searchService.search(videoId, query, { topK }).segments;
  }
}
