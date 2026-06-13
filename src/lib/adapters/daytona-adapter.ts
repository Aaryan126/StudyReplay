import { Daytona, type Sandbox } from "@daytona/sdk";

import type { SandboxConfig } from "@/lib/sandbox/config";
import type {
  CommandResult,
  SandboxFile,
  SandboxHandle,
  SandboxProvider,
} from "@/lib/sandbox/contracts";

export class DaytonaAdapter implements SandboxProvider {
  readonly name = "Daytona" as const;
  private readonly client: Daytona;
  private readonly sandboxes = new Map<string, Sandbox>();

  constructor(config: SandboxConfig) {
    if (!config.apiKey) throw new Error("Daytona requires DAYTONA_API_KEY.");
    this.client = new Daytona({
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      target: config.target,
    });
  }

  async createSandbox(): Promise<SandboxHandle> {
    const sandbox = await this.client.create({
      language: "typescript",
      autoStopInterval: 15,
      autoDeleteInterval: 60,
      labels: { application: "studyreplay", purpose: "practice" },
    });
    this.sandboxes.set(sandbox.id, sandbox);
    return { id: sandbox.id };
  }

  async writeFiles(sandboxId: string, files: SandboxFile[]): Promise<void> {
    const sandbox = await this.getSandbox(sandboxId);
    await Promise.all(
      files.map((file) => sandbox.fs.uploadFile(Buffer.from(file.content), file.path)),
    );
  }

  async runCommand(sandboxId: string, command: string): Promise<CommandResult> {
    const sandbox = await this.getSandbox(sandboxId);
    const result = await sandbox.process.executeCommand(command, undefined, undefined, 30);
    return { exitCode: result.exitCode, output: result.result };
  }

  async deleteSandbox(sandboxId: string): Promise<void> {
    const sandbox = await this.getSandbox(sandboxId);
    await this.client.delete(sandbox, 30);
    this.sandboxes.delete(sandboxId);
  }

  private async getSandbox(sandboxId: string): Promise<Sandbox> {
    const existing = this.sandboxes.get(sandboxId);
    if (existing) return existing;
    const sandbox = await this.client.get(sandboxId);
    this.sandboxes.set(sandboxId, sandbox);
    return sandbox;
  }
}
