import { POST } from "@/app/api/quiz/[questionId]/answer/route";
import { demoVideo } from "@/lib/db/demo-data";
import { AnswerGradingService } from "@/server/services/answer-grading-service";
import type { AIProvider } from "@/lib/ai/contracts";

function answerRequest(answer: string) {
  return new Request("http://localhost/api/quiz/question/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
}

describe("answer grading route", () => {
  it("returns the known caching versus routing misconception", async () => {
    const response = await POST(
      answerRequest("Context caching chooses the cheapest model for each request."),
      { params: Promise.resolve({ questionId: "quiz-cache-routing" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.status).toBe("incorrect");
    expect(body.data.misconception).toMatch(/context caching vs model routing/i);
    expect(body.data.recommendedStartSec).toBe(194);
    expect(body.data.followUpQuestion).toMatch(/what does context caching reuse/i);
  });

  it("returns correct feedback without a misconception warning", async () => {
    const response = await POST(
      answerRequest("Caching reuses prior computation, while routing selects which model handles the task."),
      { params: Promise.resolve({ questionId: "quiz-cache-routing" }) },
    );
    const body = await response.json();
    expect(body.data.status).toBe("correct");
    expect(body.data.misconception).toBeUndefined();
  });

  it("returns nuanced partial feedback", async () => {
    const response = await POST(
      answerRequest("Context caching reuses previously processed context."),
      { params: Promise.resolve({ questionId: "quiz-cache-routing" }) },
    );
    const body = await response.json();
    expect(body.data.status).toBe("partial");
    expect(body.data.explanation).toMatch(/needs both/i);
  });

  it("rejects provider timestamps outside the video duration", async () => {
    const invalidProvider = {
      name: "Mock",
      gradeAnswer: vi.fn(async () => ({
        status: "incorrect" as const,
        misconception: "Invalid",
        explanation: "Invalid timestamp",
        recommendedStartSec: demoVideo.durationSeconds! + 1,
        recommendedEndSec: demoVideo.durationSeconds! + 10,
      })),
    } as unknown as AIProvider;

    await expect(
      new AnswerGradingService(invalidProvider).grade(
        "quiz-cache-routing",
        "wrong",
      ),
    ).rejects.toThrow(/outside the source video/i);
  });
});
