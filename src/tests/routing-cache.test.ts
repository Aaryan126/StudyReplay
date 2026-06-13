import type { AIProvider } from "@/lib/ai/contracts";
import { runRoutedAITask } from "@/lib/ai/orchestrator";
import { chooseRoutingDecision } from "@/lib/ai/routing";
import { createStableCacheKey, responseCache } from "@/lib/cache/response-cache";
import { DEMO_VIDEO_ID } from "@/lib/db/demo-data";
import { listToolLogs } from "@/lib/db/demo-store";
import { MockAIAdapter } from "@/lib/adapters/mock-ai-adapter";
import { QuizService } from "@/server/services/quiz-service";
import { TutorService } from "@/server/services/tutor-service";
import { VideoMemoryService } from "@/server/services/video-memory-service";

describe("Phase 10 routing and caching", () => {
  beforeEach(() => responseCache.clear());

  it("creates stable cache keys regardless of object property order", () => {
    expect(createStableCacheKey("test", { b: 2, a: { d: 4, c: 3 } })).toBe(
      createStableCacheKey("test", { a: { c: 3, d: 4 }, b: 2 }),
    );
  });

  it("routes simple tasks to TokenRouter and complex reasoning to Kimi", () => {
    expect(chooseRoutingDecision("quiz", { tokenrouter: true, kimi: true }).provider).toBe("tokenrouter");
    expect(chooseRoutingDecision("misconception", { tokenrouter: true, kimi: true }).provider).toBe("kimi");
    expect(chooseRoutingDecision("practice", { tokenrouter: false, kimi: false }).provider).toBe("mock");
  });

  it("caches repeated timestamp explanations and avoids a second provider call", async () => {
    const provider = new MockAIAdapter();
    const answerSpy = vi.spyOn(provider, "answerQuestion");
    const service = new TutorService(new VideoMemoryService(), provider);

    const first = await service.ask(DEMO_VIDEO_ID, "What is context caching?");
    const second = await service.ask(DEMO_VIDEO_ID, "What is context caching?");

    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(answerSpy).toHaveBeenCalledTimes(1);
    expect(listToolLogs().at(-1)?.operation).toMatch(/cache hit/i);
  });

  it("caches repeated quiz generation", async () => {
    const provider = new MockAIAdapter();
    const quizSpy = vi.spyOn(provider, "generateQuiz");
    const service = new QuizService(provider);

    await service.generate(DEMO_VIDEO_ID, 2);
    await service.generate(DEMO_VIDEO_ID, 2);

    expect(quizSpy).toHaveBeenCalledTimes(1);
    expect(listToolLogs().some((log) => /cache hit · quiz/i.test(log.operation))).toBe(true);
  });

  it("logs a routing decision and falls back when the selected provider fails", async () => {
    const before = listToolLogs().length;
    const routed = await runRoutedAITask(
      "quiz",
      async (provider: AIProvider) => {
        if (provider.name === "TokenRouter") throw new Error("upstream unavailable");
        return "fallback result";
      },
      {
        TOKEN_ROUTER_MODE: "real",
        TOKENROUTER_API_KEY: "test-key",
        TOKENROUTER_BASE_URL: "https://router.example/v1",
        TOKENROUTER_MODEL: "fast-model",
      },
    );

    expect(routed.result).toBe("fallback result");
    expect(routed.provider).toBe("Mock");
    expect(routed.usedFallback).toBe(true);
    const logs = listToolLogs().slice(before);
    expect(logs.some((log) => /route quiz/i.test(log.operation))).toBe(true);
    expect(logs.some((log) => /fallback quiz/i.test(log.operation))).toBe(true);
  });
});
