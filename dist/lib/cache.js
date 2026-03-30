"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.Cache = void 0;
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
class Cache {
    store = new Map();
    hits = 0;
    misses = 0;
    get(key, ttlMs = DEFAULT_TTL_MS) {
        const entry = this.store.get(key);
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
    set(key, data) {
        this.store.set(key, { data, timestamp: Date.now() });
    }
    clear() {
        this.store.clear();
        this.hits = 0;
        this.misses = 0;
    }
    stats() {
        return {
            hits: this.hits,
            misses: this.misses,
            size: this.store.size,
        };
    }
}
exports.Cache = Cache;
exports.cache = new Cache();
//# sourceMappingURL=cache.js.map