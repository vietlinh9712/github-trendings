export interface Repo {
    name: string;
    full_name: string;
    description: string | null;
    stargazers_count: number;
    language: string | null;
    html_url: string;
    created_at: string;
    topics: string[];
    pushed_at: string;
}
export interface ScoredRepo extends Repo {
    score: number;
    velocity: number;
    rank: number;
    burst: boolean;
}
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
}
export interface DiscoverOptions {
    window: '24h' | '7d' | '30d';
    lang?: string;
    limit: number;
    json: boolean;
    cache: boolean;
}
export interface GitHubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: Repo[];
}
export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
}
//# sourceMappingURL=types.d.ts.map