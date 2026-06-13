import { KimiAdapter } from "@/lib/adapters/kimi-adapter";
import { MockAIAdapter } from "@/lib/adapters/mock-ai-adapter";
import { TokenRouterAdapter } from "@/lib/adapters/token-router-adapter";
import type { AIProvider } from "@/lib/ai/contracts";
import { getAIProviderConfig } from "@/lib/ai/provider-config";

type Environment = Record<string, string | undefined>;

export function createAIProvider(env: Environment = process.env, fetcher: typeof fetch = fetch): AIProvider {
  const config = getAIProviderConfig(env);

  switch (config.provider) {
    case "kimi":
      return new KimiAdapter(config, fetcher);
    case "tokenrouter":
      return new TokenRouterAdapter(config, fetcher);
    default:
      return new MockAIAdapter();
  }
}
