import type {
  CommandResult,
  SandboxFile,
  SandboxHandle,
  SandboxProvider,
} from "@/lib/sandbox/contracts";

export class MockSandboxAdapter implements SandboxProvider {
  readonly name = "Mock" as const;
  private readonly sandboxes = new Map<string, Map<string, string>>();

  async createSandbox(): Promise<SandboxHandle> {
    const id = `mock-sandbox-${crypto.randomUUID()}`;
    this.sandboxes.set(id, new Map());
    return { id };
  }

  async writeFiles(sandboxId: string, files: SandboxFile[]): Promise<void> {
    const sandbox = this.sandboxes.get(sandboxId);
    if (!sandbox) throw new Error("Sandbox not found.");
    files.forEach((file) => sandbox.set(file.path, file.content));
  }

  async runCommand(sandboxId: string, command: string): Promise<CommandResult> {
    const sandbox = this.sandboxes.get(sandboxId);
    if (!sandbox) throw new Error("Sandbox not found.");
    const source = sandbox.get("practice.js") ?? "";
    const complete = /cache|caching/i.test(source) && /rout|model/i.test(source);
    return {
      exitCode: complete ? 0 : 1,
      output: complete
        ? `Mock sandbox executed: ${command}\nPASS: explanation distinguishes caching from routing.`
        : `Mock sandbox executed: ${command}\nFAIL: mention both caching/reuse and model routing.`,
    };
  }

  async deleteSandbox(sandboxId: string): Promise<void> {
    this.sandboxes.delete(sandboxId);
  }
}
