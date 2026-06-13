export type SandboxProviderName = "mock" | "daytona";

type Environment = Record<string, string | undefined>;

export type SandboxConfig = {
  provider: SandboxProviderName;
  apiKey?: string;
  apiUrl?: string;
  target?: string;
};

export function getSandboxConfig(env: Environment = process.env): SandboxConfig {
  const provider = (env.SANDBOX_PROVIDER?.toLowerCase() || "mock") as SandboxProviderName;
  if (provider !== "mock" && provider !== "daytona") {
    throw new Error(`Unsupported SANDBOX_PROVIDER: ${env.SANDBOX_PROVIDER}`);
  }

  return {
    provider,
    apiKey: env.DAYTONA_API_KEY,
    apiUrl: env.DAYTONA_API_URL,
    target: env.DAYTONA_TARGET,
  };
}
