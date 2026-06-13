import { KimiAdapter } from "@/lib/adapters/kimi-adapter";
import { MockAIAdapter } from "@/lib/adapters/mock-ai-adapter";
import { createAIProvider } from "@/lib/ai/provider-factory";
import { parseStructuredOutput, answerQuestionResultSchema } from "@/lib/ai/schemas";
import { DEMO_VIDEO_ID, demoChapters, demoTranscriptSegments, demoVideo } from "@/lib/db/demo-data";
import { listToolLogs } from "@/lib/db/demo-store";
import { TranscriptSearchService } from "@/server/services/transcript-search-service";

describe("AI adapter layer", () => {
  const search = new TranscriptSearchService();

  it("returns valid structured outputs from the mock adapter", async () => {
    const provider = new MockAIAdapter();
    const evidence = search.search(DEMO_VIDEO_ID, "context caching").segments;
    const answer = await provider.answerQuestion({ video: demoVideo, question: "What is context caching?", evidence });
    const quiz = await provider.generateQuiz({ video: demoVideo, chapters: demoChapters, transcript: demoTranscriptSegments });
    const feedback = await provider.gradeAnswer({ question: quiz[0]!, learnerAnswer: "It picks a model", evidence: demoTranscriptSegments });

    expect(answerQuestionResultSchema.parse(answer).confidence).toBe("high");
    expect(quiz.length).toBeGreaterThan(0);
    expect(feedback.status).toBe("incorrect");
  });

  it("rejects malformed JSON and schema-invalid outputs", () => {
    expect(() => parseStructuredOutput("not-json", answerQuestionResultSchema)).toThrow(/invalid json/i);
    expect(() => parseStructuredOutput(JSON.stringify({ answer: "missing fields" }), answerQuestionResultSchema)).toThrow(/invalid response/i);
  });

  it("selects providers from environment configuration", () => {
    expect(createAIProvider({ AI_PROVIDER: "mock" }).name).toBe("Mock");
    expect(createAIProvider({ AI_PROVIDER: "kimi", KIMI_API_KEY: "test", KIMI_MODEL: "test-model" }).name).toBe("Kimi");
    expect(createAIProvider({ AI_PROVIDER: "tokenrouter", TOKENROUTER_API_KEY: "test", TOKENROUTER_BASE_URL: "https://example.test/v1", TOKENROUTER_MODEL: "test-model" }).name).toBe("TokenRouter");
  });

  it("fails clearly when a real provider is missing credentials", () => {
    expect(() => createAIProvider({ AI_PROVIDER: "kimi" })).toThrow(/api key/i);
    expect(() => createAIProvider({ AI_PROVIDER: "tokenrouter", TOKENROUTER_API_KEY: "test", TOKENROUTER_BASE_URL: "https://example.test/v1" })).toThrow(/model name/i);
  });

  it("sends credentials only in server-side authorization headers and validates responses", async () => {
    const fetcher = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ Authorization: "Bearer secret-key" });
      expect(init?.body).not.toContain("secret-key");
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({
          answer: "Caching reuses prior work.",
          evidence: [{ startSec: 194, endSec: 242, reason: "Definition" }],
          confidence: "high",
          followUpSuggestions: ["What is routing?"],
        }) } }],
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }) as typeof fetch;

    const adapter = new KimiAdapter({
      provider: "kimi",
      apiKey: "secret-key",
      baseUrl: "https://example.test/v1",
      model: "test-model",
      timeoutMs: 100,
      maxRetries: 0,
    }, fetcher);

    const result = await adapter.answerQuestion({
      video: demoVideo,
      question: "What is caching?",
      evidence: search.search(DEMO_VIDEO_ID, "context caching").segments,
    });
    expect(result.confidence).toBe("high");
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("returns a controlled timeout error and records a failed log", async () => {
    const before = listToolLogs().length;
    const fetcher = vi.fn((_url: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      }),
    ) as typeof fetch;
    const adapter = new KimiAdapter({
      provider: "kimi",
      apiKey: "test",
      baseUrl: "https://example.test/v1",
      model: "test-model",
      timeoutMs: 5,
      maxRetries: 0,
    }, fetcher);

    await expect(adapter.summarizeConcept({ concept: "caching", evidence: demoTranscriptSegments })).rejects.toThrow(/timed out/i);
    expect(listToolLogs()).toHaveLength(before + 1);
    expect(listToolLogs().at(-1)?.status).toBe("failed");
  });

  it("retries a transient provider failure", async () => {
    const validContent = JSON.stringify({
      summary: "Caching reuses prior work.",
      keyPoints: ["Reuse context", "Reduce latency"],
    });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("temporary failure", { status: 503 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ choices: [{ message: { content: validContent } }] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ) as typeof fetch;
    const adapter = new KimiAdapter({
      provider: "kimi",
      apiKey: "test",
      baseUrl: "https://example.test/v1",
      model: "test-model",
      timeoutMs: 100,
      maxRetries: 1,
    }, fetcher);

    await expect(adapter.summarizeConcept({ concept: "caching", evidence: demoTranscriptSegments })).resolves.toMatchObject({
      summary: "Caching reuses prior work.",
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("records mock adapter calls in the tool log", async () => {
    const before = listToolLogs().length;
    await new MockAIAdapter().generatePractice({ concept: "context caching", evidence: demoTranscriptSegments });
    expect(listToolLogs()).toHaveLength(before + 1);
    expect(listToolLogs().at(-1)?.operation).toMatch(/mock ai/i);
  });
});
