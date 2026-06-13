export type AIProviderName = "mock" | "kimi" | "tokenrouter";

export type AIProviderConfig = {
  provider: AIProviderName;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeoutMs: number;
  maxRetries: number;
};

type Environment = Record<string, string | undefined>;

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAIProviderConfig(env: Environment = process.env): AIProviderConfig {
  const provider = (env.AI_PROVIDER?.toLowerCase() || "mock") as AIProviderName;
  const timeoutMs = parsePositiveInteger(env.AI_TIMEOUT_MS, 15_000);
  const maxRetries = Math.min(parsePositiveInteger(env.AI_MAX_RETRIES, 1), 3);

  if (!(["mock", "kimi", "tokenrouter"] as const).includes(provider)) {
    throw new Error(`Unsupported AI_PROVIDER: ${env.AI_PROVIDER}`);
  }

  if (provider === "kimi") {
    return {
      provider,
      apiKey: env.KIMI_API_KEY || env.MOONSHOT_API_KEY,
      baseUrl: env.KIMI_BASE_URL || "https://api.moonshot.ai/v1",
      model: env.KIMI_MODEL || "kimi-k2.6",
      timeoutMs,
      maxRetries,
    };
  }

  if (provider === "tokenrouter") {
    return {
      provider,
      apiKey: env.TOKENROUTER_API_KEY,
      baseUrl: env.TOKENROUTER_BASE_URL,
      model: env.TOKENROUTER_MODEL,
      timeoutMs,
      maxRetries,
    };
  }

  return { provider, timeoutMs, maxRetries };
}

export function assertRealProviderConfig(config: AIProviderConfig) {
  if (config.provider === "mock") {
    return;
  }

  if (!config.apiKey) {
    throw new Error(`${config.provider} requires an API key.`);
  }

  if (!config.baseUrl) {
    throw new Error(`${config.provider} requires a base URL.`);
  }

  if (!config.model) {
    throw new Error(`${config.provider} requires a model name.`);
  }
}
