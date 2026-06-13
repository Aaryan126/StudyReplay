import type { AIProviderConfig } from "@/lib/ai/provider-config";
import { OpenAICompatibleAIAdapter } from "@/lib/adapters/openai-compatible-ai-adapter";

export class KimiAdapter extends OpenAICompatibleAIAdapter {
  readonly name = "Kimi" as const;
  protected readonly toolName = "Kimi" as const;

  constructor(config: AIProviderConfig, fetcher: typeof fetch = fetch) {
    super(config, fetcher);
  }
}
