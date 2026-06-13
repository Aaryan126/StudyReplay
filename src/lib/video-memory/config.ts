export type VideoMemoryMode = "mock" | "videodb" | "local";

export type VideoDBConfig = {
  mode: VideoMemoryMode;
  apiKey?: string;
  baseUrl: string;
  collectionId: string;
  videoId?: string;
  timeoutMs: number;
};

type Environment = Record<string, string | undefined>;

export function getVideoDBConfig(env: Environment = process.env): VideoDBConfig {
  const mode = (env.VIDEO_MEMORY_PROVIDER?.toLowerCase() || "mock") as VideoMemoryMode;
  if (!(["mock", "videodb", "local"] as const).includes(mode)) {
    throw new Error(`Unsupported VIDEO_MEMORY_PROVIDER: ${env.VIDEO_MEMORY_PROVIDER}`);
  }

  const parsedTimeout = Number(env.VIDEODB_TIMEOUT_MS);
  return {
    mode,
    apiKey: env.VIDEODB_API_KEY,
    baseUrl: (env.VIDEODB_BASE_URL || "https://api.videodb.io").replace(/\/$/, ""),
    collectionId: env.VIDEODB_COLLECTION_ID || "default",
    videoId: env.VIDEODB_VIDEO_ID,
    timeoutMs: Number.isInteger(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 10_000,
  };
}

export function assertVideoDBConfig(config: VideoDBConfig) {
  if (config.mode !== "videodb") return;
  if (!config.apiKey) throw new Error("VideoDB requires VIDEODB_API_KEY.");
  if (!config.baseUrl) throw new Error("VideoDB requires VIDEODB_BASE_URL.");
}
