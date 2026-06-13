import { createToolLog, getVideoById } from "@/lib/db/demo-store";
import type { RetrievedSegment, TranscriptSegment } from "@/lib/types";
import type { VideoDBConfig } from "@/lib/video-memory/config";
import { assertVideoDBConfig } from "@/lib/video-memory/config";
import type {
  RegisterVideoInput,
  VideoMemoryProvider,
  VideoRegistrationResult,
} from "@/lib/video-memory/contracts";

type FetchLike = typeof fetch;

type VideoDBSearchItem = {
  video_id?: string;
  start?: number;
  end?: number;
  text?: string;
  score?: number;
};

type VideoDBResponse = {
  success?: boolean;
  status?: string;
  data?: {
    id?: string;
    stream_url?: string;
    output_url?: string;
    transcript?: VideoDBSearchItem[];
    results?: VideoDBSearchItem[];
    shots?: VideoDBSearchItem[];
    docs?: VideoDBSearchItem[];
  };
};

export class VideoDBAdapter implements VideoMemoryProvider {
  readonly name = "VideoDB" as const;

  constructor(
    private readonly config: VideoDBConfig,
    private readonly fetcher: FetchLike = fetch,
  ) {
    assertVideoDBConfig(config);
  }

  async registerVideo(input: RegisterVideoInput): Promise<VideoRegistrationResult> {
    const body = await this.request(
      `/collection/${encodeURIComponent(this.config.collectionId)}/upload`,
      {
        method: "POST",
        body: JSON.stringify({ url: input.url, name: input.name, media_type: "video" }),
      },
      "Register video",
    );
    const videoDbId = body.data?.id;
    if (!videoDbId) {
      throw new Error("VideoDB registration did not return a video ID.");
    }
    return {
      videoDbId,
      collectionId: this.config.collectionId,
      status: body.status === "processing" ? "processing" : "ready",
      streamUrl: body.data?.stream_url,
    };
  }

  async getTranscript(videoId: string): Promise<TranscriptSegment[]> {
    const externalId = this.resolveVideoId(videoId);
    const body = await this.request(
      `/video/${encodeURIComponent(externalId)}/transcription/?segmenter=sentence`,
      { method: "GET" },
      "Get transcript",
    );
    return (body.data?.transcript ?? [])
      .filter(isValidItem)
      .map((item, index) => ({
        id: `videodb-${externalId}-${index}`,
        videoId,
        startSec: item.start!,
        endSec: item.end!,
        text: item.text!,
        concepts: [],
      }));
  }

  async search(videoId: string, query: string, topK: number): Promise<RetrievedSegment[]> {
    const externalId = this.resolveVideoId(videoId);
    const body = await this.request(
      `/video/${encodeURIComponent(externalId)}/search/`,
      {
        method: "POST",
        body: JSON.stringify({
          query,
          index_type: "spoken_word",
          search_type: "semantic",
          score_threshold: 0.2,
          result_threshold: topK,
        }),
      },
      "Search transcript",
    );
    const raw = body.data?.results ?? body.data?.shots ?? body.data?.docs ?? [];
    return raw
      .filter(isValidItem)
      .map((item, index) => ({
        segmentId: `videodb-${externalId}-${item.start}-${index}`,
        startSec: item.start!,
        endSec: item.end!,
        text: item.text!,
        score: item.score ?? 0,
        reason: "VideoDB semantic spoken-word match",
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, topK);
  }

  private resolveVideoId(videoId: string) {
    const mapped = getVideoById(videoId)?.videoDbId;
    const externalId = mapped || this.config.videoId;
    if (!externalId) {
      throw new Error("VideoDB requires a mapped videoDbId or VIDEODB_VIDEO_ID.");
    }
    return externalId;
  }

  private async request(path: string, init: RequestInit, operation: string) {
    const startedAt = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetcher(`${this.config.baseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": this.config.apiKey!,
          ...init.headers,
        },
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`VideoDB request failed with status ${response.status}.`);
      }
      const body = (await response.json()) as VideoDBResponse;
      if (body.success === false) {
        throw new Error("VideoDB returned an unsuccessful response.");
      }
      createToolLog({
        tool: "VideoDB",
        operation,
        status: "success",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
        outputSummary: "VideoDB request completed.",
      });
      return body;
    } catch (error) {
      createToolLog({
        tool: "VideoDB",
        operation,
        status: "failed",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
        outputSummary: error instanceof Error ? error.message : "VideoDB request failed.",
      });
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

function isValidItem(item: VideoDBSearchItem) {
  return (
    typeof item.start === "number" &&
    typeof item.end === "number" &&
    item.end > item.start &&
    typeof item.text === "string" &&
    item.text.length > 0
  );
}
