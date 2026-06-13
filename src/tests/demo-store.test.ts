import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";
import {
  createToolLog,
  findTranscriptSegments,
  getChaptersByVideoId,
  getQuizQuestionsByVideoId,
  getTranscriptByVideoId,
  getVideoById,
  listToolLogs,
} from "@/lib/db/demo-store";

describe("demo store", () => {
  it("loads the demo video and its related data", () => {
    expect(getVideoById(DEMO_VIDEO_ID)?.title).toBe("Building Fast AI Systems");
    expect(getChaptersByVideoId(DEMO_VIDEO_ID)).toHaveLength(5);
    expect(getTranscriptByVideoId(DEMO_VIDEO_ID)).toHaveLength(6);
    expect(getQuizQuestionsByVideoId(DEMO_VIDEO_ID)).toHaveLength(3);
  });

  it("filters transcript fixtures by literal text or concept", () => {
    const results = findTranscriptSegments(DEMO_VIDEO_ID, "context caching");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((segment) => segment.concepts.includes("context caching"))).toBe(true);
    expect(findTranscriptSegments(DEMO_VIDEO_ID, "not in this workshop")).toEqual([]);
  });

  it("creates and lists tool logs", () => {
    const before = listToolLogs().length;
    const created = createToolLog({
      tool: "Local",
      operation: "Test operation",
      status: "success",
      outputSummary: "Test output",
    });

    expect(created.id).toBeTruthy();
    expect(listToolLogs()).toHaveLength(before + 1);
  });
});
