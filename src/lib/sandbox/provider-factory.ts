import { DaytonaAdapter } from "@/lib/adapters/daytona-adapter";
import { MockSandboxAdapter } from "@/lib/adapters/mock-sandbox-adapter";
import { getSandboxConfig } from "@/lib/sandbox/config";
import type { SandboxProvider } from "@/lib/sandbox/contracts";

type Environment = Record<string, string | undefined>;

let provider: SandboxProvider | undefined;
let providerKey = "";

export function createSandboxProvider(env: Environment = process.env): SandboxProvider {
  const config = getSandboxConfig(env);
  const nextKey = `${config.provider}:${config.apiKey ?? ""}:${config.apiUrl ?? ""}:${config.target ?? ""}`;
  if (provider && providerKey === nextKey) return provider;

  provider = config.provider === "daytona"
    ? new DaytonaAdapter(config)
    : new MockSandboxAdapter();
  providerKey = nextKey;
  return provider;
}
