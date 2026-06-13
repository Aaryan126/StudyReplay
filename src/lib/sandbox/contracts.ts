export type SandboxFile = {
  path: string;
  content: string;
};

export type SandboxHandle = {
  id: string;
};

export type CommandResult = {
  exitCode: number;
  output: string;
};

export interface SandboxProvider {
  readonly name: "Mock" | "Daytona";
  createSandbox(): Promise<SandboxHandle>;
  writeFiles(sandboxId: string, files: SandboxFile[]): Promise<void>;
  runCommand(sandboxId: string, command: string): Promise<CommandResult>;
  deleteSandbox(sandboxId: string): Promise<void>;
}
