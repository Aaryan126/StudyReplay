import { OpenAICompatibleAIAdapter } from "@/lib/adapters/openai-compatible-ai-adapter";
import type { AIProviderConfig } from "@/lib/ai/provider-config";

export class TokenRouterAdapter extends OpenAICompatibleAIAdapter {
  readonly name = "TokenRouter" as const;
  protected readonly toolName = "TokenRouter" as const;

  constructor(config: AIProviderConfig, fetcher: typeof fetch = fetch) {
    super(config, fetcher);
  }
}
