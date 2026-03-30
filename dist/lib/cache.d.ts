import { CacheStats } from '../types';
export declare class Cache {
    private store;
    private hits;
    private misses;
    get<T>(key: string, ttlMs?: number): T | null;
    set<T>(key: string, data: T): void;
    clear(): void;
    stats(): CacheStats;
}
export declare const cache: Cache;
//# sourceMappingURL=cache.d.ts.map