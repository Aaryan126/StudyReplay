import { GET, POST } from "@/app/api/videos/[id]/quiz/route";
import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";
import { getQuizQuestionsByVideoId } from "@/lib/db/demo-store";

describe("quiz route", () => {
  it("generates grounded questions and stores their expected answers internally", async () => {
    const response = await POST(
      new Request(`http://localhost/api/videos/${DEMO_VIDEO_ID}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 3 }),
      }),
      { params: Promise.resolve({ id: DEMO_VIDEO_ID }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(3);
    expect(body.data.every((question: { sourceEndSec: number; sourceStartSec: number }) => question.sourceEndSec > question.sourceStartSec)).toBe(true);
    expect(body.data.every((question: { expectedAnswer?: string }) => question.expectedAnswer === undefined)).toBe(true);
    expect(getQuizQuestionsByVideoId(DEMO_VIDEO_ID).every((question) => question.expectedAnswer.length > 0)).toBe(true);
  });

  it("lists the current public quiz", async () => {
    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: DEMO_VIDEO_ID }),
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it("rejects invalid question counts", async () => {
    const response = await POST(
      new Request("http://localhost", { method: "POST", body: JSON.stringify({ count: 10 }) }),
      { params: Promise.resolve({ id: DEMO_VIDEO_ID }) },
    );
    expect(response.status).toBe(400);
  });
});
