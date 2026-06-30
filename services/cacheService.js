const TTL_MS = 5 * 60 * 1000; // 5분
const store = new Map();

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCache(key, value) {
  store.set(key, { value, ts: Date.now() });
}

export async function withCache(key, fn) {
  const cached = getCache(key);
  if (cached !== null) return cached;
  const result = await fn();
  setCache(key, result);
  return result;
}
