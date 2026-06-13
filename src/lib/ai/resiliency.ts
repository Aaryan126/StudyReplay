export class ProviderTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`AI provider request timed out after ${timeoutMs} ms.`);
    this.name = "ProviderTimeoutError";
  }
}

export type RetryOptions = {
  timeoutMs: number;
  maxRetries: number;
};

export async function withTimeoutAndRetry<T>(
  operation: (signal: AbortSignal, attempt: number) => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

    try {
      return await operation(controller.signal, attempt);
    } catch (error) {
      lastError = controller.signal.aborted
        ? new ProviderTimeoutError(options.timeoutMs)
        : error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}
