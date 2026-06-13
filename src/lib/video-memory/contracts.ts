import type { RetrievedSegment, TranscriptSegment } from "@/lib/types";

export type RegisterVideoInput = {
  url: string;
  name?: string;
};

export type VideoRegistrationResult = {
  videoDbId: string;
  collectionId: string;
  status: "ready" | "processing";
  streamUrl?: string;
};

export interface VideoMemoryProvider {
  readonly name: "VideoDB" | "Local";
  registerVideo(input: RegisterVideoInput): Promise<VideoRegistrationResult>;
  getTranscript(videoId: string): Promise<TranscriptSegment[]>;
  search(videoId: string, query: string, topK: number): Promise<RetrievedSegment[]>;
}
