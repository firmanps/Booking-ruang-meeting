type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const responseCache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<unknown>>();
let cacheRevision = 0;
const MAX_CACHE_ENTRIES = 100;

/** Shares concurrent GET requests and briefly reuses successful responses. */
export function getCachedApiRequest<T>(
  key: string,
  request: () => Promise<T>,
  ttlMs = 1_000,
): Promise<T> {
  const now = Date.now();
  for (const [cacheKey, entry] of responseCache) {
    if (entry.expiresAt <= now) responseCache.delete(cacheKey);
  }

  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > now) return Promise.resolve(cached.value as T);
  if (cached) responseCache.delete(key);

  const pending = pendingRequests.get(key);
  if (pending) return pending as Promise<T>;

  const revisionAtRequest = cacheRevision;
  const promise = Promise.resolve()
    .then(request)
    .then((value) => {
      if (ttlMs > 0 && cacheRevision === revisionAtRequest) {
        responseCache.set(key, { value, expiresAt: Date.now() + ttlMs });
        if (responseCache.size > MAX_CACHE_ENTRIES) {
          const oldestKey = responseCache.keys().next().value;
          if (oldestKey) responseCache.delete(oldestKey);
        }
      }
      return value;
    })
    .finally(() => {
      if (pendingRequests.get(key) === promise) pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}

/** Invalidates matching cache entries and prevents older requests from repopulating them. */
export function invalidateApiCache(prefix?: string) {
  cacheRevision += 1;

  if (!prefix) {
    responseCache.clear();
    pendingRequests.clear();
    return;
  }

  for (const key of responseCache.keys()) {
    if (key.startsWith(prefix)) responseCache.delete(key);
  }
  for (const key of pendingRequests.keys()) {
    if (key.startsWith(prefix)) pendingRequests.delete(key);
  }
}
