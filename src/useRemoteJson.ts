import { useEffect, useState } from "react";

interface CacheEntry {
  data: unknown;
  fetchedAt: number;
}

// Module-level — shared by every component calling this hook with the
// same `url` in the same session, so only the first one actually fetches.
const cache = new Map<string, CacheEntry>();

export interface UseRemoteJsonResult<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

// Fetches and JSON-parses `url` once, keeping the result in memory for
// `ttlMs` (default 12h) so every consumer mounting during that window
// reuses the same result instead of re-fetching. Never throws into the
// caller — a failed fetch (offline, CDN hiccup, ...) just leaves `data`
// null and `error` true, so a banner/list built on this can simply render
// nothing rather than break the page it's on.
export function useRemoteJson<T>(url: string, ttlMs = 12 * 60 * 60 * 1000): UseRemoteJsonResult<T> {
  const cached = cache.get(url);
  const isFresh = !!cached && Date.now() - cached.fetchedAt < ttlMs;
  const [data, setData] = useState<T | null>(isFresh ? (cached!.data as T) : null);
  const [loading, setLoading] = useState(!isFresh);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isFresh) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(url, { data: json, fetchedAt: Date.now() });
        setData(json as T);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error };
}
