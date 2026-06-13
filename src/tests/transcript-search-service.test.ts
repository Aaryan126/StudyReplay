import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";
import type { TranscriptSegment } from "@/lib/types";
import { formatRetrievedSegment } from "@/lib/utils/evidence";
import { TranscriptSearchService } from "@/server/services/transcript-search-service";

describe("TranscriptSearchService", () => {
  const service = new TranscriptSearchService();

  it.each([
    ["context caching", "segment-caching"],
    ["model routing", "segment-routing"],
    ["agent sandbox", "segment-sandbox"],
  ])("maps %s to its expected segment", (query, expectedSegmentId) => {
    const result = service.search(DEMO_VIDEO_ID, query);
    expect(result.segments[0]?.segmentId).toBe(expectedSegmentId);
    expect(result.confidence).toBe("high");
  });

  it("returns top-k segments sorted by descending score", () => {
    const result = service.search(DEMO_VIDEO_ID, "cost latency model caching", { topK: 3 });
    expect(result.segments.length).toBeLessThanOrEqual(3);
    expect(result.segments).toEqual(
      [...result.segments].sort((left, right) => right.score - left.score || left.startSec - right.startSec),
    );
  });

  it("returns low confidence and no evidence for an unknown query", () => {
    expect(service.search(DEMO_VIDEO_ID, "photosynthesis chlorophyll")).toEqual({
      query: "photosynthesis chlorophyll",
      confidence: "low",
      segments: [],
    });
  });

  it("never returns invalid timestamp ranges", () => {
    const result = service.search(DEMO_VIDEO_ID, "tool orchestration", { topK: 6 });
    expect(result.segments.length).toBeGreaterThan(0);
    expect(result.segments.every((segment) => segment.endSec > segment.startSec)).toBe(true);
  });

  it("ignores invalid source segments", () => {
    const invalidFixture: TranscriptSegment[] = [
      {
        id: "invalid",
        videoId: "video",
        startSec: 20,
        endSec: 10,
        text: "context caching",
        concepts: ["context caching"],
      },
    ];
    const invalidService = new TranscriptSearchService(() => invalidFixture);
    expect(invalidService.search("video", "context caching").segments).toEqual([]);
  });

  it("formats evidence with a timestamp label", () => {
    const segment = service.search(DEMO_VIDEO_ID, "context caching").segments[0]!;
    const evidence = formatRetrievedSegment(segment);
    expect(evidence.label).toBe("03:14–04:02");
    expect(evidence.reason).toMatch(/concept match/i);
  });
});
