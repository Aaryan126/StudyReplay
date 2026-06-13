import { KimiAdapter } from "@/lib/adapters/kimi-adapter";
import { MockAIAdapter } from "@/lib/adapters/mock-ai-adapter";
import { TokenRouterAdapter } from "@/lib/adapters/token-router-adapter";
import type { AIProvider } from "@/lib/ai/contracts";
import type { AIProviderConfig } from "@/lib/ai/provider-config";
import { chooseRoutingDecision, type AITask } from "@/lib/ai/routing";
import { createToolLog } from "@/lib/db/demo-store";

type Environment = Record<string, string | undefined>;

function realConfig(provider: "kimi" | "tokenrouter", env: Environment): AIProviderConfig {
  return {
    provider,
    apiKey: provider === "kimi" ? env.KIMI_API_KEY || env.MOONSHOT_API_KEY : env.TOKENROUTER_API_KEY,
    baseUrl: provider === "kimi" ? env.KIMI_BASE_URL || "https://api.moonshot.ai/v1" : env.TOKENROUTER_BASE_URL,
    model: provider === "kimi" ? env.KIMI_MODEL || "kimi-k2.6" : env.TOKENROUTER_MODEL,
    timeoutMs: Number(env.AI_TIMEOUT_MS) || 15_000,
    maxRetries: Math.min(Number(env.AI_MAX_RETRIES) || 1, 3),
  };
}

function isComplete(config: AIProviderConfig) {
  return Boolean(config.apiKey && config.baseUrl && config.model);
}

export type RoutedAIResult<T> = {
  result: T;
  provider: AIProvider["name"];
  usedFallback: boolean;
};

export async function runRoutedAITask<T>(
  task: AITask,
  operation: (provider: AIProvider) => Promise<T>,
  env: Environment = process.env,
  fetcher: typeof fetch = fetch,
): Promise<RoutedAIResult<T>> {
  const kimi = realConfig("kimi", env);
  const tokenrouter = realConfig("tokenrouter", env);
  const decision = chooseRoutingDecision(task, {
    kimi: env.AI_PROVIDER?.toLowerCase() === "kimi" && isComplete(kimi),
    tokenrouter: env.TOKEN_ROUTER_MODE?.toLowerCase() === "real" && isComplete(tokenrouter),
  });
  const startedAt = performance.now();
  createToolLog({
    tool: "TokenRouter",
    operation: `Route ${task} · ${decision.complexity}`,
    status: "success",
    latencyMs: 0,
    outputSummary: `${decision.reason} Selected ${decision.provider}.`,
  });

  const fallback = new MockAIAdapter();
  const provider: AIProvider = decision.provider === "kimi"
    ? new KimiAdapter(kimi, fetcher)
    : decision.provider === "tokenrouter"
      ? new TokenRouterAdapter(tokenrouter, fetcher)
      : fallback;

  try {
    return { result: await operation(provider), provider: provider.name, usedFallback: decision.provider === "mock" };
  } catch (error) {
    if (decision.provider === "mock") throw error;
    createToolLog({
      tool: "TokenRouter",
      operation: `Fallback ${task}`,
      status: "success",
      latencyMs: Math.max(0, Math.round(performance.now() - startedAt)),
      outputSummary: `${provider.name} failed; continued with deterministic mock provider.`,
    });
    return { result: await operation(fallback), provider: fallback.name, usedFallback: true };
  }
}
