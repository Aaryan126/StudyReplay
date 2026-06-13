import type { AIProvider } from "@/lib/ai/contracts";
import { runRoutedAITask } from "@/lib/ai/orchestrator";
import { createToolLog, getQuizQuestionById, getTranscriptByVideoId } from "@/lib/db/demo-store";
import { createSandboxProvider } from "@/lib/sandbox/provider-factory";
import type { SandboxProvider } from "@/lib/sandbox/contracts";
import type { PracticeSession } from "@/lib/types";

const DEFAULT_STARTER = `const explanation = "TODO: explain the difference";\n\nconsole.log(explanation);`;

export class PracticeService {
  constructor(
    private readonly ai?: AIProvider,
    private readonly sandbox: SandboxProvider = createSandboxProvider(),
  ) {}

  async generate(questionId: string, misconception?: string): Promise<PracticeSession> {
    const question = getQuizQuestionById(questionId);
    if (!question) throw new Error("Quiz question not found.");

    const evidence = getTranscriptByVideoId(question.videoId).filter(
      (segment) => segment.endSec > question.sourceStartSec && segment.startSec < question.sourceEndSec,
    );
    const input = {
      concept: question.question,
      misconception,
      evidence,
    };
    const task = this.ai
      ? await this.ai.generatePractice(input)
      : (await runRoutedAITask("practice", (provider) => provider.generatePractice(input))).result;
    const normalizedTask = { ...task, starterCode: task.starterCode ?? DEFAULT_STARTER };
    const startedAt = performance.now();

    try {
      const handle = await this.sandbox.createSandbox();
      await this.sandbox.writeFiles(handle.id, [
        { path: "practice.js", content: normalizedTask.starterCode },
      ]);
      const result = await this.sandbox.runCommand(handle.id, "node practice.js");
      createToolLog({
        tool: this.sandbox.name === "Daytona" ? "Daytona" : "Local",
        operation: `${this.sandbox.name} · Create and verify practice sandbox`,
        status: "success",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
        outputSummary: `Sandbox ready; initial run exited with code ${result.exitCode}.`,
      });
      return {
        task: normalizedTask,
        sandboxId: handle.id,
        sandboxProvider: this.sandbox.name,
        sandboxStatus: "ready",
        output: result.output,
        exitCode: result.exitCode,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Sandbox unavailable.";
      createToolLog({
        tool: this.sandbox.name === "Daytona" ? "Daytona" : "Local",
        operation: `${this.sandbox.name} · Create practice sandbox`,
        status: "failed",
        latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
        outputSummary: `Text-only fallback: ${reason}`,
      });
      return {
        task: normalizedTask,
        sandboxProvider: this.sandbox.name,
        sandboxStatus: "fallback",
        fallbackReason: reason,
      };
    }
  }

  async run(sandboxId: string, code: string) {
    const startedAt = performance.now();
    await this.sandbox.writeFiles(sandboxId, [{ path: "practice.js", content: code }]);
    const result = await this.sandbox.runCommand(sandboxId, "node practice.js");
    createToolLog({
      tool: this.sandbox.name === "Daytona" ? "Daytona" : "Local",
      operation: `${this.sandbox.name} · Run practice code`,
      status: result.exitCode === 0 ? "success" : "failed",
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputSummary: `Practice run exited with code ${result.exitCode}.`,
    });
    return result;
  }
}
