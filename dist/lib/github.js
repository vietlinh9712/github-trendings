"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTrendingRepos = fetchTrendingRepos;
const axios_1 = __importDefault(require("axios"));
const cache_1 = require("./cache");
const GITHUB_API = 'https://api.github.com';
const PER_PAGE = 100;
const MAX_PAGES = 5;
function buildSearchQuery(options) {
    const now = new Date();
    const windowDays = options.window === '24h' ? 1 : options.window === '7d' ? 7 : 30;
    const date = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    let query = `created:>${dateStr} stars:>5`;
    if (options.lang) {
        query += ` language:${options.lang}`;
    }
    return query;
}
function windowToDays(window) {
    return window === '24h' ? 1 : window === '7d' ? 7 : 30;
}
async function fetchTrendingRepos(options) {
    const cacheKey = `github:search:${JSON.stringify(options)}`;
    const cached = options.cache ? cache_1.cache.get(cacheKey) : null;
    if (cached)
        return cached;
    const query = buildSearchQuery(options);
    const allRepos = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
        const url = `${GITHUB_API}/search/repositories`;
        const params = {
            q: query,
            sort: 'stars',
            order: 'desc',
            per_page: PER_PAGE,
            page,
        };
        try {
            const response = await axios_1.default.get(url, {
                params,
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    'User-Agent': 'findstars-cli',
                },
            });
            const items = response.data.items.map(item => ({
                name: item.name,
                full_name: item.full_name,
                description: item.description,
                stargazers_count: item.stargazers_count,
                language: item.language,
                html_url: item.html_url,
                created_at: item.created_at,
                topics: item.topics || [],
                pushed_at: item.pushed_at,
            }));
            allRepos.push(...items);
            if (items.length < PER_PAGE)
                break;
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err) && err.response?.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Use --no-cache to use cached data or wait an hour.');
            }
            if (axios_1.default.isAxiosError(err) && err.response?.status === 422) {
                // Too many results, just return what we have
                break;
            }
            throw err;
        }
    }
    if (options.cache) {
        cache_1.cache.set(cacheKey, allRepos);
    }
    return allRepos;
}
//# sourceMappingURL=github.js.map