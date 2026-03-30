import { CacheEntry, CacheStats } from '../types';

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class Cache {
  private store = new Map<string, CacheEntry<unknown>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string, ttlMs = DEFAULT_TTL_MS): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      this.misses++;
      return null;
    }
    if (Date.now() - entry.timestamp > ttlMs) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  stats(): CacheStats {
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.store.size,
    };
  }
}

export const cache = new Cache();
