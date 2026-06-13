import { LocalVideoMemoryAdapter } from "@/lib/adapters/local-video-memory-adapter";
import { MockVideoDBAdapter } from "@/lib/adapters/mock-videodb-adapter";
import { VideoDBAdapter } from "@/lib/adapters/videodb-adapter";
import { getVideoDBConfig } from "@/lib/video-memory/config";
import type { VideoMemoryProvider } from "@/lib/video-memory/contracts";

type Environment = Record<string, string | undefined>;

export function createVideoMemoryProvider(
  env: Environment = process.env,
  fetcher: typeof fetch = fetch,
): VideoMemoryProvider {
  const config = getVideoDBConfig(env);
  if (config.mode === "videodb") return new VideoDBAdapter(config, fetcher);
  if (config.mode === "local") return new LocalVideoMemoryAdapter();
  return new MockVideoDBAdapter();
}
