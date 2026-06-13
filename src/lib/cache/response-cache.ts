function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
}

export function createStableCacheKey(namespace: string, input: unknown): string {
  return `${namespace}:${JSON.stringify(canonicalize(input))}`;
}

export class ResponseCache {
  private readonly entries = new Map<string, unknown>();

  get<T>(key: string): T | undefined {
    return this.entries.get(key) as T | undefined;
  }

  set<T>(key: string, value: T): T {
    this.entries.set(key, value);
    return value;
  }

  clear() {
    this.entries.clear();
  }
}

export const responseCache = new ResponseCache();
