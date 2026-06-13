import { POST } from "@/app/api/videos/[id]/ask/route";
import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";

function askRequest(body: unknown) {
  return new Request(`http://localhost/api/videos/${DEMO_VIDEO_ID}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("ask-video route", () => {
  it("accepts a grounded question and returns timestamp evidence", async () => {
    const response = await POST(askRequest({ question: "What is context caching?" }), {
      params: Promise.resolve({ id: DEMO_VIDEO_ID }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.answer).toMatch(/context caching/i);
    expect(body.data.evidence[0]).toMatchObject({ startSec: 194, endSec: 242 });
    expect(body.data.confidence).toBe("high");
  });

  it("rejects an empty question", async () => {
    const response = await POST(askRequest({ question: " " }), {
      params: Promise.resolve({ id: DEMO_VIDEO_ID }),
    });
    expect(response.status).toBe(400);
  });

  it("returns honest uncertainty when no evidence is found", async () => {
    const response = await POST(askRequest({ question: "How does photosynthesis work?" }), {
      params: Promise.resolve({ id: DEMO_VIDEO_ID }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.confidence).toBe("low");
    expect(body.data.evidence).toEqual([]);
    expect(body.data.answer).toMatch(/could not find enough evidence/i);
  });

  it("returns 404 for an unknown video", async () => {
    const response = await POST(askRequest({ question: "What is caching?" }), {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(response.status).toBe(404);
  });
});
