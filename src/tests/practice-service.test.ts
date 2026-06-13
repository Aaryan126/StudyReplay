import type { AIProvider } from "@/lib/ai/contracts";
import { MockAIAdapter } from "@/lib/adapters/mock-ai-adapter";
import { MockSandboxAdapter } from "@/lib/adapters/mock-sandbox-adapter";
import type { SandboxProvider } from "@/lib/sandbox/contracts";
import { PracticeService } from "@/server/services/practice-service";

describe("PracticeService", () => {
  it("generates a task, provisions a sandbox, and returns run output", async () => {
    const sandbox = new MockSandboxAdapter();
    const result = await new PracticeService(new MockAIAdapter(), sandbox).generate(
      "quiz-cache-routing",
      "Context caching vs model routing",
    );

    expect(result.sandboxStatus).toBe("ready");
    expect(result.sandboxProvider).toBe("Mock");
    expect(result.sandboxId).toMatch(/^mock-sandbox-/);
    expect(result.task.starterCode).toMatch(/caching/i);
    expect(result.output).toMatch(/PASS/);

    const rerun = await new PracticeService(new MockAIAdapter(), sandbox).run(
      result.sandboxId!,
      'console.log("Caching reuses work and routing selects a model");',
    );
    expect(rerun.exitCode).toBe(0);
  });

  it("returns a text-only task when sandbox provisioning fails", async () => {
    const unavailableSandbox = {
      name: "Daytona",
      createSandbox: vi.fn(async () => { throw new Error("Provider unavailable"); }),
    } as unknown as SandboxProvider;

    const result = await new PracticeService(
      new MockAIAdapter() as AIProvider,
      unavailableSandbox,
    ).generate("quiz-cache-routing", "Confused concepts");

    expect(result.sandboxStatus).toBe("fallback");
    expect(result.task.instructions).toBeTruthy();
    expect(result.fallbackReason).toMatch(/provider unavailable/i);
  });
});
