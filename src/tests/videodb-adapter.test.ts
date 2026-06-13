import { MockVideoDBAdapter } from "@/lib/adapters/mock-videodb-adapter";
import { VideoDBAdapter } from "@/lib/adapters/videodb-adapter";
import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";
import { listToolLogs } from "@/lib/db/demo-store";
import { createVideoMemoryProvider } from "@/lib/video-memory/provider-factory";
import type { VideoMemoryProvider } from "@/lib/video-memory/contracts";
import { VideoMemoryService } from "@/server/services/video-memory-service";

const config = {
  mode: "videodb" as const,
  apiKey: "secret",
  baseUrl: "https://api.videodb.io",
  collectionId: "default",
  videoId: "m-demo",
  timeoutMs: 100,
};

describe("VideoDB integration", () => {
  it("runs in mock mode and records VideoDB logs", async () => {
    const before = listToolLogs().length;
    const results = await new MockVideoDBAdapter().search(
      DEMO_VIDEO_ID,
      "context caching",
      3,
    );
    expect(results[0]?.startSec).toBe(194);
    expect(listToolLogs()).toHaveLength(before + 1);
    expect(listToolLogs().at(-1)?.tool).toBe("VideoDB");
  });

  it("maps VideoDB search responses to internal retrieved segments", async () => {
    const fetcher = vi.fn(async () =>
      new Response(
        JSON.stringify({
          success: true,
          data: {
            results: [
              { video_id: "m-demo", start: 194, end: 242, text: "Context caching reuses work.", score: 0.94 },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ) as typeof fetch;
    const results = await new VideoDBAdapter(config, fetcher).search(
      DEMO_VIDEO_ID,
      "context caching",
      3,
    );
    expect(results).toEqual([
      expect.objectContaining({ startSec: 194, endSec: 242, score: 0.94 }),
    ]);
  });

  it("maps VideoDB transcripts to internal transcript segments", async () => {
    const fetcher = vi.fn(async () =>
      new Response(
        JSON.stringify({
          success: true,
          data: { transcript: [{ start: 10, end: 20, text: "Transcript text" }] },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ) as typeof fetch;
    const transcript = await new VideoDBAdapter(config, fetcher).getTranscript(DEMO_VIDEO_ID);
    expect(transcript[0]).toMatchObject({ videoId: DEMO_VIDEO_ID, startSec: 10, endSec: 20 });
  });

  it("registers a video URL in the configured collection", async () => {
    const fetcher = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ "x-access-token": "secret" });
      expect(init?.body).toContain("https://example.com/lecture.mp4");
      return new Response(
        JSON.stringify({
          success: true,
          data: { id: "m-new", stream_url: "https://stream.videodb.io/v/new" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }) as typeof fetch;
    const result = await new VideoDBAdapter(config, fetcher).registerVideo({
      url: "https://example.com/lecture.mp4",
      name: "Lecture",
    });
    expect(result).toMatchObject({ videoDbId: "m-new", collectionId: "default", status: "ready" });
  });

  it("handles empty VideoDB responses", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ success: true, data: { results: [] } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as typeof fetch;
    await expect(
      new VideoDBAdapter(config, fetcher).search(DEMO_VIDEO_ID, "query", 3),
    ).resolves.toEqual([]);
  });

  it("falls back to local retrieval after provider failure", async () => {
    const failingProvider = {
      name: "VideoDB",
      search: vi.fn(async () => { throw new Error("unavailable"); }),
      getTranscript: vi.fn(async () => { throw new Error("unavailable"); }),
      registerVideo: vi.fn(),
    } as VideoMemoryProvider;
    const results = await new VideoMemoryService(failingProvider).search(
      DEMO_VIDEO_ID,
      "model routing",
      3,
    );
    expect(results[0]?.segmentId).toBe("segment-routing");
    expect(listToolLogs().at(-1)?.operation).toMatch(/fallback/i);
  });

  it("selects the configured video memory provider", () => {
    expect(createVideoMemoryProvider({ VIDEO_MEMORY_PROVIDER: "mock" }).name).toBe("VideoDB");
    expect(createVideoMemoryProvider({ VIDEO_MEMORY_PROVIDER: "local" }).name).toBe("Local");
    expect(
      createVideoMemoryProvider({
        VIDEO_MEMORY_PROVIDER: "videodb",
        VIDEODB_API_KEY: "test",
        VIDEODB_VIDEO_ID: "m-demo",
      }).name,
    ).toBe("VideoDB");
  });
});
